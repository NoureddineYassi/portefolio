(function () {
  const navToggle = document.getElementById('navToggle');
  const menu = document.querySelector('.main-links');
  const overlay = document.getElementById('navOverlay');

  if (!navToggle || !menu || !overlay) return;

  function setMenu(open) {
    const isOpen = !!open;
    menu.classList.toggle('active', isOpen);
    overlay.classList.toggle('active', isOpen);
    document.body.classList.toggle('no-scroll', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.textContent = isOpen ? '✖' : '☰';
    overlay.setAttribute('aria-hidden', !isOpen);
  }

  navToggle.addEventListener('click', () => {
    setMenu(!menu.classList.contains('active'));
  });

  overlay.addEventListener('click', () => setMenu(false));

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });
})();

(function () {
  const container = document.getElementById('projectsContent');
  if (!container) return;

  const items = Array.from(container.querySelectorAll('.pro-item'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  let index = 0;

  function getItemsPerPage() {
    if (window.matchMedia('(max-width: 520px)').matches) return 1;
    if (window.matchMedia('(max-width: 1024px)').matches) return 2;
    return 3;
  }

  function updateButtons() {
    if (!prevBtn || !nextBtn) return;
    const ipp = getItemsPerPage();
    const maxIndex = Math.max(0, Math.ceil(items.length / ipp) - 1);
    prevBtn.disabled = index <= 0;
    nextBtn.disabled = index >= maxIndex;
  }

  function scrollToIndex() {
    const ipp = getItemsPerPage();
    const scrollAmount = index * container.clientWidth;

    container.scrollTo({
      left: scrollAmount,
      behavior: 'smooth',
    });

    const centerIndex = Math.min(
      items.length - 1,
      index * ipp + Math.floor(ipp / 2)
    );

    items.forEach((item, i) => {
      item.classList.toggle('active', i === centerIndex);
    });

    updateButtons();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      index = Math.max(0, index - 1);
      scrollToIndex();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const ipp = getItemsPerPage();
      const maxIndex = Math.max(0, Math.ceil(items.length / ipp) - 1);
      index = Math.min(maxIndex, index + 1);
      scrollToIndex();
    });
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const ipp = getItemsPerPage();
      const maxIndex = Math.max(0, Math.ceil(items.length / ipp) - 1);
      if (index > maxIndex) index = maxIndex;
      scrollToIndex();
    }, 150);
  });

  // Initial setup
  scrollToIndex();
})();

menu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    setMenu(false);

    // force reflow for mobile browsers
    requestAnimationFrame(() => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
});
