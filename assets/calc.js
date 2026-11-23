/* Fee Calculator Suite — DOM wiring. All calculation lives in engines.js;
   this file only reads inputs, renders results, and never sends data
   anywhere. Inputs stay in the visitor's browser. */
(function () {
  "use strict";
  var E = window.FeeEngines;
  var $ = function (id) { return document.getElementById(id); };
  function num(id) { var el = $(id); if (!el) return 0; var v = parseFloat(el.value); return isNaN(v) || v < 0 ? 0 : v; }
  function on(id, ev, fn) { var el = $(id); if (el) el.addEventListener(ev, fn); }
  var summaries = {};

  function setResult(prefix, r, cur) {
    cur = cur || "$";
    var fmt = function (v) { return (v < 0 ? "-" + cur : cur) + Math.abs(v).toFixed(2); };
    var nfmt = function (v) { return "-" + cur + Math.abs(v).toFixed(2); };
    var hero = $(prefix + "-hero");
    $(prefix + "-profit").textContent = fmt(r.profit);
    if (hero) hero.classList.toggle("neg", r.profit < 0);
    var v = E.verdictFor(r.profit, r.revenue);
    $(prefix + "-margin-line").innerHTML =
      '<span class="verdict ' + v.cls + '">' + v.label + '</span>' +
      '<div class="verdict-reason">Margin <span class="pill mono">' + E.pct(v.margin) + '</span> &nbsp;' +
      v.word + ' — ' + v.reason + '</div>';
    /* Composition bar: revenue split into profit / fees / costs. */
    var pSeg = Math.max(0, r.profit), denom = pSeg + r.fees + r.costs;
    var set = function (id, val) { var el = $(id); if (el) el.style.width = (denom > 0 ? (val / denom * 100) : 0) + "%"; };
    set(prefix + "-bar-profit", pSeg); set(prefix + "-bar-fees", r.fees); set(prefix + "-bar-costs", r.costs);
    var lv = function (id, val) { var el = $(id); if (el) el.textContent = fmt(val); };
    lv(prefix + "-bar-profit-v", r.profit); lv(prefix + "-bar-fees-v", r.fees); lv(prefix + "-bar-costs-v", r.costs);
    return { fmt: fmt, nfmt: nfmt };
  }

  function bindCopy() {
    document.querySelectorAll(".copy-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        var p = b.getAttribute("data-prefix");
        var msg = document.querySelector('.copy-msg[data-for="' + p + '"]');
        var done = function () { if (msg) { msg.textContent = "Copied."; setTimeout(function () { msg.textContent = ""; }, 2000); } };
        if (navigator.clipboard && summaries[p]) { navigator.clipboard.writeText(summaries[p]).then(done, done); }
      });
    });
  }

  /* ================= eBay ================= */
  function calcEbay() {
    if (!$("eb-price")) return;
    var ship = num("eb-ship"), tax = num("eb-tax"), cost = num("eb-cost"), sc = num("eb-shipcost"), promo = num("eb-promo");
    var intlPct = parseFloat($("eb-loc").value) || 0;
    var trpSel = $("eb-trp");
    if (intlPct > 0 && trpSel.value === "1") { trpSel.value = "0"; }
    trpSel.disabled = intlPct > 0;
    var trp = trpSel.value === "1";
    var price = num("eb-price");
    var r = E.ebayCalc(price, ship, tax, cost, sc, promo, trp, intlPct);
    var f = setResult("eb", r);
    $("eb-gross").textContent = f.fmt(r.revenue);
    $("eb-base").textContent = f.fmt(r.base);
    $("eb-fvf1").textContent = f.nfmt(r.fvf1);
    $("eb-fvf2").textContent = f.nfmt(r.fvf2);
    $("eb-fvf2-row").style.display = r.base > 7500 ? "" : "none";
    $("eb-order").textContent = f.nfmt(r.orderFee) + (r.base <= 10 && r.base > 0 ? " ($0.30 tier)" : "");
    $("eb-promofee").textContent = f.nfmt(r.promoFee);
    $("eb-promo-row").style.display = promo > 0 ? "" : "none";
    $("eb-trpdisc").textContent = "+" + f.fmt(r.trpDisc);
    $("eb-trp-row").style.display = trp ? "" : "none";
    $("eb-intlfee").textContent = f.nfmt(r.intlFee);
    $("eb-intl-label").textContent = intlPct.toFixed(2) + "%";
    $("eb-intl-row").style.display = intlPct > 0 ? "" : "none";
    $("eb-fees").textContent = f.nfmt(r.fees);
    $("eb-keep").textContent = f.fmt(r.keep);
    $("eb-costs").textContent = f.nfmt(r.costs);
    $("eb-eff").textContent = E.pct(r.revenue > 0 ? r.fees / r.revenue * 100 : 0);
    var be = E.breakEven(function (p) { return E.ebayCalc(p, ship, tax, cost, sc, promo, trp, intlPct).profit; });
    $("eb-be").textContent = be === null ? "—" : f.fmt(be);
    summaries.eb = "eBay (US): price " + f.fmt(price) + " + shipping " + f.fmt(ship) + " → fees " + f.fmt(r.fees) +
      ", net profit " + f.fmt(r.profit) + " (margin " + E.pct(r.revenue > 0 ? r.profit / r.revenue * 100 : 0) + "). Rates verified November 18, 2026.";
  }

  /* ================= Etsy ================= */
  function calcEtsy() {
    if (!$("et-price")) return;
    var ship = num("et-ship"), tax = num("et-tax"), cost = num("et-cost"), sc = num("et-shipcost");
    var reg = parseFloat($("et-country").value) || 0;
    var off = parseFloat($("et-offsite").value) || 0;
    var price = num("et-price");
    var r = E.etsyCalc(price, ship, tax, cost, sc, reg, off);
    var f = setResult("et", r);
    $("et-gross").textContent = f.fmt(r.revenue);
    $("et-trans").textContent = f.nfmt(r.trans);
    $("et-proc").textContent = f.nfmt(r.proc);
    $("et-reg").textContent = f.nfmt(r.reg) + (reg === 0 ? " (US: not charged)" : "");
    $("et-offsitefee").textContent = f.nfmt(r.off);
    $("et-offsite-row").style.display = off > 0 ? "" : "none";
    $("et-fees").textContent = f.nfmt(r.fees);
    $("et-keep").textContent = f.fmt(r.keep);
    $("et-costs").textContent = f.nfmt(r.costs);
    $("et-eff").textContent = E.pct(r.revenue > 0 ? r.fees / r.revenue * 100 : 0);
    var be = E.breakEven(function (p) { return E.etsyCalc(p, ship, tax, cost, sc, reg, off).profit; });
    $("et-be").textContent = be === null ? "—" : f.fmt(be);
    summaries.et = "Etsy (US): price " + f.fmt(price) + " + shipping " + f.fmt(ship) + " → fees " + f.fmt(r.fees) +
      ", net profit " + f.fmt(r.profit) + " (margin " + E.pct(r.revenue > 0 ? r.profit / r.revenue * 100 : 0) + "). Rates verified November 18, 2026.";
  }

  /* ================= Poshmark ================= */
  function calcPoshmark() {
    if (!$("pm-price")) return;
    var cost = num("pm-cost"), sc = num("pm-shipcost"), price = num("pm-price");
    var r = E.poshCalc(price, cost, sc);
    var f = setResult("pm", r);
    $("pm-gross").textContent = f.fmt(r.revenue);
    $("pm-fee-label").textContent = price < 15 ? "Poshmark commission — $2.95 flat (sale under $15)" : "Poshmark commission — 20% of the sale price";
    $("pm-fee").textContent = f.nfmt(r.fee);
    $("pm-fees").textContent = f.nfmt(r.fees);
    $("pm-keep").textContent = f.fmt(r.keep);
    $("pm-costs").textContent = f.nfmt(r.costs);
    $("pm-eff").textContent = E.pct(r.revenue > 0 ? r.fees / r.revenue * 100 : 0);
    var be = E.breakEven(function (p) { return E.poshCalc(p, cost, sc).profit; });
    $("pm-be").textContent = be === null ? "—" : f.fmt(be);
    summaries.pm = "Poshmark (US): price " + f.fmt(price) + " → fees " + f.fmt(r.fees) +
      ", net profit " + f.fmt(r.profit) + " (margin " + E.pct(r.revenue > 0 ? r.profit / r.revenue * 100 : 0) + "). Rates verified November 18, 2026.";
  }

  /* ================= Mercari ================= */
  function calcMercari() {
    if (!$("mc-price")) return;
    var ship = num("mc-ship"), cost = num("mc-cost"), sc = num("mc-shipcost"), price = num("mc-price");
    var r = E.mercariCalc(price, ship, cost, sc);
    var f = setResult("mc", r);
    $("mc-gross").textContent = f.fmt(r.revenue);
    $("mc-fee").textContent = f.nfmt(r.fee);
    $("mc-bp").textContent = f.fmt(r.buyerFee);
    $("mc-fees").textContent = f.nfmt(r.fees);
    $("mc-keep").textContent = f.fmt(r.keep);
    $("mc-costs").textContent = f.nfmt(r.costs);
    $("mc-eff").textContent = E.pct(r.revenue > 0 ? r.fees / r.revenue * 100 : 0);
    var be = E.breakEven(function (p) { return E.mercariCalc(p, ship, cost, sc).profit; });
    $("mc-be").textContent = be === null ? "—" : f.fmt(be);
    summaries.mc = "Mercari (US): price " + f.fmt(price) + " + shipping " + f.fmt(ship) + " → fees " + f.fmt(r.fees) +
      ", net profit " + f.fmt(r.profit) + " (margin " + E.pct(r.revenue > 0 ? r.profit / r.revenue * 100 : 0) + "). Rates verified November 18, 2026.";
  }

  /* ================= Amazon ================= */
  function calcAmazon() {
    if (!$("am-price")) return;
    var ship = num("am-ship"), cost = num("am-cost"), sc = num("am-shipcost"), cat = $("am-cat").value, price = num("am-price");
    var r = E.amazonCalc(price, ship, cost, sc, cat);
    var f = setResult("am", r);
    $("am-gross").textContent = f.fmt(r.revenue);
    $("am-base").textContent = f.fmt(r.base);
    $("am-fee-label").textContent = r.label;
    $("am-fee").textContent = f.nfmt(r.fee);
    $("am-closing-row").style.display = r.closing > 0 ? "" : "none";
    $("am-fees").textContent = f.nfmt(r.fees);
    $("am-keep").textContent = f.fmt(r.keep);
    $("am-costs").textContent = f.nfmt(r.costs);
    $("am-eff").textContent = E.pct(r.revenue > 0 ? r.fees / r.revenue * 100 : 0);
    var be = E.breakEven(function (p) { return E.amazonCalc(p, ship, cost, sc, cat).profit; });
    $("am-be").textContent = be === null ? "—" : f.fmt(be);
    summaries.am = "Amazon (US, referral fee only): price " + f.fmt(price) + " + shipping " + f.fmt(ship) + " → fees " + f.fmt(r.fees) +
      ", net profit " + f.fmt(r.profit) + " (margin " + E.pct(r.revenue > 0 ? r.profit / r.revenue * 100 : 0) + "). Rates verified November 18, 2026.";
  }

  /* ================= Depop ================= */
  function calcDepop() {
    if (!$("dp-price")) return;
    var ship = num("dp-ship"), tax = num("dp-tax"), cost = num("dp-cost"), sc = num("dp-shipcost"), region = $("dp-region").value;
    var cur = region === "uk" ? "£" : "$";
    document.querySelectorAll(".dp-cur").forEach(function (el) { el.textContent = cur; });
    var price = num("dp-price");
    var r = E.depopCalc(price, ship, tax, cost, sc, region);
    var f = setResult("dp", r, cur);
    $("dp-gross").textContent = f.fmt(r.revenue);
    $("dp-proc").textContent = f.nfmt(r.proc);
    $("dp-proc-label").textContent = region === "uk" ? "Payment processing — 2.9% of price + shipping + tax, + £0.30" : "Payment processing — 3.3% of price + shipping + tax, + $0.45";
    $("dp-fees").textContent = f.nfmt(r.fees);
    $("dp-keep").textContent = f.fmt(r.keep);
    $("dp-costs").textContent = f.nfmt(r.costs);
    $("dp-eff").textContent = E.pct(r.revenue > 0 ? r.fees / r.revenue * 100 : 0);
    var be = E.breakEven(function (p) { return E.depopCalc(p, ship, tax, cost, sc, region).profit; });
    $("dp-be").textContent = be === null ? "—" : cur + be.toFixed(2);
    summaries.dp = "Depop (" + (region === "uk" ? "UK" : "US") + "): price " + f.fmt(price) + " + shipping " + f.fmt(ship) + " → fees " + f.fmt(r.fees) +
      ", net profit " + f.fmt(r.profit) + " (margin " + E.pct(r.revenue > 0 ? r.profit / r.revenue * 100 : 0) + "). Rates verified November 18, 2026.";
  }

  /* ================= Vinted ================= */
  function calcVinted() {
    if (!$("vt-price")) return;
    var cost = num("vt-cost"), sc = num("vt-shipcost"), price = num("vt-price");
    var r = E.vintedCalc(price, cost, sc);
    var f = setResult("vt", r);
    $("vt-gross").textContent = f.fmt(r.revenue);
    $("vt-buyerfee").textContent = f.fmt(r.buyerFee) + " (buyer pays)";
    $("vt-fees").textContent = f.fmt(r.fees);
    $("vt-keep").textContent = f.fmt(r.keep);
    $("vt-costs").textContent = f.nfmt(r.costs);
    $("vt-eff").textContent = E.pct(0);
    var be = E.breakEven(function (p) { return E.vintedCalc(p, cost, sc).profit; });
    $("vt-be").textContent = be === null ? "—" : f.fmt(be);
    summaries.vt = "Vinted (US): price " + f.fmt(price) + " → seller fees $0.00, net profit " + f.fmt(r.profit) +
      " (margin " + E.pct(r.revenue > 0 ? r.profit / r.revenue * 100 : 0) + "). Rates verified November 18, 2026.";
  }

  /* ================= Whatnot ================= */
  function calcWhatnot() {
    if (!$("wn-price")) return;
    var ship = num("wn-ship"), tax = num("wn-tax"), cost = num("wn-cost"), sc = num("wn-shipcost"), price = num("wn-price");
    var commPct = parseFloat($("wn-cat").value) || 8;
    var r = E.whatnotCalc(price, ship, tax, cost, sc, commPct);
    var f = setResult("wn", r);
    $("wn-gross").textContent = f.fmt(r.revenue);
    $("wn-comm-label").textContent = "Commission — " + commPct.toFixed(0) + "% of the item price only (Standard tier)";
    $("wn-comm").textContent = f.nfmt(r.comm);
    $("wn-proc").textContent = f.nfmt(r.proc);
    $("wn-fees").textContent = f.nfmt(r.fees);
    $("wn-keep").textContent = f.fmt(r.keep);
    $("wn-costs").textContent = f.nfmt(r.costs);
    $("wn-eff").textContent = E.pct(r.revenue > 0 ? r.fees / r.revenue * 100 : 0);
    var be = E.breakEven(function (p) { return E.whatnotCalc(p, ship, tax, cost, sc, commPct).profit; });
    $("wn-be").textContent = be === null ? "—" : f.fmt(be);
    summaries.wn = "Whatnot (US, Standard tier): price " + f.fmt(price) + " + shipping " + f.fmt(ship) + " → fees " + f.fmt(r.fees) +
      ", net profit " + f.fmt(r.profit) + " (margin " + E.pct(r.revenue > 0 ? r.profit / r.revenue * 100 : 0) + "). Rates verified November 18, 2026.";
  }

  /* ================= Comparison ================= */
  var CMP_DEFS = [
    { key: "ebay", name: "eBay", href: "/ebay-fee-calculator/", feeLabel: "13.6% up to $7,500, then 2.35% · + per-order fee" },
    { key: "etsy", name: "Etsy", href: "/etsy-fee-calculator/", feeLabel: "$0.20 + 6.5% + 3% + $0.25 · regulatory n/a (US)" },
    { key: "poshmark", name: "Poshmark", href: "/poshmark-fee-calculator/", feeLabel: "$2.95 under $15 · 20% at $15+ · on item price only" },
    { key: "mercari", name: "Mercari", href: "/mercari-fee-calculator/", feeLabel: "10% of price + buyer-paid shipping · no processing fee" },
    { key: "amazon", name: "Amazon", href: "/amazon-referral-fee-calculator/", feeLabel: "Referral only · Everything Else 15% (category selector on its page)" },
    { key: "depop", name: "Depop", href: "/depop-fee-calculator/", feeLabel: "No selling fee (US) · processing 3.3% + $0.45" },
    { key: "vinted", name: "Vinted", href: "/vinted-fee-calculator/", feeLabel: "No seller fee · buyer pays the Vinted fee" },
    { key: "whatnot", name: "Whatnot", href: "/whatnot-fee-calculator/", feeLabel: "Commission 8% on item price + 2.9% + $0.30 processing (Standard)" }
  ];
  function calcCompare() {
    if (!$("cmp-price")) return;
    var price = num("cmp-price"), ship = num("cmp-ship"), cost = num("cmp-cost"), sc = num("cmp-shipcost");
    var rows = CMP_DEFS.map(function (d) {
      var r = E.platformCalc(d.key, price, ship, cost, sc);
      var be = E.breakEven(function (p) { return E.platformCalc(d.key, p, ship, cost, sc).profit; });
      return { d: d, r: r, be: be };
    });
    var best = Math.max.apply(null, rows.map(function (x) { return x.r.profit; }));
    var worst = Math.min.apply(null, rows.map(function (x) { return x.r.profit; }));
    var win = rows.filter(function (x) { return x.r.profit === best; })[0];
    var lose = rows.filter(function (x) { return x.r.profit === worst; })[0];
    var verdictEl = $("cmp-verdict");
    if (verdictEl && win && lose) {
      var diff = E.r2(best - worst), head, body;
      if (best < 0) {
        head = "Every platform loses money on this item — " + win.d.name + " loses least";
        body = E.money(best) + " is the best result of the eight, and it is still a loss. Raise the price or cut costs before listing anywhere.";
      } else if (diff > 0) {
        head = win.d.name + " pays you most on this item";
        body = "Net profit " + E.money(best) + " — " + E.money(diff) + " more per sale than " + lose.d.name + " (" + E.money(worst) + "), the lowest of the eight. Same item, same costs: the platform choice alone is worth " + E.money(diff) + ".";
      } else {
        head = "All eight platforms pay the same on this item";
        body = "Net profit " + E.money(best) + " everywhere — at these numbers the fee schedules happen to offset each other.";
      }
      verdictEl.innerHTML = "<strong>" + head + ".</strong> " + body +
        ' &nbsp;<a class="btn small" href="' + win.d.href + '">Open the ' + win.d.name + ' calculator →</a>';
    }
    var tbody = $("cmp-rows");
    if (tbody) {
      tbody.innerHTML = rows.map(function (x) {
        var margin = x.r.revenue > 0 ? (x.r.profit / x.r.revenue * 100) : 0;
        return '<tr' + (x.r.profit === best ? ' class="best"' : '') + '><td><a href="' + x.d.href + '"><strong>' + x.d.name + '</strong></a>' +
          (x.r.profit === best ? ' · best net' : '') + '<br><span style="color:var(--muted);font-size:13px">' + x.d.feeLabel + '</span></td>' +
          '<td class="num">' + E.money(x.r.fees) + '</td><td class="num">' + E.money(x.r.profit) + '</td>' +
          '<td class="num">' + E.pct(margin) + '</td><td class="num">' + (x.be === null ? "—" : E.money(x.be)) + '</td></tr>';
      }).join("");
    }
    var bars = $("cmp-bars");
    if (bars) {
      var maxAbs = Math.max.apply(null, rows.map(function (x) { return Math.abs(x.r.profit); }).concat([1]));
      bars.innerHTML = rows.map(function (x) {
        var w = Math.abs(x.r.profit) / maxAbs * 100;
        return '<div class="bar-row"><span class="nm">' + x.d.name + '</span><span class="track"><span class="fill' +
          (x.r.profit < 0 ? ' loss' : '') + '" style="display:block;width:' + w + '%"></span></span>' +
          '<span class="amt mono">' + E.money(x.r.profit) + '</span></div>';
      }).join("");
    }
    var tiles = $("cmp-tiles");
    if (tiles) {
      tiles.innerHTML = rows.map(function (x) {
        return '<a class="tile' + (x.r.profit === best ? ' best' : '') + '" href="' + x.d.href + '"><div class="t-name">' + x.d.name + '</div>' +
          '<div class="t-rate">' + x.d.feeLabel + '</div><div class="t-profit">Net profit <b>' + E.money(x.r.profit) + '</b></div></a>';
      }).join("");
    }
  }

  /* ================= eBay reverse pricing ================= */
  var revMode = "amt";
  function calcReverse() {
    if (!$("rev-target")) return;
    var target = num("rev-target"), ship = num("rev-ship"), cost = num("rev-cost"), sc = num("rev-shipcost");
    var gap = function (p) {
      var r = E.ebayCalc(p, ship, 0, cost, sc, 0, false, 0);
      return revMode === "amt" ? r.profit - target : r.profit - (target / 100) * r.revenue;
    };
    var price = null;
    if (gap(0) >= 0) { price = 0; }
    else {
      var lo = 0, hi = 1;
      while (gap(hi) < 0 && hi < 10000000) { hi *= 2; }
      if (gap(hi) >= 0) { for (var i = 0; i < 80; i++) { var mid = (lo + hi) / 2; if (gap(mid) < 0) lo = mid; else hi = mid; } price = E.r2(hi); }
    }
    if (price === null) {
      $("rev-price").textContent = "—";
      $("rev-sub").textContent = "No price up to $10,000,000 reaches this target on eBay — the target is at or above what the fee structure leaves.";
      $("rev-check").textContent = "Verification: target not reachable at any tested price.";
      return;
    }
    var r = E.ebayCalc(price, ship, 0, cost, sc, 0, false, 0);
    $("rev-price").textContent = E.money(price);
    $("rev-sub").textContent = "List at this price on eBay (US) to hit your target.";
    if (revMode === "amt") {
      var diff = E.r2(r.profit - target);
      $("rev-check").textContent = "Verification: this price was run back through the normal eBay calculator — profit comes out at " + E.money(r.profit) +
        " against a " + E.money(target) + " target (" + (diff === 0 ? "exact match" : (diff > 0 ? "+" : "−") + "$" + Math.abs(diff).toFixed(2) + " from cent-rounding of individual fees") + ").";
    } else {
      var margin = r.revenue > 0 ? r.profit / r.revenue * 100 : 0;
      $("rev-check").textContent = "Verification: this price was run back through the normal eBay calculator — margin comes out at " + E.pct(margin) +
        " against a " + E.pct(target) + " target (any small gap is cent-rounding of individual fees).";
    }
    summaries.rev = "eBay (US) reverse pricing: to net " + (revMode === "amt" ? E.money(target) : E.pct(target) + " margin") +
      " with shipping charged " + E.money(ship) + ", item cost " + E.money(cost) + ", shipping cost " + E.money(sc) +
      " → list at " + E.money(price) + ". Rates verified November 18, 2026.";
  }

  /* ================= eBay vs Etsy page ================= */
  function calcVs() {
    if (!$("vs-eb-fees")) return;
    var eb = E.ebayCalc(50, 5, 0, 20, 6, 0, false, 0);
    var et = E.etsyCalc(50, 5, 0, 20, 6, 0, 0);
    var set = function (id, v) { var el = $(id); if (el) el.textContent = v; };
    set("vs-eb-fees", E.money(eb.fees)); set("vs-eb-profit", E.money(eb.profit));
    set("vs-et-fees", E.money(et.fees)); set("vs-et-profit", E.money(et.profit));
    var diff = E.r2(et.profit - eb.profit);
    set("vs-diff", diff === 0 ? "$0.00" : (diff > 0 ? E.money(diff) + " more on Etsy" : E.money(-diff) + " more on eBay"));
  }

  /* ================= Init ================= */
  function bind(ids, ev, fn) { ids.forEach(function (id) { on(id, ev, fn); }); }
  bind(["eb-price", "eb-ship", "eb-tax", "eb-cost", "eb-shipcost", "eb-promo"], "input", calcEbay);
  bind(["eb-trp", "eb-loc"], "change", calcEbay);
  bind(["et-price", "et-ship", "et-tax", "et-cost", "et-shipcost"], "input", calcEtsy);
  bind(["et-country", "et-offsite"], "change", calcEtsy);
  bind(["pm-price", "pm-cost", "pm-shipcost"], "input", calcPoshmark);
  bind(["mc-price", "mc-ship", "mc-cost", "mc-shipcost"], "input", calcMercari);
  bind(["am-price", "am-ship", "am-cost", "am-shipcost"], "input", calcAmazon);
  bind(["am-cat"], "change", calcAmazon);
  bind(["dp-price", "dp-ship", "dp-tax", "dp-cost", "dp-shipcost"], "input", calcDepop);
  bind(["dp-region"], "change", calcDepop);
  bind(["vt-price", "vt-cost", "vt-shipcost"], "input", calcVinted);
  bind(["wn-price", "wn-ship", "wn-tax", "wn-cost", "wn-shipcost"], "input", calcWhatnot);
  bind(["wn-cat"], "change", calcWhatnot);
  bind(["cmp-price", "cmp-ship", "cmp-cost", "cmp-shipcost"], "input", calcCompare);
  bind(["rev-target", "rev-ship", "rev-cost", "rev-shipcost"], "input", calcReverse);
  on("rev-mode-amt", "click", function () { revMode = "amt"; $("rev-mode-amt").setAttribute("aria-pressed", "true"); $("rev-mode-margin").setAttribute("aria-pressed", "false"); $("rev-target-label").textContent = "Target profit per sale"; $("rev-target-prefix").textContent = "$"; calcReverse(); });
  on("rev-mode-margin", "click", function () { revMode = "margin"; $("rev-mode-amt").setAttribute("aria-pressed", "false"); $("rev-mode-margin").setAttribute("aria-pressed", "true"); $("rev-target-label").textContent = "Target margin (% of revenue)"; $("rev-target-prefix").textContent = "%"; calcReverse(); });

  document.querySelectorAll(".preset").forEach(function (b) {
    b.addEventListener("click", function () {
      var map = JSON.parse(b.getAttribute("data-v"));
      Object.keys(map).forEach(function (id) { var el = $(id); if (el) el.value = map[id]; });
      [calcEbay, calcEtsy, calcPoshmark, calcMercari, calcAmazon, calcDepop, calcVinted, calcWhatnot].forEach(function (fn) { fn(); });
    });
  });

  calcEbay(); calcEtsy(); calcPoshmark(); calcMercari(); calcAmazon(); calcDepop(); calcVinted(); calcWhatnot();
  calcCompare(); calcReverse(); calcVs();
  bindCopy();
})();
