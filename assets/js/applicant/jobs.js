(() => {
  const form = document.getElementById('job-search-form');
  const input = document.getElementById('job-query');
  const cards = [...document.querySelectorAll('.vacancy-card')];
  const filter = () => {
    const query = input.value.trim().toLocaleLowerCase();
    let count = 0;
    cards.forEach(card => {
      card.hidden = !card.textContent.toLocaleLowerCase().includes(query);
      if (!card.hidden) count++;
    });
    document.getElementById('jobs-count').textContent = `${count} sample vacanc${count === 1 ? 'y' : 'ies'}`;
    document.getElementById('jobs-empty').hidden = count > 0;
  };
  form.addEventListener('submit', event => { event.preventDefault(); filter(); });
  input.addEventListener('input', filter);
  document.getElementById('clear-job-search').addEventListener('click', () => {
    input.value = '';
    filter();
    input.focus();
  });
})();
