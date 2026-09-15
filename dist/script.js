document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu');
const mobileNav = document.getElementById('mobile-nav');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const demoModal = document.querySelector('.demo-modal');
const demoCloseButton = document.querySelector('.demo-close');

if (demoModal && typeof demoModal.showModal === 'function') {
  demoModal.showModal();
  demoCloseButton.addEventListener('click', () => demoModal.close());
}

function closeMenu() {
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  menuButton.querySelector('span').textContent = '☰';
}

menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  mobileNav.hidden = expanded;
  menuButton.setAttribute('aria-expanded', String(!expanded));
  menuButton.setAttribute('aria-label', expanded ? 'Abrir menu' : 'Fechar menu');
  menuButton.querySelector('span').textContent = expanded ? '☰' : '×';
});

mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !mobileNav.hidden) {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -24px' });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

document.querySelectorAll('.faq-list details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelectorAll('.faq-list details[open]').forEach((openDetail) => {
      if (openDetail !== detail) openDetail.open = false;
    });
  });
});

const siteHeader = document.querySelector('.site-header');
const progressBar = document.querySelector('.scroll-progress span');
const desktopLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"]')];
const trackedSections = desktopLinks.map((link) => ({
  link,
  section: document.querySelector(link.getAttribute('href')),
})).filter((item) => item.section);
let scrollFrame = 0;

function updateScrollUi() {
  scrollFrame = 0;
  const scrollTop = window.scrollY;
  const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollRange > 0 ? Math.min(scrollTop / scrollRange, 1) : 0;

  siteHeader.classList.toggle('scrolled', scrollTop > 10);
  progressBar.style.transform = `scaleX(${progress})`;

  let activeItem = null;
  trackedSections.forEach((item) => {
    if (item.section.getBoundingClientRect().top <= 170) activeItem = item;
  });

  trackedSections.forEach((item) => {
    const active = item === activeItem;
    item.link.classList.toggle('is-active', active);
    if (active) item.link.setAttribute('aria-current', 'page');
    else item.link.removeAttribute('aria-current');
  });
}

function requestScrollUiUpdate() {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(updateScrollUi);
}

window.addEventListener('scroll', requestScrollUiUpdate, { passive: true });
window.addEventListener('resize', requestScrollUiUpdate);
updateScrollUi();

const mapElement = document.getElementById('clinic-map');
if (mapElement && window.L) {
  const clinicPosition = [-16.4772504, -54.6247773];
  const clinicMap = L.map(mapElement, {
    scrollWheelZoom: false,
    zoomControl: true,
  }).setView(clinicPosition, 16);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
  }).addTo(clinicMap);

  const clinicIcon = L.divIcon({
    className: '',
    html: '<span class="clinic-map-marker" aria-hidden="true"></span>',
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -42],
  });

  L.marker(clinicPosition, { icon: clinicIcon, title: 'Essência Entre Mentes' })
    .addTo(clinicMap)
    .bindPopup('<strong>Essência Entre Mentes</strong><br>Avenida Duque de Caxias, 1625<br>Rondonópolis · MT');
}
