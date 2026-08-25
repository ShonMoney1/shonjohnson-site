
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menu?.addEventListener('click', () => nav.classList.toggle('open'));

document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

const obs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const hero = document.querySelector('.hero-bg');
  if (hero && window.innerWidth > 900) hero.style.transform = `translateY(${y * 0.12}px) scale(1.03)`;
});
