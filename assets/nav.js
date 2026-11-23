/* tallyfee tree navigation: tap-to-open dropdowns on touch devices (hover handles desktop). */
(function () {
  'use strict';
  var tops = document.querySelectorAll('.nav-item.has-drop > .nav-top');
  tops.forEach(function (a) {
    a.addEventListener('click', function (e) {
      var item = a.parentElement;
      if (window.matchMedia('(hover: none)').matches && !item.classList.contains('open')) {
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
