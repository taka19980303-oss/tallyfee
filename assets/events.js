/* Fee Calculator Suite — first-party event scaffolding.
   Records outbound-link clicks and calculator completions into an
   in-memory queue (window.__tallyfeeEvents). Nothing is sent anywhere
   and no cookies are set. If CLOUDFLARE_WEB_ANALYTICS_TOKEN is filled
   in, the Cloudflare Web Analytics beacon is loaded for pageviews;
   the queue stays local (Cloudflare Web Analytics has no custom-event
   API) as the adapter point for a future endpoint.
   The operator pastes the beacon token from the Cloudflare dashboard
   (Web Analytics -> tallyfee.com -> JS beacon token) to enable it. */
(function () {
  "use strict";

  /* TODO(operator): paste the Cloudflare Web Analytics beacon token
     for tallyfee.com here. Empty = beacon disabled (current state). */
  var CLOUDFLARE_WEB_ANALYTICS_TOKEN = "";

  var queue = window.__tallyfeeEvents = window.__tallyfeeEvents || [];

  function track(name, data) {
    var evt = {
      name: name,
      data: data || {},
      path: location.pathname,
      ts: new Date().toISOString()
    };
    queue.push(evt);
    if (queue.length > 200) queue.shift();
    try {
      window.dispatchEvent(new CustomEvent("tallyfee:event", { detail: evt }));
    } catch (e) {}
    return evt;
  }
  window.tfTrack = track;
  window.TallyfeeEvents = {
    track: track,
    queue: queue,
    config: { cloudflareWebAnalyticsToken: CLOUDFLARE_WEB_ANALYTICS_TOKEN }
  };

  /* Cloudflare Web Analytics beacon (pageviews only, cookie-less).
     Loaded only when the operator has pasted a token above. */
  if (CLOUDFLARE_WEB_ANALYTICS_TOKEN) {
    var beacon = document.createElement("script");
    beacon.defer = true;
    beacon.src = "https://static.cloudflareinsights.com/beacon.min.js";
    beacon.setAttribute("data-cf-beacon", JSON.stringify({ token: CLOUDFLARE_WEB_ANALYTICS_TOKEN }));
    document.head.appendChild(beacon);
  }

  /* ---- Outbound-link clicks ---- */
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;
    var url;
    try { url = new URL(a.href, location.href); } catch (err) { return; }
    if ((url.protocol === "http:" || url.protocol === "https:") && url.hostname !== location.hostname) {
      track("outbound_click", {
        href: url.href,
        hostname: url.hostname,
        text: (a.textContent || "").trim().slice(0, 120),
        vendorCta: a.hasAttribute("data-vendor-cta") ? a.getAttribute("data-vendor-cta") : ""
      });
    }
  }, true);

  /* ---- Calculator completions ----
     A completion is a settled change in a known result container after
     the page has rendered. Results are de-duplicated by content, so
     typing does not flood the queue. */
  var RESULT_SELECTORS = "#results, #verdict, #cmp-verdict, [id$='-verdict'], .result-panel";
  var seen = {};
  var timer = null;
  function scanResults(source) {
    document.querySelectorAll(RESULT_SELECTORS).forEach(function (el) {
      var txt = (el.textContent || "").trim();
      if (txt.length < 3) return;
      var key = location.pathname + "|" + (el.id || el.className) + "|" + txt;
      if (seen[key]) return;
      seen[key] = 1;
      track("calculator_complete", {
        source: source,
        target: el.id || "",
        text: txt.slice(0, 160)
      });
    });
  }
  function scheduleScan(source) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () { scanResults(source); }, 800);
  }
  if (window.MutationObserver) {
    var observer = new MutationObserver(function () { scheduleScan("interaction"); });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  window.addEventListener("load", function () { scheduleScan("initial_render"); });

  /* ---- Vendor CTA rendering (software calculators) ----
     gen.py's calculator scripts dispatch "tallyfee:verdict" with the
     cheapest tool for the current inputs; the CTA is rendered here so
     the markup lives in exactly one place. The link is the vendor's
     plain official pricing URL. The (Ad) label and the page-top
     disclosure banner stay hidden until affiliate links go live:
     activation = set data-active="true" on [data-ad-label] and
     [data-affiliate-banner] (see README "Monetization mechanics"). */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function renderVendorCta(d) {
    var box = document.getElementById("vendor-cta");
    if (!box) return;
    if (!d || !d.source || !/^https:\/\//.test(d.source)) { box.innerHTML = ""; return; }
    var ja = document.documentElement.lang === "ja";
    var name = esc(d.name || "");
    var href = esc(d.source);
    var id = esc(d.id || "");
    box.innerHTML =
      '<div class="vendor-cta" data-cta-vendor="' + id + '">' +
      '<div class="vendor-cta-body"><strong>' + (ja ? "次の一手：" : "Next step:") + "</strong> " +
      (ja
        ? "この条件で最安は " + name + " でした。公式料金ページで最終価格と申込み条件を確認できます。"
        : "The cheapest fit for these numbers is " + name + ". Check the final price and signup terms on the official pricing page.") +
      '</div><div class="vendor-cta-action">' +
      '<a class="btn" href="' + href + '" target="_blank" rel="nofollow noopener" data-vendor-cta="' + id + '">' +
      (ja ? "公式サイトで料金を確認する ↗" : "Official pricing &amp; signup ↗") + "</a>" +
      '<span class="ad-label" data-ad-label data-active="false">' + (ja ? "（広告）" : "(Ad)") + "</span>" +
      "</div>" +
      '<p class="cta-note">' +
      (ja
        ? "紹介料の有無・金額によって、掲載する価格・順位・比較結果が変わることはありません"
        : "Commissions never change the prices we list, our rankings or our verdicts.") +
      "</p></div>";
  }
  document.addEventListener("tallyfee:verdict", function (e) { renderVendorCta(e.detail); });
  /* The calculators render (and dispatch) before this deferred script
     loads, so also render from the stored verdict once we are in. */
  (function initCta() {
    var tries = 0;
    var iv = setInterval(function () {
      tries++;
      var box = document.getElementById("vendor-cta");
      if (box && !box.innerHTML && window.__tfVerdict) renderVendorCta(window.__tfVerdict);
      if ((box && box.innerHTML) || tries >= 8) clearInterval(iv);
    }, 300);
  })();
})();
