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
  var JA = document.documentElement.lang === "ja";

  /* ---- Input persistence + shareable URLs ----
     On load, URL query parameters win; otherwise the values this
     browser last used on this page (localStorage) are restored.
     On any change, both are updated (history.replaceState), so a
     copied link pre-fills the same numbers for whoever opens it.
     Values never leave the browser — they are only read back here. */
  var PERSIST_KEY = "tf-calc:" + location.pathname;
  function persistFields() {
    return Array.prototype.slice.call(document.querySelectorAll("input[id], select[id]"));
  }
  function collectState() {
    var st = {};
    persistFields().forEach(function (el) { st[el.id] = el.value; });
    if ($("rev-target")) st["rev-mode"] = revMode;
    return st;
  }
  function persistState() {
    if (!persistFields().length) return;
    var st = collectState();
    try { localStorage.setItem(PERSIST_KEY, JSON.stringify(st)); } catch (e) {}
    var qs = new URLSearchParams(st).toString();
    try { history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash); } catch (e) {}
  }
  function restoreState() {
    if (!persistFields().length) return;
    var params = new URLSearchParams(location.search);
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(PERSIST_KEY) || "{}"); } catch (e) { saved = {}; }
    persistFields().forEach(function (el) {
      var v = params.has(el.id) ? params.get(el.id) : saved[el.id];
      if (v !== undefined && v !== null) el.value = v;
    });
    var mode = params.get("rev-mode") || saved["rev-mode"];
    if (mode === "margin" && $("rev-mode-margin")) $("rev-mode-margin").click();
  }

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
      '<div class="verdict-reason">' + (JA ? "利益率" : "Margin") + ' <span class="pill mono">' + E.pct(v.margin) + '</span> &nbsp;' +
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
        var done = function () { if (msg) { msg.textContent = JA ? "コピーしました" : "Copied."; setTimeout(function () { msg.textContent = ""; }, 2000); } };
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
    $("eb-fvf1").textContent = f.fmt(r.fvf1);
    $("eb-fvf2").textContent = f.fmt(r.fvf2);
    $("eb-fvf2-row").style.display = r.base > 7500 ? "" : "none";
    $("eb-order").textContent = f.fmt(r.orderFee) + (r.base <= 10 && r.base > 0 ? (JA ? "（$0.30区分）" : " ($0.30 tier)") : "");
    $("eb-promofee").textContent = f.fmt(r.promoFee);
    $("eb-promo-row").style.display = promo > 0 ? "" : "none";
    $("eb-trpdisc").textContent = "+" + f.fmt(r.trpDisc);
    $("eb-trp-row").style.display = trp ? "" : "none";
    $("eb-intlfee").textContent = f.fmt(r.intlFee);
    $("eb-intl-label").textContent = intlPct.toFixed(2) + "%";
    $("eb-intl-row").style.display = intlPct > 0 ? "" : "none";
    $("eb-fees").textContent = f.fmt(r.fees);
    $("eb-keep").textContent = f.fmt(r.keep);
    $("eb-costs").textContent = f.nfmt(r.costs);
    $("eb-eff").textContent = E.pct(r.revenue > 0 ? r.fees / r.revenue * 100 : 0);
    var be = E.breakEven(function (p) { return E.ebayCalc(p, ship, tax, cost, sc, promo, trp, intlPct).profit; });
    $("eb-be").textContent = be === null ? "—" : f.fmt(be);
    summaries.eb = JA
      ? "eBay（米国）: 価格 " + f.fmt(price) + " + 送料 " + f.fmt(ship) + " → 手数料 " + f.fmt(r.fees) +
        "、純利益 " + f.fmt(r.profit) + "（利益率 " + E.pct(r.revenue > 0 ? r.profit / r.revenue * 100 : 0) + "）。料率は2026年11月18日に確認。"
      : "eBay (US): price " + f.fmt(price) + " + shipping " + f.fmt(ship) + " → fees " + f.fmt(r.fees) +
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
    $("et-trans").textContent = f.fmt(r.trans);
    $("et-proc").textContent = f.fmt(r.proc);
    $("et-reg").textContent = f.fmt(r.reg) + (reg === 0 ? (JA ? "（米国：課金なし）" : " (US: not charged)") : "");
    $("et-offsitefee").textContent = f.fmt(r.off);
    $("et-offsite-row").style.display = off > 0 ? "" : "none";
    $("et-fees").textContent = f.fmt(r.fees);
    $("et-keep").textContent = f.fmt(r.keep);
    $("et-costs").textContent = f.nfmt(r.costs);
    $("et-eff").textContent = E.pct(r.revenue > 0 ? r.fees / r.revenue * 100 : 0);
    var be = E.breakEven(function (p) { return E.etsyCalc(p, ship, tax, cost, sc, reg, off).profit; });
    $("et-be").textContent = be === null ? "—" : f.fmt(be);
    summaries.et = JA
      ? "Etsy（米国）: 価格 " + f.fmt(price) + " + 送料 " + f.fmt(ship) + " → 手数料 " + f.fmt(r.fees) +
        "、純利益 " + f.fmt(r.profit) + "（利益率 " + E.pct(r.revenue > 0 ? r.profit / r.revenue * 100 : 0) + "）。料率は2026年11月18日に確認。"
      : "Etsy (US): price " + f.fmt(price) + " + shipping " + f.fmt(ship) + " → fees " + f.fmt(r.fees) +
        ", net profit " + f.fmt(r.profit) + " (margin " + E.pct(r.revenue > 0 ? r.profit / r.revenue * 100 : 0) + "). Rates verified November 18, 2026.";
  }

  /* ================= Poshmark ================= */
  function calcPoshmark() {
    if (!$("pm-price")) return;
    var cost = num("pm-cost"), sc = num("pm-shipcost"), price = num("pm-price");
    var r = E.poshCalc(price, cost, sc);
    var f = setResult("pm", r);
    $("pm-gross").textContent = f.fmt(r.revenue);
    $("pm-fee-label").textContent = JA ? (price < 15 ? "Poshmark手数料 — $2.95定額（$15未満の販売）" : "Poshmark手数料 — 販売価格の20%") : (price < 15 ? "Poshmark commission — $2.95 flat (sale under $15)" : "Poshmark commission — 20% of the sale price");
    $("pm-fee").textContent = f.fmt(r.fee);
    $("pm-fees").textContent = f.fmt(r.fees);
    $("pm-keep").textContent = f.fmt(r.keep);
    $("pm-costs").textContent = f.nfmt(r.costs);
    $("pm-eff").textContent = E.pct(r.revenue > 0 ? r.fees / r.revenue * 100 : 0);
    var be = E.breakEven(function (p) { return E.poshCalc(p, cost, sc).profit; });
    $("pm-be").textContent = be === null ? "—" : f.fmt(be);
    summaries.pm = JA
      ? "Poshmark（米国）: 価格 " + f.fmt(price) + " → 手数料 " + f.fmt(r.fees) +
        "、純利益 " + f.fmt(r.profit) + "（利益率 " + E.pct(r.revenue > 0 ? r.profit / r.revenue * 100 : 0) + "）。料率は2026年11月18日に確認。"
      : "Poshmark (US): price " + f.fmt(price) + " → fees " + f.fmt(r.fees) +
        ", net profit " + f.fmt(r.profit) + " (margin " + E.pct(r.revenue > 0 ? r.profit / r.revenue * 100 : 0) + "). Rates verified November 18, 2026.";
  }

  /* ================= Mercari ================= */
  function calcMercari() {
    if (!$("mc-price")) return;
    var ship = num("mc-ship"), cost = num("mc-cost"), sc = num("mc-shipcost"), price = num("mc-price");
    var r = E.mercariCalc(price, ship, cost, sc);
    var f = setResult("mc", r);
    $("mc-gross").textContent = f.fmt(r.revenue);
    $("mc-fee").textContent = f.fmt(r.fee);
    $("mc-bp").textContent = f.fmt(r.buyerFee);
    $("mc-fees").textContent = f.fmt(r.fees);
    $("mc-keep").textContent = f.fmt(r.keep);
    $("mc-costs").textContent = f.nfmt(r.costs);
    $("mc-eff").textContent = E.pct(r.revenue > 0 ? r.fees / r.revenue * 100 : 0);
    var be = E.breakEven(function (p) { return E.mercariCalc(p, ship, cost, sc).profit; });
    $("mc-be").textContent = be === null ? "—" : f.fmt(be);
    summaries.mc = JA
      ? "Mercari（米国）: 価格 " + f.fmt(price) + " + 送料 " + f.fmt(ship) + " → 手数料 " + f.fmt(r.fees) +
        "、純利益 " + f.fmt(r.profit) + "（利益率 " + E.pct(r.revenue > 0 ? r.profit / r.revenue * 100 : 0) + "）。料率は2026年11月18日に確認。"
      : "Mercari (US): price " + f.fmt(price) + " + shipping " + f.fmt(ship) + " → fees " + f.fmt(r.fees) +
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
    $("am-fee").textContent = f.fmt(r.fee);
    $("am-closing-row").style.display = r.closing > 0 ? "" : "none";
    $("am-fees").textContent = f.fmt(r.fees);
    $("am-keep").textContent = f.fmt(r.keep);
    $("am-costs").textContent = f.nfmt(r.costs);
    $("am-eff").textContent = E.pct(r.revenue > 0 ? r.fees / r.revenue * 100 : 0);
    var be = E.breakEven(function (p) { return E.amazonCalc(p, ship, cost, sc, cat).profit; });
    $("am-be").textContent = be === null ? "—" : f.fmt(be);
    summaries.am = JA
      ? "Amazon（米国、販売手数料のみ）: 価格 " + f.fmt(price) + " + 送料 " + f.fmt(ship) + " → 手数料 " + f.fmt(r.fees) +
        "、純利益 " + f.fmt(r.profit) + "（利益率 " + E.pct(r.revenue > 0 ? r.profit / r.revenue * 100 : 0) + "）。料率は2026年11月18日に確認。"
      : "Amazon (US, referral fee only): price " + f.fmt(price) + " + shipping " + f.fmt(ship) + " → fees " + f.fmt(r.fees) +
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
    $("dp-proc").textContent = f.fmt(r.proc);
    $("dp-proc-label").textContent = JA ? (region === "uk" ? "決済手数料 — 価格＋送料＋税の2.9% ＋ £0.30" : "決済手数料 — 価格＋送料＋税の3.3% ＋ $0.45") : (region === "uk" ? "Payment processing — 2.9% of price + shipping + tax, + £0.30" : "Payment processing — 3.3% of price + shipping + tax, + $0.45");
    $("dp-fees").textContent = f.fmt(r.fees);
    $("dp-keep").textContent = f.fmt(r.keep);
    $("dp-costs").textContent = f.nfmt(r.costs);
    $("dp-eff").textContent = E.pct(r.revenue > 0 ? r.fees / r.revenue * 100 : 0);
    var be = E.breakEven(function (p) { return E.depopCalc(p, ship, tax, cost, sc, region).profit; });
    $("dp-be").textContent = be === null ? "—" : cur + be.toFixed(2);
    summaries.dp = JA
      ? "Depop（" + (region === "uk" ? "英国" : "米国") + "）: 価格 " + f.fmt(price) + " + 送料 " + f.fmt(ship) + " → 手数料 " + f.fmt(r.fees) +
        "、純利益 " + f.fmt(r.profit) + "（利益率 " + E.pct(r.revenue > 0 ? r.profit / r.revenue * 100 : 0) + "）。料率は2026年11月18日に確認。"
      : "Depop (" + (region === "uk" ? "UK" : "US") + "): price " + f.fmt(price) + " + shipping " + f.fmt(ship) + " → fees " + f.fmt(r.fees) +
        ", net profit " + f.fmt(r.profit) + " (margin " + E.pct(r.revenue > 0 ? r.profit / r.revenue * 100 : 0) + "). Rates verified November 18, 2026.";
  }

  /* ================= Vinted ================= */
  function calcVinted() {
    if (!$("vt-price")) return;
    var cost = num("vt-cost"), sc = num("vt-shipcost"), price = num("vt-price");
    var r = E.vintedCalc(price, cost, sc);
    var f = setResult("vt", r);
    $("vt-gross").textContent = f.fmt(r.revenue);
    $("vt-buyerfee").textContent = f.fmt(r.buyerFee) + (JA ? "（購入者負担）" : " (buyer pays)");
    $("vt-fees").textContent = f.fmt(r.fees);
    $("vt-keep").textContent = f.fmt(r.keep);
    $("vt-costs").textContent = f.nfmt(r.costs);
    $("vt-eff").textContent = E.pct(0);
    var be = E.breakEven(function (p) { return E.vintedCalc(p, cost, sc).profit; });
    $("vt-be").textContent = be === null ? "—" : f.fmt(be);
    summaries.vt = JA
      ? "Vinted（米国）: 価格 " + f.fmt(price) + " → 販売者手数料 $0.00、純利益 " + f.fmt(r.profit) +
        "（利益率 " + E.pct(r.revenue > 0 ? r.profit / r.revenue * 100 : 0) + "）。料率は2026年11月18日に確認。"
      : "Vinted (US): price " + f.fmt(price) + " → seller fees $0.00, net profit " + f.fmt(r.profit) +
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
    $("wn-comm-label").textContent = JA ? "手数料 — 商品価格のみの" + commPct.toFixed(0) + "%（Standardティア）" : "Commission — " + commPct.toFixed(0) + "% of the item price only (Standard tier)";
    $("wn-comm").textContent = f.fmt(r.comm);
    $("wn-proc").textContent = f.fmt(r.proc);
    $("wn-fees").textContent = f.fmt(r.fees);
    $("wn-keep").textContent = f.fmt(r.keep);
    $("wn-costs").textContent = f.nfmt(r.costs);
    $("wn-eff").textContent = E.pct(r.revenue > 0 ? r.fees / r.revenue * 100 : 0);
    var be = E.breakEven(function (p) { return E.whatnotCalc(p, ship, tax, cost, sc, commPct).profit; });
    $("wn-be").textContent = be === null ? "—" : f.fmt(be);
    summaries.wn = JA
      ? "Whatnot（米国、Standardティア）: 価格 " + f.fmt(price) + " + 送料 " + f.fmt(ship) + " → 手数料 " + f.fmt(r.fees) +
        "、純利益 " + f.fmt(r.profit) + "（利益率 " + E.pct(r.revenue > 0 ? r.profit / r.revenue * 100 : 0) + "）。料率は2026年11月18日に確認。"
      : "Whatnot (US, Standard tier): price " + f.fmt(price) + " + shipping " + f.fmt(ship) + " → fees " + f.fmt(r.fees) +
        ", net profit " + f.fmt(r.profit) + " (margin " + E.pct(r.revenue > 0 ? r.profit / r.revenue * 100 : 0) + "). Rates verified November 18, 2026.";
  }

  /* ================= TikTok Shop ================= */
  var TT_RATE_LABELS = {
    standard: "Referral fee — 6% of the fee base",
    jewelry: "Referral fee — 5% of the fee base (fine jewelry)",
    collectibles: "Referral fee — 6%, with 3% on the portion over $10,000",
    preowned: "Referral fee — 5%, with 3% on the portion over $10,000"
  };
  var TT_RATE_LABELS_JA = {
    standard: "紹介手数料 — 課金ベースの6%",
    jewelry: "紹介手数料 — 課金ベースの5%（ファインジュエリー）",
    collectibles: "紹介手数料 — 6%、$10,000超過分は3%",
    preowned: "紹介手数料 — 5%、$10,000超過分は3%"
  };
  var TT_LABELS = JA ? TT_RATE_LABELS_JA : TT_RATE_LABELS;
  var TT_GROUP_JA = { standard: "標準", jewelry: "ファインジュエリー", collectibles: "コレクティブル", preowned: "中古" };
  function calcTiktok() {
    if (!$("tt-price")) return;
    var price = num("tt-price"), ship = num("tt-ship"), disc = num("tt-discount"), tax = num("tt-tax"), cost = num("tt-cost"), sc = num("tt-shipcost");
    var group = $("tt-cat").value;
    var r = E.tiktokCalc(price, ship, disc, tax, cost, sc, group);
    var f = setResult("tt", r);
    $("tt-gross").textContent = f.fmt(r.revenue);
    $("tt-base").textContent = f.fmt(r.base);
    $("tt-rate-label").textContent = TT_LABELS[group] || TT_LABELS.standard;
    $("tt-fee").textContent = f.fmt(r.fees);
    $("tt-fees").textContent = f.fmt(r.fees);
    $("tt-keep").textContent = f.fmt(r.keep);
    $("tt-costs").textContent = f.nfmt(r.costs);
    $("tt-eff").textContent = E.pct(r.revenue > 0 ? r.fees / r.revenue * 100 : 0);
    var be = E.breakEven(function (p) { return E.tiktokCalc(p, ship, disc, tax, cost, sc, group).profit; });
    $("tt-be").textContent = be === null ? "—" : f.fmt(be);
    summaries.tt = JA
      ? "TikTok Shop（米国、" + (TT_GROUP_JA[group] || group) + "）: 価格 " + f.fmt(price) + " + 送料 " + f.fmt(ship) + " → 紹介手数料 " + f.fmt(r.fees) +
        "（課金ベース " + f.fmt(r.base) + "）、純利益 " + f.fmt(r.profit) + "（利益率 " + E.pct(r.revenue > 0 ? r.profit / r.revenue * 100 : 0) + "）。料率は2026年11月23日に確認。"
      : "TikTok Shop (US, " + group + "): price " + f.fmt(price) + " + shipping " + f.fmt(ship) + " → referral fee " + f.fmt(r.fees) +
        " on a fee base of " + f.fmt(r.base) + ", net profit " + f.fmt(r.profit) + " (margin " + E.pct(r.revenue > 0 ? r.profit / r.revenue * 100 : 0) + "). Rates verified November 23, 2026.";
  }

  /* ================= Facebook Marketplace ================= */
  function calcFacebook() {
    if (!$("fb-price")) return;
    var price = num("fb-price"), ship = num("fb-ship"), tax = num("fb-tax"), cost = num("fb-cost"), sc = num("fb-shipcost");
    var shipped = $("fb-type").value === "shipped";
    var r = E.fbCalc(price, ship, tax, cost, sc, shipped);
    var f = setResult("fb", r);
    $("fb-gross").textContent = f.fmt(r.revenue);
    $("fb-total").textContent = f.fmt(r.total);
    $("fb-fee-label").textContent = JA ? (shipped ? "販売手数料 — 取引総額の10%、最低$0.80" : "販売手数料 — 対面受取はなし") : (shipped ? "Selling Fee — 10% of the transaction total, $0.80 minimum" : "Selling Fee — none for local pickup");
    $("fb-fee").textContent = f.fmt(r.fees);
    $("fb-fees").textContent = f.fmt(r.fees);
    $("fb-keep").textContent = f.fmt(r.keep);
    $("fb-costs").textContent = f.nfmt(r.costs);
    $("fb-eff").textContent = E.pct(r.revenue > 0 ? r.fees / r.revenue * 100 : 0);
    var be = E.breakEven(function (p) { return E.fbCalc(p, ship, tax, cost, sc, shipped).profit; });
    $("fb-be").textContent = be === null ? "—" : f.fmt(be);
    summaries.fb = JA
      ? "Facebook Marketplace（米国、" + (shipped ? "配送チェックアウト" : "対面受取") + "）: 価格 " + f.fmt(price) + " + 送料 " + f.fmt(ship) + " → 販売手数料 " + f.fmt(r.fees) +
        "、純利益 " + f.fmt(r.profit) + "（利益率 " + E.pct(r.revenue > 0 ? r.profit / r.revenue * 100 : 0) + "）。料率は2026年11月23日に確認。"
      : "Facebook Marketplace (US, " + (shipped ? "shipped checkout" : "local pickup") + "): price " + f.fmt(price) + " + shipping " + f.fmt(ship) + " → selling fee " + f.fmt(r.fees) +
        ", net profit " + f.fmt(r.profit) + " (margin " + E.pct(r.revenue > 0 ? r.profit / r.revenue * 100 : 0) + "). Rates verified November 23, 2026.";
  }

  /* ================= Comparison ================= */
  var CMP_DEFS = [
    { key: "ebay", name: "eBay", href: "/ebay-fee-calculator/", jaHref: "/ja/ebay-fee-calculator/", feeLabel: "13.6% up to $7,500, then 2.35% · + per-order fee", feeLabelJa: "$7,500まで13.6%、超過分2.35% · ＋注文ごとの手数料" },
    { key: "etsy", name: "Etsy", href: "/etsy-fee-calculator/", jaHref: "/ja/etsy-fee-calculator/", feeLabel: "$0.20 + 6.5% + 3% + $0.25 · regulatory n/a (US)", feeLabelJa: "$0.20 + 6.5% + 3% + $0.25 · 規制手数料は米国なし" },
    { key: "poshmark", name: "Poshmark", href: "/poshmark-fee-calculator/", jaHref: "/ja/poshmark-fee-calculator/", feeLabel: "$2.95 under $15 · 20% at $15+ · on item price only", feeLabelJa: "$15未満は$2.95定額 · $15以上は20% · 商品価格のみに課金" },
    { key: "mercari", name: "Mercari", href: "/mercari-fee-calculator/", jaHref: "/ja/mercari-fee-calculator/", feeLabel: "10% of price + buyer-paid shipping · no processing fee", feeLabelJa: "価格＋買い手負担送料の10% · 決済手数料なし" },
    { key: "amazon", name: "Amazon", href: "/amazon-referral-fee-calculator/", jaHref: "/ja/amazon-referral-fee-calculator/", feeLabel: "Referral only · Everything Else 15% (category selector on its page)", feeLabelJa: "販売手数料のみ · Everything Else 15%（カテゴリは個別ページで選択）" },
    { key: "depop", name: "Depop", href: "/depop-fee-calculator/", jaHref: "/ja/depop-fee-calculator/", feeLabel: "No selling fee (US) · processing 3.3% + $0.45", feeLabelJa: "販売手数料なし（米国）· 決済 3.3% + $0.45" },
    { key: "vinted", name: "Vinted", href: "/vinted-fee-calculator/", jaHref: "/ja/vinted-fee-calculator/", feeLabel: "No seller fee · buyer pays the Vinted fee", feeLabelJa: "販売者手数料なし · 手数料は買い手負担" },
    { key: "whatnot", name: "Whatnot", href: "/whatnot-fee-calculator/", jaHref: "/ja/whatnot-fee-calculator/", feeLabel: "Commission 8% on item price + 2.9% + $0.30 processing (Standard)", feeLabelJa: "商品価格の8% ＋ 決済 2.9% + $0.30（Standard）" }
  ];
  function cmpHref(d) { return JA && d.jaHref ? d.jaHref : d.href; }
  function cmpFeeLabel(d) { return JA && d.feeLabelJa ? d.feeLabelJa : d.feeLabel; }
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
      if (JA) {
        if (best < 0) {
          head = "この商品は全プラットフォームで赤字 — 最も損失が小さいのは " + win.d.name;
          body = E.money(best) + " が8社で最良ですが、それでも赤字です。どこに出品する前に、価格を上げるかコストを下げてください。";
        } else if (diff > 0) {
          head = "この商品で最も多く残るのは " + win.d.name;
          body = "純利益 " + E.money(best) + "。最下位の " + lose.d.name + "（" + E.money(worst) + "）より1件あたり " + E.money(diff) + " 多く残ります。同じ商品・同じコストでも、プラットフォーム選びだけで " + E.money(diff) + " の差がつきます。";
        } else {
          head = "この商品は8プラットフォームとも同額";
          body = "純利益はどこも " + E.money(best) + "。この条件では各社の手数料体系がちょうど相殺し合っています。";
        }
      } else if (best < 0) {
        head = "Every platform loses money on this item — " + win.d.name + " loses least";
        body = E.money(best) + " is the best result of the eight, and it is still a loss. Raise the price or cut costs before listing anywhere.";
      } else if (diff > 0) {
        head = win.d.name + " pays you most on this item";
        body = "Net profit " + E.money(best) + " — " + E.money(diff) + " more per sale than " + lose.d.name + " (" + E.money(worst) + "), the lowest of the eight. Same item, same costs: the platform choice alone is worth " + E.money(diff) + ".";
      } else {
        head = "All eight platforms pay the same on this item";
        body = "Net profit " + E.money(best) + " everywhere — at these numbers the fee schedules happen to offset each other.";
      }
      verdictEl.innerHTML = "<strong>" + head + (JA ? "。" : ".") + "</strong> " + body +
        ' &nbsp;<a class="btn small" href="' + cmpHref(win.d) + '">' + (JA ? win.d.name + "の計算機を開く →" : "Open the " + win.d.name + " calculator →") + '</a>';
    }
    var tbody = $("cmp-rows");
    if (tbody) {
      tbody.innerHTML = rows.map(function (x) {
        var margin = x.r.revenue > 0 ? (x.r.profit / x.r.revenue * 100) : 0;
        return '<tr' + (x.r.profit === best ? ' class="best"' : '') + '><td><a href="' + cmpHref(x.d) + '"><strong>' + x.d.name + '</strong></a>' +
          (x.r.profit === best ? (JA ? ' · 純利益トップ' : ' · best net') : '') + '<br><span style="color:var(--muted);font-size:13px">' + cmpFeeLabel(x.d) + '</span></td>' +
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
      var MONO = { ebay: ["e", "#e8f0fe", "#1a56db"], etsy: ["E", "#fdeee3", "#c75100"], poshmark: ["P", "#fbe7ef", "#a4133c"], mercari: ["M", "#e3f2fd", "#0277bd"], amazon: ["a", "#fef3e2", "#b45309"], depop: ["D", "#fde8e8", "#c81e1e"], vinted: ["V", "#e0f2f1", "#00796b"], whatnot: ["W", "#efe9fd", "#6d28d9"] };
      tiles.innerHTML = rows.map(function (x) {
        var m = MONO[x.d.key] || ["?", "#eef1ee", "#33413a"];
        return '<a class="tile' + (x.r.profit === best ? ' best' : '') + '" href="' + cmpHref(x.d) + '"><div class="t-head"><span class="p-chip" style="background:' + m[1] + ';color:' + m[2] + '">' + m[0] + '</span><div class="t-name">' + x.d.name + '</div></div>' +
          '<div class="t-rate">' + cmpFeeLabel(x.d) + '</div><div class="t-profit">' + (JA ? "純利益（税引前）" : "Net profit") + ' <b>' + E.money(x.r.profit) + '</b></div></a>';
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
      $("rev-sub").textContent = JA ? "$10,000,000までのどの価格でもこの目標に届きません — 目標が、手数料構造で残せる上限以上です。" : "No price up to $10,000,000 reaches this target on eBay — the target is at or above what the fee structure leaves.";
      $("rev-check").textContent = JA ? "検証：テストした全価格で目標に到達できませんでした。" : "Verification: target not reachable at any tested price.";
      return;
    }
    var r = E.ebayCalc(price, ship, 0, cost, sc, 0, false, 0);
    $("rev-price").textContent = E.money(price);
    $("rev-sub").textContent = JA ? "この価格でeBay（米国）に出品すると目標に届きます。" : "List at this price on eBay (US) to hit your target.";
    if (revMode === "amt") {
      var diff = E.r2(r.profit - target);
      $("rev-check").textContent = JA
        ? "検証：この価格を通常のeBay計算機に通すと、純利益は " + E.money(r.profit) + " で、目標 " + E.money(target) + " に対し " + (diff === 0 ? "完全一致" : (diff > 0 ? "+" : "−") + "$" + Math.abs(diff).toFixed(2) + "（各手数料のセント単位の丸めによる差）") + "。"
        : "Verification: this price was run back through the normal eBay calculator — profit comes out at " + E.money(r.profit) +
          " against a " + E.money(target) + " target (" + (diff === 0 ? "exact match" : (diff > 0 ? "+" : "−") + "$" + Math.abs(diff).toFixed(2) + " from cent-rounding of individual fees") + ").";
    } else {
      var margin = r.revenue > 0 ? r.profit / r.revenue * 100 : 0;
      $("rev-check").textContent = JA
        ? "検証：この価格を通常のeBay計算機に通すと、利益率は " + E.pct(margin) + " で、目標は " + E.pct(target) + "（小さな差は各手数料のセント単位の丸めによるもの）。"
        : "Verification: this price was run back through the normal eBay calculator — margin comes out at " + E.pct(margin) +
          " against a " + E.pct(target) + " target (any small gap is cent-rounding of individual fees).";
    }
    summaries.rev = JA
      ? "eBay（米国）逆算: " + (revMode === "amt" ? E.money(target) + " の純利益" : E.pct(target) + " の利益率") + " を得るには（送料請求 " + E.money(ship) + "、仕入 " + E.money(cost) + "、送料実費 " + E.money(sc) + "）→ 出品価格 " + E.money(price) + "。料率は2026年11月18日に確認。"
      : "eBay (US) reverse pricing: to net " + (revMode === "amt" ? E.money(target) : E.pct(target) + " margin") +
        " with shipping charged " + E.money(ship) + ", item cost " + E.money(cost) + ", shipping cost " + E.money(sc) +
        " → list at " + E.money(price) + ". Rates verified November 18, 2026.";
  }

  /* ================= eBay vs Etsy page ================= */
  function calcVs() {
    if (!$("vs-eb-fees")) return;
    var price = num("vs-price"), ship = num("vs-ship"), cost = num("vs-cost"), sc = num("vs-shipcost");
    var eb = E.ebayCalc(price, ship, 0, cost, sc, 0, false, 0);
    var et = E.etsyCalc(price, ship, 0, cost, sc, 0, 0);
    var set = function (id, v) { var el = $(id); if (el) el.textContent = v; };
    set("vs-eb-rev", E.money(eb.revenue)); set("vs-et-rev", E.money(et.revenue));
    set("vs-eb-fees", E.money(eb.fees)); set("vs-et-fees", E.money(et.fees));
    set("vs-eb-costs", E.money(eb.costs)); set("vs-et-costs", E.money(et.costs));
    set("vs-eb-profit", E.money(eb.profit)); set("vs-et-profit", E.money(et.profit));
    var diff = E.r2(et.profit - eb.profit);
    set("vs-diff", diff === 0 ? "$0.00" : (diff > 0 ? E.money(diff) + (JA ? " Etsyの方が多い" : " more on Etsy") : E.money(-diff) + (JA ? " eBayの方が多い" : " more on eBay")));
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
  bind(["tt-price", "tt-ship", "tt-discount", "tt-tax", "tt-cost", "tt-shipcost"], "input", calcTiktok);
  bind(["tt-cat"], "change", calcTiktok);
  bind(["fb-price", "fb-ship", "fb-tax", "fb-cost", "fb-shipcost"], "input", calcFacebook);
  bind(["fb-type"], "change", calcFacebook);
  bind(["cmp-price", "cmp-ship", "cmp-cost", "cmp-shipcost"], "input", calcCompare);
  bind(["rev-target", "rev-ship", "rev-cost", "rev-shipcost"], "input", calcReverse);
  bind(["vs-price", "vs-ship", "vs-cost", "vs-shipcost"], "input", calcVs);
  on("rev-mode-amt", "click", function () { revMode = "amt"; $("rev-mode-amt").setAttribute("aria-pressed", "true"); $("rev-mode-margin").setAttribute("aria-pressed", "false"); $("rev-target-label").textContent = JA ? "1件あたりの目標利益" : "Target profit per sale"; $("rev-target-prefix").textContent = "$"; calcReverse(); persistState(); });
  on("rev-mode-margin", "click", function () { revMode = "margin"; $("rev-mode-amt").setAttribute("aria-pressed", "false"); $("rev-mode-margin").setAttribute("aria-pressed", "true"); $("rev-target-label").textContent = JA ? "目標利益率（売上比 %）" : "Target margin (% of revenue)"; $("rev-target-prefix").textContent = "%"; calcReverse(); persistState(); });

  document.querySelectorAll(".preset").forEach(function (b) {
    b.addEventListener("click", function () {
      var map = JSON.parse(b.getAttribute("data-v"));
      Object.keys(map).forEach(function (id) { var el = $(id); if (el) el.value = map[id]; });
      [calcEbay, calcEtsy, calcPoshmark, calcMercari, calcAmazon, calcDepop, calcVinted, calcWhatnot, calcTiktok, calcFacebook].forEach(function (fn) { fn(); });
      persistState();
    });
  });

  restoreState();
  persistFields().forEach(function (el) {
    el.addEventListener("input", persistState);
    el.addEventListener("change", persistState);
  });

  calcEbay(); calcEtsy(); calcPoshmark(); calcMercari(); calcAmazon(); calcDepop(); calcVinted(); calcWhatnot(); calcTiktok(); calcFacebook();
  calcCompare(); calcReverse(); calcVs();

  /* ---- Sticky comparison input bar (comparison pages only) ----
     When the "One item, every platform" input card scrolls out of view,
     a slim fixed bar under the sticky header mirrors the same four
     inputs. Bar inputs carry no id, so the persistence layer (which
     collects input[id]) ignores them; edits are forwarded to the main
     inputs as real input events, so recalculation, URL params and
     localStorage behave exactly as if the main card had been used. */
  (function initCmpSticky() {
    var bar = $("cmp-sticky");
    if (!bar) return;
    var card = document.querySelector(".cmp-inputs");
    var header = document.querySelector(".site-header");
    var barInputs = Array.prototype.slice.call(bar.querySelectorAll("input[data-cmp]"));
    function syncFromMain() {
      barInputs.forEach(function (bi) {
        var m = $(bi.getAttribute("data-cmp"));
        if (m && bi.value !== m.value) bi.value = m.value;
      });
    }
    barInputs.forEach(function (bi) {
      bi.addEventListener("input", function () {
        var m = $(bi.getAttribute("data-cmp"));
        if (m) { m.value = bi.value; m.dispatchEvent(new Event("input", { bubbles: true })); }
      });
    });
    ["cmp-price", "cmp-ship", "cmp-cost", "cmp-shipcost"].forEach(function (id) {
      on(id, "input", syncFromMain);
      on(id, "change", syncFromMain);
    });
    function place() { if (header) bar.style.top = header.offsetHeight + "px"; }
    function show(onState) { bar.classList.toggle("on", !!onState); if (onState) { place(); syncFromMain(); } }
    place();
    window.addEventListener("resize", place);
    if (card && "IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        var e = entries[0];
        show(!e.isIntersecting && e.boundingClientRect.top < 0);
      }, { threshold: 0 }).observe(card);
    } else if (card) {
      window.addEventListener("scroll", function () {
        show(card.getBoundingClientRect().bottom < 0);
      }, { passive: true });
    }
    syncFromMain();
  })();

  bindCopy();
})();
