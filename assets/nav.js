/* tallyfee tree navigation: tap-to-open dropdowns on touch devices (hover handles desktop). */
(function () {
  'use strict';
  var tops = document.querySelectorAll('.nav-item.has-drop > .nav-top');
  tops.forEach(function (a) {
    a.addEventListener('click', function (e) {
      var item = a.parentElement;
      /* At <=760px the nav is a hamburger panel whose drops are always
         expanded, so section tops must navigate normally — skip there. */
      if (window.matchMedia('(hover: none)').matches && !window.matchMedia('(max-width: 760px)').matches && !item.classList.contains('open')) {
        e.preventDefault();
        document.querySelectorAll('.nav-item.open').forEach(function (x) { x.classList.remove('open'); });
        item.classList.add('open');
      }
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item')) {
      document.querySelectorAll('.nav-item.open').forEach(function (x) { x.classList.remove('open'); });
    }
  });
})();

/* Mobile hamburger: toggles the <=760px nav panel (see style.css; the
   panel only exists when html.js is set, so no-JS keeps the inline nav). */
(function () {
  'use strict';
  var burger = document.querySelector('.nav-burger');
  var header = document.querySelector('.site-header');
  var nav = document.getElementById('site-nav');
  if (!burger || !header || !nav) return;
  function close() {
    header.classList.remove('nav-open');
    burger.setAttribute('aria-expanded', 'false');
  }
  burger.addEventListener('click', function () {
    var open = header.classList.toggle('nav-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('nav-open')) {
      close();
      burger.focus();
    }
  });
})();
