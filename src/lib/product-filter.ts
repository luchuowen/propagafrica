// Shop-by-crop filter pills (blueprint.md Sections 1 and 2) — client-side tag
// filter, no reload. Shared by the homepage teaser grid and the /products/
// hub so the two grids behave identically.
export function initProductFilter(): void {
  const grid = document.querySelector<HTMLElement>('[data-product-grid]');
  const empty = document.querySelector<HTMLElement>('[data-filter-empty]');
  const pills = Array.from(document.querySelectorAll<HTMLButtonElement>('.filter-pills .pill'));
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-product-card]'));

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const tag = pill.dataset.tag ?? 'All';
      pills.forEach((p) => p.classList.toggle('is-active', p === pill));

      let visibleCount = 0;
      cards.forEach((card) => {
        const tags = (card.dataset.tags ?? '').split('|');
        const matches = tag === 'All' || tags.includes(tag);
        card.hidden = !matches;
        if (matches) visibleCount += 1;
      });

      if (grid) grid.hidden = visibleCount === 0;
      if (empty) empty.hidden = visibleCount !== 0;
    });
  });
}
