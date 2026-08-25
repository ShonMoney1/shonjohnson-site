// Navigation
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

// Reveal-on-scroll. If IntersectionObserver is unavailable, show everything.
const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

// Safety: never leave above-the-fold content invisible if JS timing is odd.
window.addEventListener('load', () => {
  document.querySelectorAll('.reveal').forEach((item) => {
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight * 1.15) item.classList.add('visible');
  });
});

// Coach Matt training video modal
(() => {
  const modal = document.getElementById('trainingVideoModal');
  const player = document.getElementById('trainingVideoPlayer');
  const thumbs = document.querySelectorAll('.training-thumb[data-video]');
  if (!modal || !player || !thumbs.length) return;

  let lastTrigger = null;

  const closeVideo = () => {
    player.pause();
    player.removeAttribute('src');
    player.load();
    modal.hidden = true;
    document.body.classList.remove('video-modal-open');
    if (lastTrigger) lastTrigger.focus();
  };

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      lastTrigger = thumb;
      player.src = thumb.dataset.video;
      modal.hidden = false;
      document.body.classList.add('video-modal-open');
      player.play().catch(() => {});
    });
  });

  modal.querySelectorAll('[data-close-video]').forEach((el) => el.addEventListener('click', closeVideo));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeVideo();
  });
})();
