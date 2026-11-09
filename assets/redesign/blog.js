(() => {
  'use strict';
  const search = document.querySelector('[data-blog-search]');
  if (search) {
    const input = search.querySelector('input');
    const clear = search.querySelector('[data-blog-clear]');
    const cards = [...document.querySelectorAll('[data-blog-card]')];
    const count = document.querySelector('[data-blog-count]');
    const empty = document.querySelector('[data-blog-empty]');
    const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('cs-CZ');
    const terms = cards.map(card => normalize(card.textContent));
    const filter = () => {
      const query = normalize(input.value.trim());
      let visible = 0;
      cards.forEach((card, index) => {
        const matches = !query || terms[index].includes(query);
        card.hidden = !matches;
        if (matches) visible++;
      });
      count.textContent = 'Počet článků: ' + visible;
      empty.hidden = visible !== 0;
      clear.hidden = !input.value;
    };
    input.addEventListener('input', filter);
    search.addEventListener('submit', event => { event.preventDefault(); filter(); });
    clear.addEventListener('click', () => { input.value = ''; filter(); input.focus(); });
    const query = new URLSearchParams(location.search).get('q');
    if (query) input.value = query;
    filter();
  }
  const toc = document.querySelector('[data-article-toc]');
  if (toc) {
    const wide = matchMedia('(min-width: 901px)');
    const setInitial = () => { toc.open = wide.matches; };
    setInitial();
    wide.addEventListener('change', setInitial);
    const links = [...toc.querySelectorAll('a[href^="#"]')];
    const headings = links.map(link => document.getElementById(decodeURIComponent(link.hash.slice(1)))).filter(Boolean);
    const activate = id => {
      links.forEach(link => {
        if (decodeURIComponent(link.hash.slice(1)) === id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };
    if (headings.length) activate(headings[0].id);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) activate(visible[0].target.id);
      }, { rootMargin: '-12% 0px -68% 0px', threshold: 0 });
      headings.forEach(heading => observer.observe(heading));
    }
    toc.addEventListener('click', event => {
      const link = event.target.closest('a[href^="#"]');
      if (link) {
        activate(decodeURIComponent(link.hash.slice(1)));
        if (!wide.matches) toc.open = false;
      }
    });
  }
})();
