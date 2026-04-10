/* ============================================================
   ACCESS TO CLIMBING — SCRIPT
   Features: particles, parallax, tilt cards, magnetic buttons,
   scroll progress, counter animation, FAQ accordion, scroll reveal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================
     FLOATING PARTICLES
     ========================================================== */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;
  let mouseX = -1000, mouseY = -1000;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.35 + 0.05;
      this.color = Math.random() > 0.7 ? '255, 170, 6' : '155, 164, 192';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Mouse repulsion
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.x += (dx / dist) * force * 1.5;
        this.y += (dy / dist) * force * 1.5;
      }

      if (this.x < -10 || this.x > canvas.width + 10 ||
          this.y < -10 || this.y > canvas.height + 10) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.min(Math.floor(window.innerWidth / 12), 120);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 170, 6, ${0.04 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawLines();
    animFrame = requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();

  // Track mouse for particle repulsion
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  /* ==========================================================
     SCROLL PROGRESS BAR
     ========================================================== */
  const scrollProgress = document.getElementById('scroll-progress');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = percent + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ==========================================================
     NAV SCROLL
     ========================================================== */
  const nav = document.getElementById('main-nav');
  const handleScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ==========================================================
     MOBILE MENU
     ========================================================== */
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
    });
  });

  /* ==========================================================
     HERO IMAGE SLOW ZOOM
     ========================================================== */
  const heroImg = document.querySelector('.hero__bg img');
  if (heroImg) {
    if (heroImg.complete) {
      heroImg.classList.add('loaded');
    } else {
      heroImg.addEventListener('load', () => heroImg.classList.add('loaded'));
    }
  }

  /* ==========================================================
     HERO PARALLAX
     ========================================================== */
  const heroContent = document.querySelector('.hero__content');
  const heroBg = document.querySelector('.hero__bg img');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      const parallaxOffset = scrollY * 0.35;
      if (heroContent) {
        heroContent.style.transform = `translateY(${parallaxOffset}px)`;
        heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.7));
      }
      if (heroBg) {
        heroBg.style.transform = `scale(${1 + scrollY * 0.0002})`;
      }
    }
  }, { passive: true });

  /* ==========================================================
     COUNTER ANIMATION
     ========================================================== */
  const counters = document.querySelectorAll('[data-count]');
  const animateCounter = (el) => {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const start = performance.now();
    const run = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  };

  /* ==========================================================
     FAQ ACCORDION
     ========================================================== */
  document.querySelectorAll('.faq__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq__item');
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  /* ==========================================================
     3D TILT CARDS
     ========================================================== */
  const tiltCards = document.querySelectorAll('.tilt-card');
  const isTouchDevice = 'ontouchstart' in window;

  if (!isTouchDevice) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  /* ==========================================================
     MAGNETIC BUTTONS
     ========================================================== */
  const magneticBtns = document.querySelectorAll('.magnetic-btn');

  if (!isTouchDevice) {
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ==========================================================
     SCROLL REVEAL (IntersectionObserver)
     ========================================================== */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // Animate counters inside
          if (entry.target.dataset.count) {
            animateCounter(entry.target);
          }
          entry.target.querySelectorAll('[data-count]').forEach(c => animateCounter(c));

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  counters.forEach(el => observer.observe(el));

  /* ==========================================================
     SMOOTH SCROLL
     ========================================================== */
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

  /* ==========================================================
     ACTIVE NAV LINK HIGHLIGHTING
     ========================================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');

  const highlightNav = () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + id) {
            link.style.color = 'var(--clr-accent)';
          }
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

});
