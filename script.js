/* =====================================================================
   ADÁN SÁNCHEZ BAND — script.js
   Handles: nav scroll state, mobile menu, scroll reveal, contact form
   ===================================================================== */

(function () {
  'use strict';

  // ── NAV: add scrolled class ──────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── MOBILE MENU ──────────────────────────────────────────────────────
  const toggle  = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  // Close mobile menu when a nav link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
    });
  });

  // ── SMOOTH SCROLL REVEAL ─────────────────────────────────────────────
  // Mark elements for reveal animation
  const revealTargets = [
    '.about-layout',
    '.player-block',
    '.tracklist',
    '.track-item',
    '.event-card',
    '.gallery-item',
    '.contact-layout',
    '.section-header',
    '.members-grid',
    '.member-card',
  ];

  function addRevealClasses() {
    revealTargets.forEach(selector => {
      document.querySelectorAll(selector).forEach((el, i) => {
        if (!el.closest('.hero')) {
          el.classList.add('reveal');
          // Stagger children if it's a list
          if (['track-item', 'event-card', 'gallery-item', 'member-card'].some(c => el.classList.contains(c))) {
            el.classList.add(`reveal-delay-${(i % 3) + 1}`);
          }
        }
      });
    });
  }

  function checkReveal() {
    document.querySelectorAll('.reveal').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.88) {
        el.classList.add('visible');
      }
    });
  }

  addRevealClasses();
  window.addEventListener('scroll', checkReveal, { passive: true });
  checkReveal(); // Run once on page load

  // ── ACTIVE NAV LINK ──────────────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  function setActiveNavLink() {
    let current = '';
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= 120) current = section.id;
    });
    navAnchors.forEach(a => {
      const href = a.getAttribute('href').replace('#', '');
      a.style.color = href === current ? 'var(--clr-gold)' : '';
    });
  }
  window.addEventListener('scroll', setActiveNavLink, { passive: true });

  // ── CONTACT FORM ─────────────────────────────────────────────────────
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;

      // Basic client-side validation
      const name    = form.querySelector('#name').value.trim();
      const email   = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();

      if (!name || !email || !message) {
        shakeField(form.querySelector('#name'), !name);
        shakeField(form.querySelector('#email'), !email);
        shakeField(form.querySelector('#message'), !message);
        return;
      }
      if (!isValidEmail(email)) {
        shakeField(form.querySelector('#email'), true);
        return;
      }

      // Simulate sending (swap for real fetch to a backend / FormSubmit / Netlify Forms)
      btn.textContent = 'Sending…';
      btn.disabled = true;

      await sleep(1500);

      form.reset();
      btn.textContent = original;
      btn.disabled = false;
      success.style.display = 'block';

      // Hide success after 6 seconds
      setTimeout(() => { success.style.display = 'none'; }, 6000);

      /* ──────────────────────────────────────────────────────────────
         TO CONNECT A REAL BACKEND, replace the simulation above with:

         const data = new FormData(form);
         const response = await fetch('https://formsubmit.co/adancarito@gmail.com', {
           method: 'POST',
           body: data
         });
         if (response.ok) { ... show success ... }
      ────────────────────────────────────────────────────────────── */
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function shakeField(el, shouldShake) {
    if (!el || !shouldShake) return;
    el.style.borderColor = 'var(--clr-crimson-br)';
    el.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-6px)' },
      { transform: 'translateX(6px)' },
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(4px)' },
      { transform: 'translateX(0)' },
    ], { duration: 400, easing: 'ease' });
    el.addEventListener('input', () => {
      el.style.borderColor = '';
    }, { once: true });
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  // ── SPOTIFY EMBED FALLBACK ────────────────────────────────────────────
  // If the Spotify iframe fails to load, show the fallback message
  const spotifyIframe = document.querySelector('.spotify-embed-wrap iframe');
  const fallback      = document.querySelector('.embed-fallback');
  if (spotifyIframe && fallback) {
    spotifyIframe.addEventListener('error', () => {
      spotifyIframe.style.display = 'none';
      fallback.style.display = 'block';
    });
  }

  // ── CONSOLE CREDIT ───────────────────────────────────────────────────
  console.log(
    '%c 🎸 Adán Sánchez Band — Website v1.0 ',
    'background:#8b1a1a;color:#d48c3c;font-family:serif;font-size:14px;padding:6px 12px;border-radius:4px'
  );

})();
