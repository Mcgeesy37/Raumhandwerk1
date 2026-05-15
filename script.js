/* ════════════════════════════════════════════
   RAUMHANDWERK BERLIN — SCRIPT.JS
   ════════════════════════════════════════════ */

'use strict';

/* Progressive Enhancement: .js-ready sofort setzen */
document.documentElement.classList.add('js-ready');

/* Absoluter Fallback: nach 2s alles einblenden */
setTimeout(function () {
  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')
    .forEach(function (el) { el.classList.add('visible'); });
}, 2000);

/* ── COOKIE BANNER ──────────────────────────── */
(function initCookies() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;
  if (localStorage.getItem('rh_cookies')) banner.classList.add('hide');
})();

function acceptCookies() {
  localStorage.setItem('rh_cookies', 'accepted');
  hideCookieBanner();
}
function declineCookies() {
  localStorage.setItem('rh_cookies', 'declined');
  hideCookieBanner();
}
function hideCookieBanner() {
  const b = document.getElementById('cookieBanner');
  if (!b) return;
  b.style.transition = 'opacity .4s, transform .4s';
  b.style.opacity    = '0';
  b.style.transform  = 'translateY(20px)';
  setTimeout(() => b.classList.add('hide'), 420);
}

/* ── STICKY HEADER ──────────────────────────── */
(function initHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 60); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── MOBILE MENU ────────────────────────────── */
(function initMobileMenu() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();

/* ── SCROLL REVEAL ──────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!els.length) return;

  function checkVisible(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  /* Sofort sichtbare Elemente direkt einblenden */
  els.forEach(el => { if (checkVisible(el)) el.classList.add('visible'); });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -20px 0px' });

    els.forEach(el => { if (!el.classList.contains('visible')) io.observe(el); });
  } else {
    els.forEach(el => el.classList.add('visible'));
  }
})();

/* ── COUNTER ANIMATION ──────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start    = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { animateCounter(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => io.observe(c));
  } else {
    counters.forEach(c => animateCounter(c));
  }
})();

/* ── GALLERY FILTER ─────────────────────────── */
(function initGalleryFilter() {
  const btns  = document.querySelectorAll('.gf-btn');
  const items = document.querySelectorAll('.g-item');
  if (!btns.length || !items.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      items.forEach((item, i) => {
        const show = filter === 'all' || item.dataset.cat === filter;
        if (show) {
          item.classList.remove('hide');
          item.style.opacity   = '0';
          item.style.transform = 'scale(.95)';
          item.style.transition = `opacity .4s ease ${i * 0.05}s, transform .4s ease ${i * 0.05}s`;
          requestAnimationFrame(() => {
            item.style.opacity   = '1';
            item.style.transform = 'scale(1)';
          });
        } else {
          item.classList.add('hide');
        }
      });
    });
  });
})();

/* ── LIGHTBOX ───────────────────────────────── */
(function initLightbox() {
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose   = document.getElementById('lbClose');
  const lbPrev    = document.getElementById('lbPrev');
  const lbNext    = document.getElementById('lbNext');
  if (!lightbox) return;

  let currentIndex = 0;

  function getVisible() {
    return Array.from(document.querySelectorAll('.g-item:not(.hide)'));
  }

  function openLightbox(index) {
    const visible = getVisible();
    if (!visible.length) return;
    currentIndex = index;
    const item = visible[currentIndex];
    const img  = item.querySelector('img');
    const span = item.querySelector('.g-overlay span');
    lbImg.src             = img  ? img.src  : '';
    lbImg.alt             = img  ? img.alt  : '';
    lbCaption.textContent = span ? span.textContent : '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  function navigate(dir) {
    const visible = getVisible();
    if (!visible.length) return;
    currentIndex = (currentIndex + dir + visible.length) % visible.length;
    openLightbox(currentIndex);
  }

  document.getElementById('galleryGrid')?.addEventListener('click', e => {
    const item = e.target.closest('.g-item');
    if (!item) return;
    const visible = getVisible();
    const idx = visible.indexOf(item);
    if (idx !== -1) openLightbox(idx);
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click',  () => navigate(-1));
  lbNext.addEventListener('click',  () => navigate(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowRight') navigate(1);
    if (e.key === 'ArrowLeft')  navigate(-1);
  });
})();

/* ── CONTACT FORM ───────────────────────────── */
(function initContactForm() {
  const form   = document.getElementById('contactForm');
  const formOk = document.getElementById('formOk');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const btn      = form.querySelector('button[type="submit"]');
    const origHTML = btn.innerHTML;
    btn.disabled   = true;
    btn.innerHTML  = '<span>Wird gesendet …</span>';

    await new Promise(r => setTimeout(r, 1400));

    btn.disabled  = false;
    btn.innerHTML = origHTML;
    form.reset();

    if (formOk) {
      formOk.classList.add('show');
      formOk.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => formOk.classList.remove('show'), 8000);
    }
  });
})();

/* ── SMOOTH SCROLL ──────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = document.getElementById('siteHeader')?.offsetHeight || 80;
      const top     = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── HERO PARALLAX ───────────────────────────── */
(function initParallax() {
  const heroBg = document.querySelector('.hero-bg-img');
  if (!heroBg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      heroBg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.22}px)`;
    }
  }, { passive: true });
})();
