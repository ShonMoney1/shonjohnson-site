
// Navigation
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));
}

// Reveal-on-scroll
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -25px 0px' });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}
window.addEventListener('load', () => {
  document.querySelectorAll('.reveal').forEach(item => {
    if (item.getBoundingClientRect().top < window.innerHeight * 1.2) item.classList.add('visible');
  });
});

// Training video modal
(() => {
  const modal = document.getElementById('trainingVideoModal');
  const player = document.getElementById('trainingVideoPlayer');
  const thumbs = document.querySelectorAll('.training-thumb[data-video]');
  if (!modal || !player || !thumbs.length) return;
  let lastTrigger = null;
  const closeVideo = () => {
    player.pause(); player.removeAttribute('src'); player.load();
    modal.hidden = true; document.body.classList.remove('video-modal-open');
    if (lastTrigger) lastTrigger.focus();
  };
  thumbs.forEach(thumb => thumb.addEventListener('click', () => {
    lastTrigger = thumb; player.src = thumb.dataset.video;
    modal.hidden = false; document.body.classList.add('video-modal-open');
    player.play().catch(() => {});
  }));
  modal.querySelectorAll('[data-close-video]').forEach(el => el.addEventListener('click', closeVideo));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeVideo(); });
})();

// HUDL sync hook.
// The page always has a hard-coded fallback schedule, so a failed feed never breaks the site.
// When /api/hudl-schedule is available, it can return:
// { record:"2–0", lastGame:{opponent,score,meta}, nextGame:{opponent,meta,location}, games:[...] }
(async () => {
  const status = document.getElementById('hudlSyncStatus');
  try {
    const response = await fetch('/api/hudl-schedule', { cache: 'no-store' });
    if (!response.ok) throw new Error('Hudl feed not configured');
    const data = await response.json();

    if (data.record) document.querySelectorAll('[data-season-record]').forEach(el => el.textContent = data.record);
    if (data.lastGame) {
      const score = document.querySelector('[data-last-score]');
      const opp = document.querySelector('[data-last-opponent]');
      const meta = document.querySelector('[data-last-meta]');
      if (score && data.lastGame.score) score.textContent = String(data.lastGame.score).split(/[–-]/)[0].trim();
      if (opp && data.lastGame.opponent) opp.textContent = `VS ${data.lastGame.opponent}`;
      if (meta && data.lastGame.meta) meta.textContent = data.lastGame.meta;
    }
    if (data.nextGame) {
      const opp = document.querySelector('[data-next-opponent]');
      const meta = document.querySelector('[data-next-meta]');
      const loc = document.querySelector('[data-next-location]');
      if (opp && data.nextGame.opponent) opp.textContent = `VS ${data.nextGame.opponent}`;
      if (meta && data.nextGame.meta) meta.textContent = data.nextGame.meta;
      if (loc && data.nextGame.location) loc.textContent = data.nextGame.location;
    }

    if (status) {
      status.textContent = 'SYNCED WITH HUDL';
      status.classList.add('live');
    }
  } catch (err) {
    if (status) status.textContent = 'HUDL LINKED';
  }
})();
