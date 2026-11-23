/* Fee Calculator Suite — calculation engines.
   Ported verbatim from the verified suite implementation (Muse artifact
   "shou-shu-liao-li-yi-ji-suan-suito", v9). Every rate below was confirmed
   on the platform's official fee/help pages on November 18, 2026.
   Rounding rule (uniform): every fee component is rounded to the nearest
   cent FIRST; every total is the sum of already-rounded components, so the
   breakdown always adds up to the total to the cent. */
(function (global) {
  "use strict";

  function r2(v) { return Math.round((v + 1e-9) * 100) / 100; }
  function money(v) { return (v < 0 ? "-$" : "$") + Math.abs(v).toFixed(2); }
  function neg(v) { return "-$" + Math.abs(v).toFixed(2); }
  function pct(v) { return (isFinite(v) ? v : 0).toFixed(1) + "%"; }

  /* Verdict: a judgement label + one sentence of reasoning.
     Thresholds: 40%+ "strong healthy" band; 20%+ healthy; 10%+ thin;
     below that very thin; any loss is called out plainly. */
  function verdictFor(profit, revenue) {
    var margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    var JA = typeof document !== "undefined" && document.documentElement && document.documentElement.lang === "ja";
    var word = JA ? (profit >= 0 ? "この条件では黒字です" : "この条件では赤字です")
                  : (profit >= 0 ? "Profitable at these numbers" : "Losing money at these numbers");
    var v;
    if (JA) {
      if (revenue <= 0) v = { label: "価格を入力すると判定が出ます", cls: "warn", reason: "売上額が入ると判定が表示されます。" };
      else if (profit < 0) v = { label: "✕ 赤字", cls: "neg", reason: "手数料とコストが売上を上回っています。価格を上げるかコストを下げてください。" };
      else if (margin >= 40) v = { label: "✓ 非常に健全な利益率（40%以上）", cls: "pos", reason: "手数料とコストを引いても売上の40%以上が利益に残る、余裕のある水準です。" };
      else if (margin >= 20) v = { label: "✓ 健全な利益率", cls: "pos", reason: "手数料とコストの後も十分な利益が残っています（最上位の40%帯には届きませんが、安定して黒字です）。" };
      else if (margin >= 10) v = { label: "◐ 薄い利益率", cls: "warn", reason: "黒字ではありますが、売上の大半を手数料とコストが占めています。少しのコスト増で利益が消えます。" };
      else v = { label: "◐ 非常に薄い利益率", cls: "warn", reason: "かろうじて黒字です。売上のほぼ全てが手数料とコストに消えるため、追加コストがあれば赤字に転落します。" };
    } else {
      if (revenue <= 0) v = { label: "Enter a price to see the verdict", cls: "warn", reason: "The verdict appears as soon as there is revenue to judge." };
      else if (profit < 0) v = { label: "✕ Losing money", cls: "neg", reason: "Fees and your costs exceed the revenue on this sale — raise the price or cut costs." };
      else if (margin >= 40) v = { label: "✓ Strong Healthy Margin (40%+)", cls: "pos", reason: "A comfortable buffer: after fees and costs, at least 40% of the revenue stays as profit." };
      else if (margin >= 20) v = { label: "✓ Healthy margin", cls: "pos", reason: "A solid buffer after fees and costs — below the 40%+ top band, but comfortably profitable." };
      else if (margin >= 10) v = { label: "◐ Thin margin", cls: "warn", reason: "Profitable, but fees and costs take most of the revenue — a small cost rise can erase this profit." };
      else v = { label: "◐ Very thin margin", cls: "warn", reason: "Barely profitable: almost all of the revenue goes to fees and costs, so any extra cost tips this sale into a loss." };
    }
    v.margin = margin;
    v.word = word;
    return v;
  }

  /* Break-even: binary search on item price using the platform's own
     (rounded) profit function, so tiers/caps/tax are handled exactly. */
  function breakEven(profitAt) {
    if (profitAt(0) >= 0) return 0;
    var lo = 0, hi = 1;
    while (profitAt(hi) < 0 && hi < 10000000) { hi *= 2; }
    if (profitAt(hi) < 0) return null;
    for (var i = 0; i < 80; i++) { var mid = (lo + hi) / 2; if (profitAt(mid) < 0) lo = mid; else hi = mid; }
    return r2(hi);
  }

  /* ---- eBay engine — official schedule (Seller Center / Help, Nov 18 2026)
     Fee base = item price + shipping charged + sales tax ("total amount of
     the sale"). FVF tiered per item: 13.6% up to $7,500, 2.35% above.
     Per-order fee: $0.30 if base <= $10, else $0.40. Promoted: % of base.
     Top Rated Plus: 10% discount on the percentage FVF only — the per-order
     fee is NOT discounted. International fee: intlPct of the same total
     amount, rate set by the seller's registered country (Japan 1.35% etc.). */
  function ebayCalc(price, ship, tax, cost, shipcost, promoPct, trp, intlPct) {
    var revenue = r2(price + ship);
    var base = r2(price + ship + tax);
    var fvf1 = r2(Math.min(base, 7500) * 0.136);
    var fvf2 = r2(Math.max(0, base - 7500) * 0.0235);
    var trpDisc = trp ? r2((fvf1 + fvf2) * 0.10) : 0;
    var orderFee = base === 0 ? 0 : (base <= 10 ? 0.30 : 0.40);
    var promoFee = r2(base * (promoPct / 100));
    var intlFee = r2(base * ((intlPct || 0) / 100));
    var fees = r2(fvf1 + fvf2 - trpDisc + orderFee + promoFee + intlFee);
    var keep = r2(revenue - fees);
    var profit = r2(keep - cost - shipcost);
    return { revenue: revenue, base: base, fvf1: fvf1, fvf2: fvf2, trpDisc: trpDisc, orderFee: orderFee, promoFee: promoFee,
             intlFee: intlFee, fees: fees, keep: keep, costs: r2(cost + shipcost), profit: profit };
  }

  /* ---- Etsy engine — official Fees & Payments Policy (Nov 18 2026)
     Transaction 6.5% on price+shipping (US: NOT on sales tax).
     Processing 3% on price+shipping+TAX + $0.25 (assessed incl. tax/postage).
     Regulatory % on price+shipping, 9 countries only (US: not charged).
     Offsite Ads % on price+shipping (US: NOT on tax), capped at $100/order. */
  function etsyCalc(price, ship, tax, cost, shipcost, regPct, offsitePct) {
    var revenue = r2(price + ship);
    var trans = r2(revenue * 0.065);
    var proc = r2(r2((price + ship + tax) * 0.03) + 0.25);
    var reg = r2(revenue * (regPct / 100));
    var off = Math.min(r2(revenue * (offsitePct / 100)), 100);
    var fees = r2(0.20 + trans + proc + reg + off);
    var keep = r2(revenue - fees);
    var profit = r2(keep - cost - shipcost);
    return { revenue: revenue, trans: trans, proc: proc, reg: reg, off: off, fees: fees,
             keep: keep, costs: r2(cost + shipcost), profit: profit };
  }

  /* ---- Poshmark engine — official Support Center (Nov 18 2026)
     $2.95 flat under $15; 20% at $15+. Fee on the item price only: the
     buyer-paid prepaid label is neither revenue nor fee base. */
  function poshCalc(price, cost, shipcost) {
    var revenue = r2(price);
    var fee = price <= 0 ? 0 : (price < 15 ? 2.95 : r2(price * 0.20));
    var fees = r2(fee);
    var keep = r2(revenue - fees);
    var profit = r2(keep - cost - shipcost);
    return { revenue: revenue, fee: fees, fees: fees, keep: keep, costs: r2(cost + shipcost), profit: profit };
  }

  /* ---- Mercari engine — official Help Center FAQ (Nov 18 2026)
     Selling fee 10% of completed item price + buyer-paid shipping.
     No payment processing fee. Buyer Protection 3.6% is buyer-paid and
     never deducted from the seller (returned for display only). */
  function mercariCalc(price, ship, cost, shipcost) {
    var revenue = r2(price + ship);
    var fee = r2(revenue * 0.10);
    var fees = fee;
    var keep = r2(revenue - fees);
    var profit = r2(keep - cost - shipcost);
    return { revenue: revenue, fee: fee, buyerFee: r2(revenue * 0.036), fees: fees, keep: keep, costs: r2(cost + shipcost), profit: profit };
  }

  /* ---- Amazon engine — official pricing page (Nov 18 2026), referral only.
     Base = total sales price (item + shipping charged). Bracket categories
     (clothing/beauty/baby/grocery) apply one rate to the whole total, set by
     the bracket the total falls in. Portion categories (elecacc/jewelry/
     watches) charge each rate on its portion only. Minimum $0.30 where
     Amazon lists one (not for grocery/media/videogames). Media adds the
     official $1.80 closing fee. Selling-plan and FBA fees are out of scope. */
  function amazonReferral(base, cat) {
    var JA = typeof document !== "undefined" && document.documentElement && document.documentElement.lang === "ja";
    if (base <= 0) return { fee: 0, closing: 0, label: JA ? "販売手数料" : "Referral fee" };
    var fee = 0, label = "";
    function portion(bands) {
      var total = 0, prev = 0;
      for (var i = 0; i < bands.length; i++) {
        var upTo = bands[i][0], rate = bands[i][1];
        if (base > prev) total += r2((Math.min(base, upTo) - prev) * rate);
        prev = upTo;
      }
      return total;
    }
    switch (cat) {
      case "clothing":
        var cr = base <= 15 ? 0.05 : (base <= 20 ? 0.10 : 0.17);
        fee = r2(base * cr); label = JA ? "販売手数料 — 衣類、全額に" + (cr * 100).toFixed(0) + "%（区分料率）" : "Referral fee — Clothing, " + (cr * 100).toFixed(0) + "% bracket on the whole total"; break;
      case "beauty":
        var br = base <= 10 ? 0.08 : 0.15;
        fee = r2(base * br); label = JA ? "販売手数料 — 美容・健康、全額に" + (br * 100).toFixed(0) + "%（区分料率）" : "Referral fee — Beauty/Health, " + (br * 100).toFixed(0) + "% bracket on the whole total"; break;
      case "baby":
        var yr = base <= 10 ? 0.08 : 0.15;
        fee = r2(base * yr); label = JA ? "販売手数料 — ベビー用品、全額に" + (yr * 100).toFixed(0) + "%（区分料率）" : "Referral fee — Baby Products, " + (yr * 100).toFixed(0) + "% bracket on the whole total"; break;
      case "grocery":
        var gr = base <= 15 ? 0.08 : 0.15;
        fee = r2(base * gr); label = JA ? "販売手数料 — 食料品、全額に" + (gr * 100).toFixed(0) + "%（区分料率・最低手数料の記載なし）" : "Referral fee — Grocery, " + (gr * 100).toFixed(0) + "% bracket on the whole total (no minimum listed)"; break;
      case "electronics": fee = r2(base * 0.08); label = JA ? "販売手数料 — 家電、8%" : "Referral fee — Consumer Electronics, 8%"; break;
      case "computers": fee = r2(base * 0.08); label = JA ? "販売手数料 — パソコン、8%" : "Referral fee — Computers, 8%"; break;
      case "automotive": fee = r2(base * 0.12); label = JA ? "販売手数料 — 自動車用品、12%" : "Referral fee — Automotive, 12%"; break;
      case "elecacc": fee = portion([[100, 0.15], [Infinity, 0.08]]); label = JA ? "販売手数料 — 家電アクセサリ、$100まで15%、超過分8%" : "Referral fee — Electronics Accessories, 15% to $100 then 8%"; break;
      case "jewelry": fee = portion([[250, 0.20], [Infinity, 0.05]]); label = JA ? "販売手数料 — ジュエリー、$250まで20%、超過分5%" : "Referral fee — Jewelry, 20% to $250 then 5%"; break;
      case "watches": fee = portion([[1500, 0.16], [Infinity, 0.03]]); label = JA ? "販売手数料 — 時計、$1,500まで16%、超過分3%" : "Referral fee — Watches, 16% to $1,500 then 3%"; break;
      case "media": fee = r2(base * 0.15); label = JA ? "販売手数料 — メディア、15%（下記の$1.80クロージングフィー別）" : "Referral fee — Media, 15% (plus $1.80 closing fee below)"; break;
      case "videogames": fee = r2(base * 0.15); label = JA ? "販売手数料 — ゲーム、15%（最低手数料の記載なし）" : "Referral fee — Video Games, 15% (no minimum listed)"; break;
      default: fee = r2(base * 0.15); label = JA ? "販売手数料 — 15%" : "Referral fee — 15%";
    }
    var closing = cat === "media" ? 1.80 : 0;
    var noMin = (cat === "grocery" || cat === "media" || cat === "videogames");
    if (!noMin && fee < 0.30) { fee = 0.30; label += JA ? " · 最低手数料$0.30を適用" : " · $0.30 minimum applied"; }
    return { fee: fee, closing: closing, label: label };
  }
  function amazonCalc(price, ship, cost, shipcost, cat) {
    var revenue = r2(price + ship);
    var base = revenue;
    var rr = amazonReferral(base, cat);
    var fees = r2(rr.fee + rr.closing);
    var keep = r2(revenue - fees);
    var profit = r2(keep - cost - shipcost);
    return { revenue: revenue, base: base, fee: rr.fee, closing: rr.closing, label: rr.label, fees: fees, keep: keep, costs: r2(cost + shipcost), profit: profit };
  }

  /* ---- Depop engine — official Help Centre (Nov 18 2026)
     No selling fee for US/UK/AUS sellers. Processing on price+ship+tax:
     US 3.3% + $0.45; UK 2.9% + £0.30. Percentage part rounded first. */
  function depopCalc(price, ship, tax, cost, shipcost, region) {
    var revenue = r2(price + ship);
    var base = r2(price + ship + tax);
    var pctRate = region === "uk" ? 0.029 : 0.033;
    var fixed = region === "uk" ? 0.30 : 0.45;
    var proc = base <= 0 ? 0 : r2(r2(base * pctRate) + fixed);
    var fees = proc;
    var keep = r2(revenue - fees);
    var profit = r2(keep - cost - shipcost);
    return { revenue: revenue, proc: proc, fees: fees, keep: keep, costs: r2(cost + shipcost), profit: profit };
  }

  /* ---- Vinted engine — official Price List / Help Centre (Nov 18 2026)
     No seller fee of any kind. Buyer pays the Vinted fee (usually
     5% + $0.70 in the US) on their side; shown for information only.
     Revenue is the item price alone: shipping is paid by the buyer
     directly and never passes through the seller. */
  function vintedCalc(price, cost, shipcost) {
    var revenue = r2(price);
    var fees = 0;
    var keep = revenue;
    var profit = r2(keep - cost - shipcost);
    return { revenue: revenue, fees: fees, buyerFee: r2(r2(price * 0.05) + 0.70), keep: keep, costs: r2(cost + shipcost), profit: profit };
  }

  /* ---- Whatnot engine — official Help Center (Nov 18 2026)
     Commission on the item price only (GMV): US Standard tier 8%,
     Coins & Money 4%. Processing 2.9% + $0.30 on the total order
     value (item + buyer-paid shipping + tax). */
  function whatnotCalc(price, ship, tax, cost, shipcost, commPct) {
    var revenue = r2(price + ship);
    var comm = r2(price * (commPct / 100));
    var proc = (price + ship + tax) <= 0 ? 0 : r2(r2((price + ship + tax) * 0.029) + 0.30);
    var fees = r2(comm + proc);
    var keep = r2(revenue - fees);
    var profit = r2(keep - cost - shipcost);
    return { revenue: revenue, comm: comm, proc: proc, fees: fees, keep: keep, costs: r2(cost + shipcost), profit: profit };
  }

  /* ---- TikTok Shop (US) referral fee — verified 2026-11-23 on TikTok's
     official Seller University pages (category referral table + Referral
     Fee Updates). Referral Fee = rate x (Customer Payment + Platform
     Discount - Tax); the base includes the shipping fee paid by the
     customer. Rates: 6% standard; 5% fine jewelry (diamond, gold, jade,
     platinum/carat gold, ruby/sapphire/emerald) and Pre-Owned;
     Collectibles 6% and Pre-Owned 5%, with any portion of the sale over
     $10,000 at 3% (the tier is applied to the fee base). The referral fee
     is TikTok's only per-order platform fee — per its policy it
     "encompasses all TikTok Shop fees, with the exception of shipping
     and tax fees". Deliberately NOT added to platformCalc: the
     comparison and batch tools keep their eight-platform scope. ---- */
  function tiktokCalc(price, ship, discount, tax, cost, shipcost, group) {
    var revenue = r2(price + ship);
    var base = Math.max(0, r2(price + ship + discount - tax));
    var rate = (group === "jewelry" || group === "preowned") ? 5 : 6;
    var fee;
    if (group === "collectibles" || group === "preowned") {
      fee = r2(Math.min(base, 10000) * rate / 100 + Math.max(0, base - 10000) * 0.03);
    } else {
      fee = r2(base * rate / 100);
    }
    var keep = r2(revenue - fee);
    var profit = r2(keep - cost - shipcost);
    return { revenue: revenue, base: base, rate: rate, fees: fee, keep: keep, costs: r2(cost + shipcost), profit: profit };
  }

  /* ---- Facebook Marketplace (US) Selling Fee — Meta Commerce Payments
     Terms, Merchant Policies: Individual Sellers pay 10% per transaction,
     minimum $0.80, calculated on the entire transaction amount (sale
     price + shipping fees + applicable taxes). Applies to shipped orders
     sold through Marketplace checkout; local pickup sales are not
     checkout transactions and carry no Selling Fee. Sales tax is
     collected by Meta and passed through, so it raises the fee base but
     is not seller revenue here. Deliberately NOT added to platformCalc
     (the fee depends on checkout vs pickup). ---- */
  function fbCalc(price, ship, tax, cost, shipcost, shipped) {
    var revenue = r2(price + ship);
    var total = r2(price + ship + tax);
    var fee = (shipped && total > 0) ? Math.max(0.80, r2(total * 0.10)) : 0;
    var keep = r2(revenue - fee);
    var profit = r2(keep - cost - shipcost);
    return { revenue: revenue, total: total, fees: fee, keep: keep, costs: r2(cost + shipcost), profit: profit };
  }

  /* ---- Unified engine for comparison / reverse pricing ----
     Defaults: eBay no tax, no promo, no TRP, US location; Etsy US seller,
     no Offsite Ads; Poshmark ignores the shipping-charged column (buyer-paid
     label) but still deducts the seller's actual shipping cost. */
  function platformCalc(key, price, ship, cost, shipcost) {
    if (key === "etsy") return etsyCalc(price, ship, 0, cost, shipcost, 0, 0);
    if (key === "poshmark") { var p = poshCalc(price, cost, shipcost); return { revenue: p.revenue, fees: p.fees, keep: p.keep, costs: p.costs, profit: p.profit }; }
    if (key === "mercari") return mercariCalc(price, ship, cost, shipcost);
    if (key === "amazon") return amazonCalc(price, ship, cost, shipcost, "everything");
    if (key === "depop") return depopCalc(price, ship, 0, cost, shipcost, "us");
    if (key === "vinted") return vintedCalc(price, cost, shipcost);
    if (key === "whatnot") return whatnotCalc(price, ship, 0, cost, shipcost, 8);
    return ebayCalc(price, ship, 0, cost, shipcost, 0, false, 0);
  }
  var PLATFORM_NAMES = { ebay: "eBay (US)", etsy: "Etsy (US)", poshmark: "Poshmark (US)", mercari: "Mercari (US)", amazon: "Amazon (US)", depop: "Depop (US)", vinted: "Vinted (US)", whatnot: "Whatnot (US)" };

  var api = { r2: r2, money: money, neg: neg, pct: pct, verdictFor: verdictFor, breakEven: breakEven,
              ebayCalc: ebayCalc, etsyCalc: etsyCalc, poshCalc: poshCalc, mercariCalc: mercariCalc,
              amazonReferral: amazonReferral, amazonCalc: amazonCalc, depopCalc: depopCalc,
              vintedCalc: vintedCalc, whatnotCalc: whatnotCalc, tiktokCalc: tiktokCalc, fbCalc: fbCalc, platformCalc: platformCalc,
              PLATFORM_NAMES: PLATFORM_NAMES };
  global.FeeEngines = api;
  if (typeof module !== "undefined" && module.exports) { module.exports = api; }
})(typeof window !== "undefined" ? window : globalThis);
