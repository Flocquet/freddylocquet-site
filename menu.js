(function () {
  var btn = document.querySelector('.menu-toggle');
  var menu = document.getElementById('menu');
  if (!btn || !menu) return;

  function set(open) {
    menu.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.textContent = open ? 'Fermer' : 'Menu';
  }

  btn.addEventListener('click', function () {
    set(!menu.classList.contains('is-open'));
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      set(false);
      btn.focus();
    }
  });

  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') set(false);
  });

  window.matchMedia('(min-width:1001px)').addEventListener('change', function (e) {
    if (e.matches) set(false);
  });
})();

(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var header = document.querySelector('header');
  var menuOpen = function(){ var m=document.getElementById('menu'); return m && m.classList.contains('is-open'); };
  if (header && !reduce) {
    var last = window.scrollY;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (window.innerWidth > 1000 && !menuOpen()) {
        if (y > last + 4 && y > 240) header.classList.add('is-hidden');
        else if (y < last - 4) header.classList.remove('is-hidden');
      }
      last = y;
    }, { passive: true });
  }
  if (reduce || !('IntersectionObserver' in window)) return;
  var items = document.querySelectorAll('.card,.offer,.timeline li,.devis,.presentation-grid');
  var vh = window.innerHeight, n = 0;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { var t=e.target; t.classList.add('is-in'); io.unobserve(t); setTimeout(function(){t.style.transitionDelay='';},900); }
    });
  }, { threshold: 0.08 });
  items.forEach(function (el) {
    if (el.getBoundingClientRect().top > vh) {
      el.classList.add('reveal');
      el.style.transitionDelay = ((n++ % 3) * 70) + 'ms';
      io.observe(el);
    }
  });
})();
