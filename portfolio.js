document.documentElement.classList.add('js');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav-links');
function closeMenu() {
  nav?.classList.remove('is-open');
  menu?.setAttribute('aria-expanded', 'false');
  menu?.setAttribute('aria-label', 'Open menu');
}
if (menu && nav) {
  menu.hidden = false;
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('is-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      closeMenu(); menu.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
}
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

// All projects remain visible without JavaScript. Search includes the whole
// collection; query parameters retain the chosen view when returning to it.
const projectBrowser = document.querySelector('.project-browser');
if (projectBrowser) {
  const cards = [...document.querySelectorAll('#project-results .project-card')];
  const search = document.querySelector('#project-search');
  const chips = [...projectBrowser.querySelectorAll('[data-filter]')];
  const count = projectBrowser.querySelector('.project-count');
  const empty = document.querySelector('.no-results');
  const clear = projectBrowser.querySelector('.clear-search');
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  let selected = 'featured';
  const update = (save = true) => {
    const words = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    let visible = 0;
    cards.forEach(card => {
      const categoryMatches = selected === 'all' ||
        (selected === 'featured' ? card.dataset.featured === 'true' : card.dataset.category === selected);
      const text = normalize(card.dataset.search);
      card.hidden = !categoryMatches || !words.every(word => text.includes(word));
      if (!card.hidden) visible++;
    });
    chips.forEach(chip => chip.setAttribute('aria-pressed', String(chip.dataset.filter === selected)));
    const label = chips.find(chip => chip.dataset.filter === selected).textContent.replace(/ \(\d+\)$/, '');
    count.textContent = `${visible} ${visible === 1 ? 'project' : 'projects'}${selected === 'all' ? '' : ' · ' + label}${search.value.trim() ? ' matching “' + search.value.trim() + '”' : ''}`;
    empty.hidden = visible !== 0;
    clear.hidden = !search.value;
    if (save) {
      const url = new URL(location.href);
      if (selected === 'featured') url.searchParams.delete('category');
      else url.searchParams.set('category', selected);
      if (search.value.trim()) url.searchParams.set('q', search.value.trim());
      else url.searchParams.delete('q');
      history.replaceState(history.state, '', url);
    }
  };
  const restore = () => {
    const params = new URLSearchParams(location.search);
    search.value = params.get('q') || '';
    const category = params.get('category') || (search.value ? 'all' : 'featured');
    selected = chips.some(chip => chip.dataset.filter === category) ? category : 'all';
    update(false);
  };
  chips.forEach(chip => chip.addEventListener('click', () => {
    selected = chip.dataset.filter;
    if (selected === 'featured') search.value = '';
    update();
  }));
  search.addEventListener('input', () => {
    if (search.value && selected === 'featured') selected = 'all';
    update();
  });
  clear.addEventListener('click', () => { search.value = ''; update(); search.focus(); });
  document.querySelector('[data-reset-projects]').addEventListener('click', () => {
    selected = 'all'; search.value = ''; update(); search.focus();
  });
  window.addEventListener('popstate', restore);
  restore();
  projectBrowser.hidden = false;
}

// Motion is opt-in, and the native horizontal strip still works without JS.
const ribbon = document.querySelector('#portfolio-ribbon');
const control = document.querySelector('.ribbon-control');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
if (ribbon && control) {
  let paused = true;
  let hovering = false;
  document.querySelector('.ribbon-tools').hidden = false;
  const update = () => {
    control.textContent = paused ? 'Play slideshow' : 'Pause slideshow';
    control.setAttribute('aria-pressed', String(!paused));
  };
  control.addEventListener('click', () => { paused = !paused; update(); });
  reduced.addEventListener('change', () => { if (reduced.matches) paused = true; update(); });
  const move = direction => {
    const end = ribbon.scrollWidth - ribbon.clientWidth;
    const step = ribbon.firstElementChild.getBoundingClientRect().width + 12;
    const destination = direction > 0 && ribbon.scrollLeft >= end - 8 ? 0 :
      direction < 0 && ribbon.scrollLeft <= 8 ? end : ribbon.scrollLeft + direction * step;
    ribbon.scrollTo({left: destination, behavior: reduced.matches ? 'auto' : 'smooth'});
  };
  document.querySelector('[data-ribbon-prev]').addEventListener('click', () => { paused = true; update(); move(-1); });
  document.querySelector('[data-ribbon-next]').addEventListener('click', () => { paused = true; update(); move(1); });
  ribbon.addEventListener('pointerenter', () => { hovering = true; });
  ribbon.addEventListener('pointerleave', () => { hovering = false; });
  ribbon.addEventListener('touchstart', () => { paused = true; update(); }, {passive:true});
  setInterval(() => {
    if (paused || hovering || document.hidden || ribbon.contains(document.activeElement)) return;
    const end = ribbon.scrollWidth - ribbon.clientWidth;
    if (end <= 0) return;
    move(1);
  }, 4500);
  update();
}

const gallery = [...document.querySelectorAll('.gallery-link')];
if (gallery.length && typeof HTMLDialogElement !== 'undefined') {
  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', 'Project photograph');
  dialog.innerHTML = '<div class="lightbox-controls"><button type="button" data-prev aria-label="Previous photograph">← Previous</button><button type="button" data-close autofocus>Close ✕</button><button type="button" data-next aria-label="Next photograph">Next →</button></div><img alt=""><div class="lightbox-caption"><p aria-live="polite" aria-atomic="true"></p><a target="_blank" rel="noopener">Open original ↗</a></div>';
  document.body.append(dialog);
  let index = 0;
  let opener;
  const show = n => {
    index = (n + gallery.length) % gallery.length;
    const link = gallery[index];
    const image = dialog.querySelector('img');
    image.src = link.href;
    image.alt = link.dataset.caption;
    dialog.querySelector('a').href = link.href;
    dialog.querySelector('p').textContent = `${index + 1} of ${gallery.length}: ${link.dataset.caption}`;
  };
  gallery.forEach((link, n) => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); opener = link; show(n); dialog.showModal();
    document.body.classList.add('gallery-open');
  }));
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-prev]').addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-next]').addEventListener('click', () => show(index + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(index - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); show(index + 1); }
  });
  dialog.querySelector('[data-prev]').hidden = gallery.length < 2;
  dialog.querySelector('[data-next]').hidden = gallery.length < 2;
  let touchStart;
  dialog.querySelector('img').addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch' && event.isPrimary) touchStart = {x:event.clientX, y:event.clientY};
  });
  dialog.querySelector('img').addEventListener('pointerup', event => {
    if (!touchStart || event.pointerType !== 'touch') return;
    const dx = event.clientX - touchStart.x, dy = event.clientY - touchStart.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 2) show(index + (dx < 0 ? 1 : -1));
    touchStart = null;
  });
  dialog.querySelector('img').addEventListener('pointercancel', () => { touchStart = null; });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('gallery-open');
    opener?.focus();
  });
}
