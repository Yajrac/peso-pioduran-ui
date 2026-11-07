(() => {
  const filter = document.getElementById('application-filter');
  const cards = [...document.querySelectorAll('.application-card')];
  filter.addEventListener('change', () => {
    let visible = 0;
    cards.forEach(card => {
      const status = card.querySelector('.status').textContent.trim();
      card.hidden = filter.value !== 'all' && status !== filter.value;
      if (!card.hidden) visible++;
    });
    document.getElementById('application-count').textContent = `${visible} application${visible === 1 ? '' : 's'}`;
  });
})();
