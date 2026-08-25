


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

  modal.querySelectorAll('[data-close-video]').forEach((el) => {
    el.addEventListener('click', closeVideo);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeVideo();
  });
})();
