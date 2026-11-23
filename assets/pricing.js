/* pricing.js — generic SaaS total-cost engine for tallyfee /software/.
   Data: window.SAAS_DATA (assets/saas-data.js), all figures confirmed on vendor pricing pages.
   Models: contact_tier / send_volume (tier tables), per_seat (price x seats + one-time fees). */
(function () {
  'use strict';

  function tierFor(plan, usage) {
    if (!plan.tiers) return null;
    for (var i = 0; i < plan.tiers.length; i++) {
      if (usage <= plan.tiers[i].upTo) return plan.tiers[i];
    }
    return null; // above the highest published tier (custom pricing territory)
  }

  // Monthly-equivalent price of one plan at a usage level, for one billing period.
  // Returns null when the vendor does not publish that figure.
  function planPriceAt(tool, plan, usage, billing) {
    if (tool.model === 'per_seat') {
      var per = billing === 'annual' ? plan.annual : plan.monthly;
      return (per === null || per === undefined) ? null : per;
    }
    var t = tierFor(plan, usage);
    if (!t) return null;
    var v = billing === 'annual' ? (t.annual !== undefined ? t.annual : null) : t.monthly;
    return (v === null || v === undefined) ? null : v;
  }

  // Full cost picture for one tool at (usage, seats).
  // usage = contacts/subscribers (contact_tier), emails per month (send_volume), ignored for per_seat.
  function toolCost(tool, usage, seats, billing) {
    var best = null;
    tool.plans.forEach(function (plan) {
      if (plan.maxSeats !== undefined && seats > plan.maxSeats) return;
      var unit = planPriceAt(tool, plan, usage, billing);
      if (unit === null) return;
      var monthly, oneTime = plan.onboarding || 0;
      if (tool.model === 'per_seat') {
        var n = Math.max(seats || 1, plan.minSeats || 1);
        monthly = unit * n;
      } else {
        monthly = unit;
      }
      var annual = monthly * 12 + oneTime;
      var threeYear = annual + monthly * 24;
      if (!best || annual < best.annualTotal) {
        best = { plan: plan.name, monthly: monthly, annualTotal: annual, threeYear: threeYear, oneTime: oneTime };
      }
    });
    return best; // null = no published price covers this usage/billing combo
  }

  function compareTools(tools, usage, seats, billing) {
    return tools.map(function (tool) {
      return { id: tool.id, name: tool.name, cost: toolCost(tool, usage, seats, billing) };
    }).sort(function (a, b) {
      if (!a.cost) return 1;
      if (!b.cost) return -1;
      return a.cost.annualTotal - b.cost.annualTotal;
    });
  }

  // Cheapest plan (any tool in `toolsA` vs any in `toolsB`) crossover scan.
  // Returns the smallest usage in [from..to] where B becomes cheaper than A, or null.
  function breakEven(toolA, toolB, seats, billing, from, to) {
    var prev = null;
    for (var u = from; u <= to; u += (u < 10000 ? 250 : 1000)) {
      var ca = toolCost(toolA, u, seats, billing);
      var cb = toolCost(toolB, u, seats, billing);
      if (!ca || !cb) continue;
      var diff = ca.annualTotal - cb.annualTotal;
      if (prev !== null && ((prev <= 0 && diff > 0) || (prev >= 0 && diff < 0))) return u;
      prev = diff;
    }
    return null;
  }

  function fmt(n) {
    if (n === null || n === undefined) return '—';
    var r = Math.round(n * 100) / 100;
    return '$' + r.toLocaleString('en-US', { minimumFractionDigits: (r % 1 !== 0 ? 2 : 0), maximumFractionDigits: 2 });
  }

  window.PricingEngine = { tierFor: tierFor, planPriceAt: planPriceAt, toolCost: toolCost, compareTools: compareTools, breakEven: breakEven, fmt: fmt };
  if (typeof module !== 'undefined' && module.exports) module.exports = window.PricingEngine;
})();
