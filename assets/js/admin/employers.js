(() => {
  const reviewButtons = [...document.querySelectorAll('.review-view')];
  const reviewDialog = document.createElement('dialog');
  reviewDialog.className = 'registration-review-dialog';
  reviewDialog.setAttribute('aria-labelledby', 'registration-review-title');
  reviewDialog.innerHTML = '<div class="profile-modal-heading"><div><span>REGISTRATION REVIEW</span><h2 id="registration-review-title"></h2></div><button type="button" aria-label="Close registration review">&times;</button></div><div class="registration-review-content"></div>';
  document.body.append(reviewDialog);
  let activeReview = null;
  const showReview = button => {
    if (reviewDialog.open) return;
    const row = document.getElementById(button.getAttribute('aria-controls'));
    const cell = row.querySelector('td');
    activeReview = { button, cell };
    document.getElementById('registration-review-title').textContent = button.closest('tr').querySelector('th').textContent;
    const content = reviewDialog.querySelector('.registration-review-content');
    while (cell.firstChild) content.append(cell.firstChild);
    button.setAttribute('aria-expanded', 'true');
    reviewDialog.showModal();
  };
  reviewDialog.querySelector('button').addEventListener('click', () => reviewDialog.close());
  reviewDialog.addEventListener('close', () => {
    if (!activeReview) return;
    const content = reviewDialog.querySelector('.registration-review-content');
    while (content.firstChild) activeReview.cell.append(content.firstChild);
    activeReview.button.setAttribute('aria-expanded', 'false');
    activeReview.button.focus();
    activeReview = null;
  });
  const openReviewFromHash = () => {
    reviewButtons.forEach(button => {
      if (location.hash === `#${button.closest('tr').id}`) {
        showReview(button);
      }
    });
  };
  reviewButtons.forEach(button => button.addEventListener('click', () => {
    showReview(button);
  }));
  reviewButtons.forEach(button => {
    button.setAttribute('aria-haspopup', 'dialog');
  });
  openReviewFromHash();
  window.addEventListener('hashchange', openReviewFromHash);
  const records = [
    ['NONG MEAT SHOP', 'BPT-00001324232364983', '2026-08-22', 'Retail / Meat shop'],
    ['AquaVience', 'BPT-0000132623784637', '2026-09-14', 'Water refilling'],
    ['Nong MeatShop', 'BPT-000013242323', '2026-09-14', 'Retail / Meat shop'],
    ['Haring Manok', 'BPT-00001324753', '2026-09-14', 'Food services'],
    ["Ato’s Kitchen", 'BPT-0083596758', '2026-09-14', 'Food services'],
    ['Loloda Minimart', 'BPT-08347864785', '2026-09-14', 'Retail'],
    ['Superkalan GAZ', 'BPT-098376589', '2026-09-14', 'LPG retail']
  ];
  const dialog = document.getElementById('employer-profile-dialog');
  const mobileActions = window.matchMedia('(max-width: 650px)');
  mobileActions.addEventListener('change', () => document.querySelectorAll('.registry-action-menu').forEach(menu => { menu.open = !mobileActions.matches; }));
  const icons = {
    View: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    Suspend: '<circle cx="12" cy="12" r="9"/><path d="M9 8v8m6-8v8"/>',
    Delete: '<path d="M3 6h18M9 6V4h6v2M5 6l1 15h12l1-15M10 10v7m4-7v7"/>'
  };
  const actionContent = label => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[label]}</svg><span class="action-label">${label}</span>`;
  const date = value => new Date(value + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const cell = (row, text) => { const td = document.createElement('td'); td.textContent = text; row.append(td); return td; };
  records.forEach((record, index) => {
    const [name, permit, registered, industry] = record;
    const contact = `09XX XXX ${String(index + 1).padStart(4, '0')}`;
    const row = document.createElement('tr');
    const company = cell(row, '');
    const title = document.createElement('strong'); title.textContent = name;
    const sub = document.createElement('small'); sub.textContent = `Registered: ${date(registered)}`;
    company.append(title, sub);
    const code = document.createElement('code'); code.textContent = permit;
    cell(row, '').append(code);
    cell(row, contact);
    const actions = cell(row, ''); actions.className = 'registry-actions';
    const menu = document.createElement('details'); menu.className = 'registry-action-menu';
    const trigger = document.createElement('summary');
    trigger.setAttribute('aria-label', `Actions for ${name}`);
    trigger.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>';
    const actionGroup = document.createElement('div'); actionGroup.className = 'registry-action-group';
    menu.append(trigger, actionGroup); actions.append(menu);
    menu.open = !mobileActions.matches;
    menu.addEventListener('toggle', () => {
      if (mobileActions.matches && menu.open) document.querySelectorAll('.registry-action-menu[open]').forEach(other => { if (other !== menu) other.open = false; });
    });
    const view = document.createElement('button'); view.type = 'button'; view.className = 'registry-view'; view.textContent = 'View'; view.setAttribute('aria-label', `View ${name} profile`);
    view.innerHTML = actionContent('View'); view.title = 'View profile';
    view.addEventListener('click', () => {
      if (mobileActions.matches) menu.open = false;
      document.getElementById('employer-profile-title').textContent = name;
      const fields = document.getElementById('employer-profile-fields'); fields.replaceChildren();
      const info = [['Company name', name], ['Business permit number', permit], ['Industry', industry], ['Business location', 'Pio Duran, Albay'], ['Contact number (sample)', contact], ['Contact person', 'Not provided in sample'], ['Email address', 'Not provided in sample'], ['Registered', date(registered)], ['Account status', 'Active / Approved']];
      info.forEach(([label, value]) => { const group = document.createElement('div'); const dt = document.createElement('dt'); const dd = document.createElement('dd'); dt.textContent = label; dd.textContent = value; group.append(dt, dd); fields.append(group); });
      dialog.showModal();
    });
    actionGroup.append(view);
    ['Suspend', 'Delete'].forEach(label => { const button = document.createElement('button'); button.type = 'button'; button.innerHTML = actionContent(label); button.setAttribute('aria-label', `${label} ${name}`); button.className = `registry-${label.toLowerCase()}`; button.disabled = true; button.title = `${label} — unavailable in this preview`; actionGroup.append(button); });
    document.getElementById('employer-registry').append(row);
  });
  document.getElementById('close-employer-profile').addEventListener('click', () => dialog.close());
  document.addEventListener('click', event => {
    if (!mobileActions.matches) return;
    document.querySelectorAll('.registry-action-menu[open]').forEach(menu => { if (!menu.contains(event.target)) menu.open = false; });
  });
  document.addEventListener('keydown', event => {
    if (mobileActions.matches && event.key === 'Escape') document.querySelectorAll('.registry-action-menu[open]').forEach(menu => { menu.open = false; menu.querySelector('summary').focus(); });
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
})();
