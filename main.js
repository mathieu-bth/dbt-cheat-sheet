// ── Theme ──
const themeBtn = document.getElementById('theme-toggle');
const icon     = themeBtn.querySelector('.toggle-icon');
const label    = themeBtn.querySelector('.toggle-label');
const root     = document.documentElement;

function applyTheme(theme) {
  root.dataset.theme    = theme;
  const isDark          = theme === 'dark';
  icon.textContent      = isDark ? '☀️' : '🌙';
  label.textContent     = isDark ? 'Light' : 'Dark';
  localStorage.setItem('theme', theme);
}

applyTheme(localStorage.getItem('theme') || 'light');

themeBtn.addEventListener('click', () => {
  applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
});

// ── Burger ──
const burger = document.getElementById('burger');
const links  = document.querySelector('.nav-links');

function closeMenu() {
  links.classList.remove('open');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}

burger.addEventListener('click', () => {
  const isOpen = links.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', String(isOpen));
});

links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

document.addEventListener('click', e => {
  if (!e.target.closest('nav')) closeMenu();
});

// ── Anchor copy buttons + Back to top (require full DOM) ──
const LINK_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
const CHECK_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

document.addEventListener('DOMContentLoaded', () => {
  // Active nav link
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (link) link.classList.add('active');
    });
  }, { rootMargin: '-56px 0px -70% 0px' });

  document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

  // Back to top
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Anchor copy buttons
  document.querySelectorAll('section[id]').forEach(section => {
    const title = section.querySelector('.section-title');
    if (!title) return;

    const btn = document.createElement('button');
    btn.className = 'anchor-btn';
    btn.title = 'Copy link';
    btn.setAttribute('aria-label', 'Copy section link');
    btn.innerHTML = LINK_SVG;
    title.appendChild(btn);

    btn.addEventListener('click', e => {
      e.preventDefault();
      const url = `${location.origin}${location.pathname}#${section.id}`;
      navigator.clipboard.writeText(url).then(() => {
        btn.innerHTML = CHECK_SVG;
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = LINK_SVG;
          btn.classList.remove('copied');
        }, 1800);
      });
    });
  });
});
