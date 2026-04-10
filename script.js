/* ============================================================
   ACCESS TO CLIMBING — SCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- NAV SCROLL ---------- */
  const nav = document.getElementById('main-nav');
  const handleScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ---------- MOBILE MENU ---------- */
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
  });

  // Close menu when a link is clicked
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
    });
  });

  /* ---------- HERO IMAGE ZOOM ---------- */
  const heroImg = document.querySelector('.hero__bg img');
  if (heroImg) {
    if (heroImg.complete) {
      heroImg.classList.add('loaded');
    } else {
      heroImg.addEventListener('load', () => heroImg.classList.add('loaded'));
    }
  }

  /* ---------- COUNTER ANIMATION ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1500;
    const start = performance.now();
    const run = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  };

  /* ---------- FAQ ACCORDION ---------- */
  document.querySelectorAll('.faq__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq__item');
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('active'));

      // Toggle current
      if (!isActive) item.classList.add('active');
    });
  });

  /* ---------- SCROLL REVEAL ---------- */
  const revealElements = () => {
    const targets = document.querySelectorAll(
      '.section__label, .section__title, .section__subtitle, ' +
      '.stat, .about__card, .serve__card, .team__card, .faq__item, ' +
      '.donate__text, .donate__graphic, .signup__notice, .signup__actions, ' +
      '.waiver__text, .contact-strip__item'
    );

    targets.forEach(el => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
      }
    });
  };

  revealElements();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // Animate counters
          if (entry.target.dataset.count) {
            animateCounter(entry.target);
          }
          // Also check for counters inside
          entry.target.querySelectorAll('[data-count]').forEach(c => animateCounter(c));

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  counters.forEach(el => observer.observe(el));

  /* ---------- SMOOTH SCROLL (fallback for older browsers) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
