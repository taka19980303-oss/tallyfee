/* Fee Calculator Suite — KDP engines + page wiring.
   Every rate and formula below was read on Amazon KDP's official Help
   pages on November 23, 2026:
   - Create a Paperback Cover (G201953020): spine factors, bleed, cover size
   - Paperback Submission Guidelines (G201857950): groundwood spine factor
   - Paperback Printing Cost (G201834340) / Hardcover Printing Cost (GHT976ZKSKUXBB6H)
   - Paperback Royalty (A1OYGQ0E1L4WBS): 60%/50% tiers by marketplace, 40% Expanded Distribution
   - eBook Royalties (A30F3VI2TH1FR8) + Digital Book Pricing Page (G200634500): delivery costs
   - eBook List Price Requirements (G200634560): 70% band, widened July 7, 2026
   All calculation runs in the visitor's browser. */
(function () {
  "use strict";

  var E = {};

  function r2(v) { return Math.round(v * 100) / 100; }
  function ceil2(v) { return Math.ceil((v - 1e-9) * 100) / 100; }

  /* ---------------- Cover (paperback) ---------------- */
  /* Per-page spine thickness in inches, by interior type (KDP Help). */
  E.SPINE = {
    bw_white: 0.002252,   /* black ink, white paper */
    bw_cream: 0.0025,     /* black ink, cream paper */
    bw_groundwood: 0.00235, /* black ink, groundwood paper (Submission Guidelines) */
    std_color: 0.002252,  /* standard color */
    prem_color: 0.002347  /* premium color */
  };
  E.BLEED = 0.125;

  E.coverCalc = function (trimW, trimH, pages, ink) {
    var factor = E.SPINE[ink] || E.SPINE.bw_white;
    var evenPages = pages % 2 === 0 ? pages : pages + 1; /* KDP rounds up to even */
    var spine = evenPages * factor;
    var width = E.BLEED + trimW + spine + trimW + E.BLEED;
    var height = trimH + 2 * E.BLEED;
    return {
      pages: pages, evenPages: evenPages, factor: factor, spine: spine,
      width: width, height: height,
      widthMm: width * 25.4, heightMm: height * 25.4, spineMm: spine * 25.4,
      pxW: Math.round(width * 300), pxH: Math.round(height * 300),
      spineText: evenPages > 79,
      spineTextWidth: Math.max(0, spine - 0.125) /* 0.0625" margin each side */
    };
  };

  /* Template geometry for the downloadable cover template, in inches,
     origin at the top-left of the full cover file (bleed included).
     Pure function — the canvas renderer below consumes it, and the
     Node tests verify it against coverCalc. */
  E.coverTemplateGeom = function (trimW, trimH, pages, ink) {
    var c = E.coverCalc(trimW, trimH, pages, ink);
    var b = E.BLEED;
    var back = { x: b, y: b, w: trimW, h: trimH };
    var spine = { x: b + trimW, y: b, w: c.spine, h: trimH };
    var front = { x: b + trimW + c.spine, y: b, w: trimW, h: trimH };
    var safe = function (p) { return { x: p.x + 0.25, y: p.y + 0.25, w: p.w - 0.5, h: p.h - 0.5 }; };
    var barcode = (trimW >= 2.5 && trimH >= 2)
      ? { x: back.x + back.w - 0.25 - 2.0, y: back.y + back.h - 0.25 - 1.2, w: 2.0, h: 1.2 }
      : null;
    return {
      calc: c, bleed: b, W: c.width, H: c.height, pxW: c.pxW, pxH: c.pxH,
      back: back, spine: spine, front: front,
      backSafe: safe(back), frontSafe: safe(front), barcode: barcode,
      spineTextRect: c.spineText ? { x: spine.x + 0.0625, y: b, w: Math.max(0, c.spine - 0.125), h: trimH } : null
    };
  };

  /* ---------------- Printing cost ---------------- */
  /* Print marketplaces. dec = royalty rounding decimals. */
  E.MARKETS = {
    US: { name: "Amazon.com", cur: "USD", sym: "$", dec: 2 },
    UK: { name: "Amazon.co.uk", cur: "GBP", sym: "£", dec: 2 },
    EU: { name: "Amazon.de / .fr / .es / .it / .nl / .ie / .be", cur: "EUR", sym: "€", dec: 2 },
    CA: { name: "Amazon.ca", cur: "CAD", sym: "C$", dec: 2 },
    AU: { name: "Amazon.com.au", cur: "AUD", sym: "A$", dec: 2 },
    PL: { name: "Amazon.pl", cur: "PLN", sym: "", dec: 2 },
    SE: { name: "Amazon.se", cur: "SEK", sym: "", dec: 2 },
    JP: { name: "Amazon.co.jp", cur: "JPY", sym: "¥", dec: 0 }
  };

  /* Table rows: [flatReg, flatLarge, fixed, perPageReg, perPageLarge].
     flatUpTo = last page count charged the flat cost only (null = no flat band). */
  function row(flatUpTo, flatReg, flatLarge, fixed, perReg, perLarge) {
    return { flatUpTo: flatUpTo, flatReg: flatReg, flatLarge: flatLarge, fixed: fixed, perReg: perReg, perLarge: perLarge };
  }
  E.PB_PRINT = {
    black: { /* black ink, white or cream paper */
      US: row(110, 2.30, 2.84, 1.00, 0.012, 0.017), CA: row(110, 2.99, 3.53, 1.26, 0.016, 0.021),
      UK: row(110, 1.93, 2.15, 0.85, 0.010, 0.012), EU: row(110, 2.05, 2.48, 0.75, 0.012, 0.016),
      PL: row(110, 9.58, 11.61, 3.51, 0.056, 0.075), SE: row(110, 22.84, 27.67, 8.37, 0.134, 0.179),
      AU: row(108, 4.74, 5.28, 2.42, 0.022, 0.027), JP: row(110, 422, 530, 206, 2, 3)
    },
    groundwood: {
      US: row(112, 2.23, 2.75, 1.00, 0.0114, 0.0162), CA: row(112, 2.90, 3.42, 1.26, 0.0152, 0.0200),
      UK: row(112, 1.88, 2.08, 0.85, 0.0095, 0.0114), EU: row(112, 1.98, 2.39, 0.75, 0.0114, 0.0152),
      PL: row(112, 9.26, 11.21, 3.51, 0.0532, 0.0713), SE: row(112, 22.12, 26.74, 8.37, 0.1273, 0.1701),
      AU: row(112, 4.62, 5.14, 2.42, 0.0209, 0.0257), JP: row(112, 411.20, 513.80, 206, 1.9, 2.85)
    },
    premium: {
      US: row(40, 3.60, 4.20, 1.00, 0.065, 0.080), CA: row(40, 4.66, 5.26, 1.26, 0.085, 0.100),
      UK: row(40, 2.59, 3.24, 0.85, 0.0435, 0.0598), EU: row(40, 2.85, 3.61, 0.75, 0.0525, 0.0715),
      PL: row(40, 12.86, 15.32, 3.51, 0.267, 0.337), SE: row(40, 30.65, 36.51, 8.37, 0.636, 0.804),
      AU: row(40, 5.82, 6.42, 2.42, 0.085, 0.100), JP: row(40, 475, 475, 206, 4, 5)
    },
    standard: { /* standard color: no flat band, 72-600 pages; not offered on Amazon.com.au */
      US: row(null, 0, 0, 1.00, 0.0255, 0.0402), CA: row(null, 0, 0, 1.26, 0.037, 0.052),
      UK: row(null, 0, 0, 0.85, 0.020, 0.027), EU: row(null, 0, 0, 0.75, 0.024, 0.035),
      PL: row(null, 0, 0, 3.51, 0.112, 0.164), SE: row(null, 0, 0, 8.37, 0.268, 0.3691),
      JP: row(null, 0, 0, 206, 3.50, 4.50)
    }
  };
  E.HC_PRINT = { /* hardcover tables verified for US / UK / EU stores */
    black: {
      US: row(108, 6.80, 7.49, 5.65, 0.012, 0.017),
      UK: row(108, 5.23, 5.45, 4.15, 0.010, 0.012),
      EU: row(108, 5.95, 6.35, 4.65, 0.012, 0.016)
    },
    premium: {
      US: row(null, 0, 0, 5.65, 0.065, 0.080),
      UK: row(null, 0, 0, 4.15, 0.045, 0.060),
      EU: row(null, 0, 0, 4.65, 0.057, 0.072)
    }
  };

  E.isLargeTrim = function (w, h) { return w > 6.12 || h > 9; };

  E.printCost = function (format, ink, market, large, pages) {
    var table = format === "hardcover" ? E.HC_PRINT[ink] : E.PB_PRINT[ink];
    var t = table && table[market];
    if (!t) return null;
    if (t.flatUpTo !== null && pages <= t.flatUpTo) {
      return { cost: r2(large ? t.flatLarge : t.flatReg), mode: "flat", fixed: large ? t.flatLarge : t.flatReg, perPage: 0, row: t };
    }
    var per = large ? t.perLarge : t.perReg;
    return { cost: r2(t.fixed + pages * per), mode: "formula", fixed: t.fixed, perPage: per, row: t };
  };

  /* ---------------- Print royalty ---------------- */
  /* List price at or above which the 60% rate applies (Paperback Royalty page). */
  E.THRESHOLD = { US: 9.99, UK: 7.99, EU: 9.99, CA: 13.99, AU: 13.99, PL: 40, SE: 110, JP: 1000 };

  E.minListPrice = function (printCost, market) {
    var th = E.THRESHOLD[market];
    var p50 = ceil2(printCost / 0.5), p60 = ceil2(printCost / 0.6);
    if (p50 < th) return { price: p50, rate: 0.5 };
    if (p60 >= th) return { price: p60, rate: 0.6 };
    return { price: th, rate: 0.6 };
  };

  E.printRoyalty = function (format, ink, market, large, pages, list, channel) {
    var pc = E.printCost(format, ink, market, large, pages);
    if (!pc) return null;
    var dec = E.MARKETS[market].dec;
    var rate = channel === "ed" ? 0.40 : (list >= E.THRESHOLD[market] ? 0.60 : 0.50);
    var raw = rate * list - pc.cost;
    var royalty = dec === 0 ? Math.round(raw) : r2(raw);
    var atThreshold = null;
    if (channel !== "ed" && list < E.THRESHOLD[market]) {
      var rawT = 0.60 * E.THRESHOLD[market] - pc.cost;
      atThreshold = { price: E.THRESHOLD[market], royalty: dec === 0 ? Math.round(rawT) : r2(rawT) };
    }
    return { print: pc, rate: rate, royalty: royalty, min: E.minListPrice(pc.cost, market), atThreshold: atThreshold };
  };

  /* ---------------- eBook royalty ---------------- */
  /* band = 70% list-price band; delivery = cost per MB (Digital Book Pricing Page). */
  E.EBOOK = {
    US: { name: "Amazon.com", sym: "$", dec: 2, delivery: 0.15, band: [2.99, 12.99], select: false },
    UK: { name: "Amazon.co.uk", sym: "£", dec: 2, delivery: 0.10, band: [1.77, 12.99], select: false },
    EU: { name: "Amazon.de / .fr / .es / .it / .nl", sym: "€", dec: 2, delivery: 0.12, band: [2.69, 12.99], select: false },
    CA: { name: "Amazon.ca", sym: "C$", dec: 2, delivery: 0.15, band: [2.99, 12.99], select: false },
    AU: { name: "Amazon.com.au", sym: "A$", dec: 2, delivery: 0.15, band: [3.99, 15.99], select: false },
    JP: { name: "Amazon.co.jp", sym: "¥", dec: 0, delivery: 1, band: [250, 1650], select: true },
    IN: { name: "Amazon.in", sym: "₹", dec: 2, delivery: 7, band: [99, 599], select: true },
    BR: { name: "Amazon.com.br", sym: "R$", dec: 2, delivery: 0.30, band: [5.99, 31.99], select: true },
    MX: { name: "Amazon.com.mx", sym: "MX$", dec: 2, delivery: 1, band: [34.99, 199.99], select: true }
  };

  E.ebookRoyalty = function (market, list, mb, vatPct) {
    var m = E.EBOOK[market];
    var net = vatPct > 0 ? list / (1 + vatPct / 100) : list;
    var delivery = 0;
    if (market === "JP" && mb >= 10) delivery = 0; /* KDP: no JP delivery cost at 10 MB+ */
    else delivery = Math.max(r2(mb * m.delivery), market === "JP" ? 1 : 0.01);
    var inBand = list >= m.band[0] && list <= m.band[1];
    var round = function (v) { return m.dec === 0 ? Math.round(v) : r2(v); };
    return {
      net: round(net), delivery: delivery, inBand: inBand, band: m.band, select: m.select,
      r35: round(0.35 * net),
      r70: round(Math.max(0, 0.70 * (net - delivery)))
    };
  };

  if (typeof module !== "undefined" && module.exports) { module.exports = E; }
  if (typeof window !== "undefined") { window.KdpEngines = E; }
  if (typeof document === "undefined") return;

  /* ================= Page wiring ================= */
  var $ = function (id) { return document.getElementById(id); };
  function num(id, dflt) { var el = $(id); if (!el) return dflt || 0; var v = parseFloat(el.value); return isNaN(v) ? (dflt || 0) : v; }
  function val(id) { var el = $(id); return el ? el.value : ""; }
  function on(id, ev, fn) { var el = $(id); if (el) el.addEventListener(ev, fn); }
  function money(sym, v, dec) {
    var s = Math.abs(v).toFixed(dec);
    return (v < 0 ? "-" : "") + (sym ? sym + s : s);
  }
  function fmtRate(sym, v) { /* per-page cost: up to 4 decimals, trimmed */
    var s = v.toFixed(4).replace(/0+$/, "").replace(/\.$/, ".0");
    return sym ? sym + s : s;
  }
  var summaries = {};
  function bindCopy(prefix) {
    document.querySelectorAll('.copy-btn[data-prefix="' + prefix + '"]').forEach(function (b) {
      b.addEventListener("click", function () {
        var msg = document.querySelector('.copy-msg[data-for="' + prefix + '"]');
        var done = function () { if (msg) { msg.textContent = "Copied."; setTimeout(function () { msg.textContent = ""; }, 2000); } };
        if (navigator.clipboard && summaries[prefix]) navigator.clipboard.writeText(summaries[prefix]).then(done, done);
      });
    });
  }
  function verdict(el, cls, label, reason) {
    if (!el) return;
    el.innerHTML = '<span class="verdict ' + cls + '">' + label + '</span><div class="verdict-reason">' + reason + '</div>';
  }

  /* ---------- Cover calculator ---------- */
  function calcCover() {
    if (!$("kc-trim")) return;
    var tw, th;
    if (val("kc-trim") === "custom") { tw = num("kc-tw", 6); th = num("kc-th", 9); }
    else { var p = val("kc-trim").split("x"); tw = parseFloat(p[0]); th = parseFloat(p[1]); }
    var pages = Math.max(1, Math.round(num("kc-pages", 200)));
    var r = E.coverCalc(tw, th, pages, val("kc-ink"));
    var f3 = function (v) { return v.toFixed(3) + " in"; };
    $("kc-size").textContent = r.width.toFixed(3) + " × " + r.height.toFixed(3) + " in";
    verdict($("kc-verdict"), r.spineText ? "pos" : "warn",
      r.spineText ? "Spine text OK" : "No spine text",
      r.spineText
        ? "At " + r.evenPages + " pages the spine is " + r.spine.toFixed(3) + " in wide — KDP prints spine text on books over 79 pages, with 0.0625 in clear on each side."
        : "KDP only prints spine text on books with more than 79 pages. This spine (" + r.spine.toFixed(3) + " in) stays blank.");
    var set = function (id, t) { var el = $(id); if (el) el.textContent = t; };
    set("kc-spine", f3(r.spine) + " (" + r.spineMm.toFixed(1) + " mm)");
    set("kc-full", f3(r.width) + " × " + f3(r.height));
    set("kc-fullmm", r.widthMm.toFixed(1) + " × " + r.heightMm.toFixed(1) + " mm");
    set("kc-px", r.pxW.toLocaleString("en-US") + " × " + r.pxH.toLocaleString("en-US") + " px at 300 DPI");
    set("kc-front", tw.toFixed(2) + " × " + th.toFixed(2) + " in (trim)");
    set("kc-textw", r.spineText ? r.spineTextWidth.toFixed(3) + " in usable for spine text" : "—");
    set("kc-pages-note", r.evenPages !== r.pages ? "Rounded up to " + r.evenPages + " pages — KDP prints on both sides of each sheet and pads odd counts to even." : "Page count used exactly as entered.");
    /* Diagram: proportional back / spine / front */
    var total = r.width, scale = 100 / total;
    var bw = (E.BLEED + tw) * scale, sw = Math.max(r.spine * scale, 1.2), fw = 100 - bw - sw;
    var d = $("kc-diagram");
    if (d) {
      d.innerHTML =
        '<div class="cd-row"><div class="cd-seg cd-back" style="width:' + bw + '%">Back<br>' + tw.toFixed(2) + ' in</div>' +
        '<div class="cd-seg cd-spine" style="width:' + sw + '%">Spine<br>' + r.spine.toFixed(3) + ' in</div>' +
        '<div class="cd-seg cd-front" style="width:' + fw + '%">Front<br>' + tw.toFixed(2) + ' in</div></div>' +
        '<div class="cd-cap">Full cover file: ' + r.width.toFixed(3) + ' × ' + r.height.toFixed(3) + ' in — includes 0.125 in bleed on the top, bottom and outside edges. Diagram is proportional, not to print scale.</div>';
    }
    summaries.kc = "KDP paperback cover — trim " + tw + "×" + th + " in, " + r.evenPages + " pages: spine " + r.spine.toFixed(3) + " in, full cover " + r.width.toFixed(3) + " × " + r.height.toFixed(3) + " in (" + r.pxW + "×" + r.pxH + " px at 300 DPI). Via tallyfee.com/kdp-cover-calculator/";
  }

  /* ---------- Shared print inputs (print-cost + royalty pages) ---------- */
  var formatOverride = null; /* royalty page: the mode toggle picks the format */
  function readPrintInputs(p) {
    var format = $(p + "-format") ? val(p + "-format") : (formatOverride || "paperback");
    var ink = val(p + "-ink");
    var market = val(p + "-market");
    var tw, th;
    if (val(p + "-trim") === "custom") { tw = num(p + "-tw", 6); th = num(p + "-th", 9); }
    else { var parts = val(p + "-trim").split("x"); tw = parseFloat(parts[0]); th = parseFloat(parts[1]); }
    return { format: format, ink: ink, market: market, large: E.isLargeTrim(tw, th), tw: tw, th: th, pages: Math.round(num(p + "-pages", 200)) };
  }
  function syncPrintOptions(p) {
    /* Keep ink + market selects consistent with the chosen format. */
    var format = $(p + "-format") ? val(p + "-format") : (formatOverride || "paperback");
    var inkSel = $(p + "-ink"), mktSel = $(p + "-market");
    if (inkSel) {
      var opts = format === "hardcover"
        ? [["black", "Black ink"], ["premium", "Premium color ink"]]
        : [["black", "Black ink — white or cream paper"], ["groundwood", "Black ink — groundwood paper"], ["standard", "Standard color ink"], ["premium", "Premium color ink"]];
      var cur = inkSel.value, html = "";
      opts.forEach(function (o) { html += '<option value="' + o[0] + '">' + o[1] + "</option>"; });
      inkSel.innerHTML = html;
      inkSel.value = opts.some(function (o) { return o[0] === cur; }) ? cur : "black";
    }
    if (mktSel) {
      var mkts = format === "hardcover" ? ["US", "UK", "EU"] : (inkSel && inkSel.value === "standard" ? ["US", "UK", "EU", "CA", "PL", "SE", "JP"] : ["US", "UK", "EU", "CA", "AU", "PL", "SE", "JP"]);
      var curM = mktSel.value, h2 = "";
      mkts.forEach(function (m) { h2 += '<option value="' + m + '">' + E.MARKETS[m].name + " (" + E.MARKETS[m].cur + ")</option>"; });
      mktSel.innerHTML = h2;
      mktSel.value = mkts.indexOf(curM) >= 0 ? curM : "US";
    }
    var trimSel = $(p + "-trim");
    if (trimSel) {
      var trims = format === "hardcover"
        ? [["5.5x8.5", "5.5 × 8.5 in"], ["6x9", "6 × 9 in"], ["6.14x9.21", "6.14 × 9.21 in"], ["7x10", "7 × 10 in"], ["8.25x11", "8.25 × 11 in"]]
        : [["5x8", "5 × 8 in"], ["5.25x8", "5.25 × 8 in"], ["5.5x8.5", "5.5 × 8.5 in"], ["6x9", "6 × 9 in"], ["6.14x9.21", "6.14 × 9.21 in"], ["6.69x9.61", "6.69 × 9.61 in"], ["7x10", "7 × 10 in"], ["7.5x9.25", "7.5 × 9.25 in"], ["8x10", "8 × 10 in"], ["8.5x8.5", "8.5 × 8.5 in"], ["8.5x11", "8.5 × 11 in"], ["8.27x11.69", "8.27 × 11.69 in (A4)"]];
      var curT = trimSel.value, h3 = "";
      trims.forEach(function (t) { h3 += '<option value="' + t[0] + '">' + t[1] + "</option>"; });
      h3 += '<option value="custom">Custom size…</option>';
      trimSel.innerHTML = h3;
      trimSel.value = trims.some(function (t) { return t[0] === curT; }) || curT === "custom" ? curT : (format === "hardcover" ? "6x9" : "6x9");
      var cw = $(p + "-custom"); if (cw) cw.style.display = trimSel.value === "custom" ? "" : "none";
    }
  }

  /* ---------- Print cost calculator ---------- */
  function calcPrint() {
    var p = "kp";
    if (!$(p + "-pages")) return;
    syncPrintOptions(p);
    var inp = readPrintInputs(p);
    var m = E.MARKETS[inp.market];
    var pc = E.printCost(inp.format, inp.ink, inp.market, inp.large, inp.pages);
    if (!pc) return;
    $("kp-cost").textContent = money(m.sym, pc.cost, 2) + (m.sym ? "" : " " + m.cur);
    var min = E.minListPrice(pc.cost, inp.market);
    verdict($("kp-verdict"), "pos", inp.large ? "Large trim size" : "Regular trim size",
      (inp.large ? "Wider than 6.12 in or taller than 9 in — KDP charges the large-trim rate. " : "Within 6.12 × 9 in — the regular-trim rate applies. ") +
      (pc.mode === "flat" ? "At " + inp.pages + " pages this book sits in the flat-rate band: printing is a single fixed cost, with no per-page charge." : "Printing cost = fixed cost + page count × per-page cost, per KDP's table."));
    var set = function (id, t) { var el = $(id); if (el) el.textContent = t; };
    set("kp-mode", pc.mode === "flat" ? "Flat rate (fixed cost only)" : money(m.sym, pc.fixed, 2) + " + " + inp.pages + " × " + fmtRate(m.sym, pc.perPage));
    set("kp-trimclass", inp.large ? "Large trim" : "Regular trim");
    set("kp-minlist", money(m.sym, min.price, m.dec) + " (at the " + Math.round(min.rate * 100) + "% royalty rate)");
    set("kp-market-name", m.name);
    summaries.kp = "KDP printing cost — " + inp.format + ", " + inp.pages + " pages, " + m.name + ": " + money(m.sym, pc.cost, 2) + " per copy. Minimum list price " + money(m.sym, min.price, m.dec) + ". Via tallyfee.com/kdp-print-cost-calculator/";
  }

  /* ---------- Royalty calculator ---------- */
  var royaltyMode = "paperback";
  function calcRoyalty() {
    var p = "kr";
    if (!$(p + "-list")) return;
    document.querySelectorAll("#kr-modes button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode") === royaltyMode ? "true" : "false");
    });
    $("kr-print-inputs").style.display = royaltyMode === "ebook" ? "none" : "";
    $("kr-ebook-inputs").style.display = royaltyMode === "ebook" ? "" : "none";
    var list = num(p + "-list", 9.99);
    if (royaltyMode === "ebook") {
      var market = val("kr-emarket"), mb = num("kr-mb", 1), vat = num("kr-vat", 0);
      var m = E.EBOOK[market];
      var r = E.ebookRoyalty(market, list, mb, vat);
      $("kr-amount").textContent = money(m.sym, r.inBand ? r.r70 : r.r35, m.dec);
      $("kr-hero-label").textContent = r.inBand ? "Royalty per sale — 70% option" : "Royalty per sale — 35% option (outside the 70% band)";
      verdict($("kr-verdict"), r.inBand ? "pos" : "warn",
        r.inBand ? "Inside the 70% band" : "Outside the 70% band",
        r.inBand
          ? "This price sits inside the 70% royalty band for " + m.name + " (" + money(m.sym, r.band[0], m.dec) + "–" + money(m.sym, r.band[1], m.dec) + ")." + (r.select ? " Note: in this store the 70% option also requires KDP Select enrollment." : "")
          : "At this price the 70% option does not apply on " + m.name + " (band: " + money(m.sym, r.band[0], m.dec) + "–" + money(m.sym, r.band[1], m.dec) + ") — sales earn the 35% rate instead.");
      var setE = function (id, t) { var el = $(id); if (el) el.textContent = t; };
      setE("kr-r70", money(m.sym, r.r70, m.dec));
      setE("kr-r35", money(m.sym, r.r35, m.dec));
      setE("kr-delivery", money(m.sym, r.delivery, m.dec) + " (" + mb + " MB file)");
      setE("kr-net", money(m.sym, r.net, m.dec));
      $("kr-print-rows").style.display = "none";
      $("kr-ebook-rows").style.display = "";
      summaries.kr = "KDP eBook royalty — " + m.name + ", list " + money(m.sym, list, m.dec) + ", " + mb + " MB: 70% option pays " + money(m.sym, r.r70, m.dec) + ", 35% pays " + money(m.sym, r.r35, m.dec) + " per sale. Via tallyfee.com/kdp-royalty-calculator/";
      return;
    }
    $("kr-print-rows").style.display = "";
    $("kr-ebook-rows").style.display = "none";
    syncPrintOptions(p);
    var inp = readPrintInputs(p);
    inp.format = royaltyMode; /* paperback | hardcover */
    var chSel = $(p + "-channel");
    if (chSel) { /* hardcover has no Expanded Distribution */
      chSel.disabled = royaltyMode === "hardcover";
      if (royaltyMode === "hardcover") chSel.value = "amazon";
      var chHint = $(p + "-channel-hint");
      if (chHint) chHint.style.display = royaltyMode === "hardcover" ? "" : "none";
    }
    var channel = val(p + "-channel");
    var m2 = E.MARKETS[inp.market];
    var rr = E.printRoyalty(inp.format, inp.ink, inp.market, inp.large, inp.pages, list, channel);
    if (!rr) return;
    $("kr-amount").textContent = money(m2.sym, rr.royalty, m2.dec) + (m2.sym ? "" : " " + m2.cur);
    $("kr-hero-label").textContent = "Royalty per sale";
    var vCls = rr.royalty < 0 ? "neg" : "pos", vLabel = rr.royalty < 0 ? "Below the minimum price" : Math.round(rr.rate * 100) + "% royalty rate";
    var vReason = rr.royalty < 0
      ? "At this list price the royalty does not cover the printing cost — KDP sets a minimum list price of " + money(m2.sym, rr.min.price, m2.dec) + " for this book."
      : (rr.atThreshold ? "The price cliff: raising the list price to " + money(m2.sym, rr.atThreshold.price, m2.dec) + " switches you to the 60% rate and pays " + money(m2.sym, rr.atThreshold.royalty, m2.dec) + " per sale." : "Rate applied: " + Math.round(rr.rate * 100) + "% of list price minus printing cost, per KDP's formula.");
    verdict($("kr-verdict"), vCls, vLabel, vReason);
    var set = function (id, t) { var el = $(id); if (el) el.textContent = t; };
    set("kr-printcost", money(m2.sym, rr.print.cost, 2));
    set("kr-rate", Math.round(rr.rate * 100) + "%" + (channel === "ed" ? " (Expanded Distribution)" : ""));
    set("kr-share", money(m2.sym, r2(rr.rate * list), m2.dec));
    set("kr-minlist", money(m2.sym, rr.min.price, m2.dec));
    summaries.kr = "KDP " + inp.format + " royalty — list " + money(m2.sym, list, m2.dec) + ", " + inp.pages + " pages, " + m2.name + ": printing " + money(m2.sym, rr.print.cost, 2) + ", royalty " + money(m2.sym, rr.royalty, m2.dec) + " per sale at the " + Math.round(rr.rate * 100) + "% rate. Via tallyfee.com/kdp-royalty-calculator/";
  }

  /* Draws the full-size 300 DPI cover template (bleed, trim, fold lines,
     safe areas, barcode box, labels) from coverTemplateGeom and downloads
     it as a PNG. Everything is drawn client-side; nothing is uploaded. */
  function downloadCoverTemplate() {
    var tw, th;
    if (val("kc-trim") === "custom") { tw = num("kc-tw", 6); th = num("kc-th", 9); }
    else { var p = val("kc-trim").split("x"); tw = parseFloat(p[0]); th = parseFloat(p[1]); }
    var pages = Math.max(1, Math.round(num("kc-pages", 200)));
    var ink = val("kc-ink");
    var g = E.coverTemplateGeom(tw, th, pages, ink);
    var S = 300; /* px per inch */
    var cv = document.createElement("canvas");
    cv.width = g.pxW; cv.height = g.pxH;
    var ctx = cv.getContext("2d");
    if (!ctx) return;
    var X = function (v) { return v * S; };
    function rect(r, fill, stroke, dash, lw) {
      ctx.beginPath();
      ctx.rect(X(r.x), X(r.y), X(r.w), X(r.h));
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 3; ctx.setLineDash(dash || []); ctx.stroke(); ctx.setLineDash([]); }
    }
    function label(text, cx, cy, sizeIn, color, bold) {
      ctx.fillStyle = color; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = (bold ? "700 " : "400 ") + Math.round(sizeIn * S) + "px Arial, Helvetica, sans-serif";
      ctx.fillText(text, X(cx), X(cy));
    }
    /* Base + bleed zone */
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, cv.width, cv.height);
    rect({ x: 0, y: 0, w: g.W, h: g.H }, "#fdecec");
    rect(g.back, "#eef4fb"); rect(g.spine, "#fdf3e0"); rect(g.front, "#edf7ee");
    /* Safe areas */
    rect(g.backSafe, null, "#7a8a7f", [14, 10], 2.5);
    rect(g.frontSafe, null, "#7a8a7f", [14, 10], 2.5);
    /* Trim + fold lines */
    rect(g.back, null, "#333333", [18, 12], 3.5);
    rect(g.front, null, "#333333", [18, 12], 3.5);
    ctx.strokeStyle = "#555555"; ctx.lineWidth = 4;
    [g.spine.x, g.spine.x + g.spine.w].forEach(function (fx) {
      ctx.beginPath(); ctx.moveTo(X(fx), 0); ctx.lineTo(X(fx), cv.height); ctx.stroke();
    });
    rect({ x: 0, y: 0, w: g.W, h: g.H }, null, "#c0392b", [], 5);
    /* Barcode box on the back cover */
    if (g.barcode) {
      rect(g.barcode, "#ffffff", "#c0392b", [], 4);
      label("BARCODE AREA", g.barcode.x + g.barcode.w / 2, g.barcode.y + 0.38, 0.21, "#c0392b", true);
      label("KDP prints your ISBN barcode here", g.barcode.x + g.barcode.w / 2, g.barcode.y + 0.68, 0.15, "#c0392b");
      label("Keep this area clear", g.barcode.x + g.barcode.w / 2, g.barcode.y + 0.92, 0.15, "#c0392b");
    }
    /* Panel labels */
    label("BACK COVER", g.back.x + g.back.w / 2, g.back.y + 0.85, 0.34, "#5b7ba5", true);
    label("FRONT COVER", g.front.x + g.front.w / 2, g.front.y + 0.85, 0.34, "#4e7a55", true);
    label("Trim " + tw + " x " + th + " in", g.back.x + g.back.w / 2, g.back.y + 1.3, 0.19, "#5b7ba5");
    label("Trim " + tw + " x " + th + " in", g.front.x + g.front.w / 2, g.front.y + 1.3, 0.19, "#4e7a55");
    label("Dashed line = safe area — keep text inside", g.front.x + g.front.w / 2, g.front.y + g.front.h - 0.55, 0.16, "#7a8a7f");
    /* Spine labels (only when the spine is wide enough to hold them) */
    if (g.spine.w >= 0.22) {
      ctx.save();
      ctx.translate(X(g.spine.x + g.spine.w / 2), X(g.spine.y + g.spine.h / 2));
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = "#9a7b2d"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = "700 " + Math.round(0.2 * S) + "px Arial, Helvetica, sans-serif";
      ctx.fillText("SPINE — " + g.calc.spine.toFixed(3) + " in wide", 0, 0);
      ctx.restore();
      if (g.spineTextRect) rect({ x: g.spineTextRect.x, y: g.spineTextRect.y + 0.3, w: g.spineTextRect.w, h: g.spineTextRect.h - 0.6 }, null, "#9a7b2d", [10, 8], 2);
    }
    if (!g.calc.spineText) {
      label("No spine text at " + g.calc.evenPages + " pages (needs 80+)", g.back.x + g.back.w / 2, g.back.y + 1.75, 0.16, "#c0392b");
    }
    /* Header + credit inside the bleed (trimmed away in print) */
    label("FULL COVER " + g.W.toFixed(3) + " x " + g.H.toFixed(3) + " in — " + g.pxW.toLocaleString("en-US") + " x " + g.pxH.toLocaleString("en-US") + " px at 300 DPI — red edge = bleed boundary (0.125 in)", g.W / 2, 0.0625, 0.115, "#c0392b", true);
    ctx.textAlign = "left";
    ctx.fillStyle = "#999999";
    ctx.font = Math.round(0.11 * S) + "px Arial, Helvetica, sans-serif";
    ctx.fillText("Template by tallyfee.com — KDP paperback, " + tw + " x " + th + " in trim, " + g.calc.evenPages + " pages. Design over this layer, then hide it before upload.", X(0.03), X(g.H - 0.045));
    var name = "kdp-cover-template-" + tw + "x" + th + "in-" + g.calc.evenPages + "pp.png";
    function save(href) {
      var a = document.createElement("a");
      a.href = href; a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
    }
    if (cv.toBlob) {
      cv.toBlob(function (blob) {
        if (!blob) { save(cv.toDataURL("image/png")); return; }
        var url = URL.createObjectURL(blob);
        save(url);
        setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      }, "image/png");
    } else {
      save(cv.toDataURL("image/png"));
    }
  }

  function init() {
    if ($("kc-trim")) {
      ["kc-trim", "kc-ink"].forEach(function (id) { on(id, "change", function () { var cw = $("kc-custom"); if (cw) cw.style.display = val("kc-trim") === "custom" ? "" : "none"; calcCover(); }); });
      ["kc-pages", "kc-tw", "kc-th"].forEach(function (id) { on(id, "input", calcCover); });
      on("kc-template", "click", downloadCoverTemplate);
      bindCopy("kc"); calcCover();
    }
    if ($("kp-pages")) {
      ["kp-format", "kp-ink", "kp-market", "kp-trim"].forEach(function (id) { on(id, "change", calcPrint); });
      ["kp-pages", "kp-tw", "kp-th"].forEach(function (id) { on(id, "input", calcPrint); });
      bindCopy("kp"); calcPrint();
    }
    if ($("kr-list")) {
      document.querySelectorAll("#kr-modes button").forEach(function (b) {
        b.addEventListener("click", function () {
          royaltyMode = b.getAttribute("data-mode");
          if (royaltyMode !== "ebook") formatOverride = royaltyMode;
          calcRoyalty();
        });
      });
      ["kr-format", "kr-ink", "kr-market", "kr-trim", "kr-channel", "kr-emarket"].forEach(function (id) { on(id, "change", calcRoyalty); });
      ["kr-pages", "kr-tw", "kr-th", "kr-list", "kr-mb", "kr-vat"].forEach(function (id) { on(id, "input", calcRoyalty); });
      bindCopy("kr"); calcRoyalty();
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
