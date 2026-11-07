(() => {
  const posts = [
    { title: 'Junior Web Developer', employer: 'Sample Employer', posted: '2026-11-01', deadline: '2026-12-15', status: 'Published', salary: 'PHP 18,000–22,000 / month', skills: 'HTML, CSS, JavaScript', qualifications: 'Relevant IT education and at least 1 year of experience.', description: 'Build and maintain accessible website interfaces.', vacancies: 2 },
    { title: 'Office Assistant', employer: 'Pio Office Services', posted: '2026-11-02', deadline: '2026-12-15', status: 'Published', salary: 'PHP 14,000–17,000 / month', skills: 'MS Office, documentation, communication', qualifications: 'At least 1 year of relevant administrative experience.', description: 'Organize office records and support daily administrative tasks.', vacancies: 1 },
    { title: 'Data Encoder', employer: 'Albay Digital Services', posted: '', deadline: '2026-12-15', status: 'Draft', salary: 'PHP 13,000–16,000 / month', skills: 'Typing, spreadsheets, accuracy', qualifications: 'Entry-level applicants welcome.', description: 'Enter and verify records while maintaining accurate spreadsheets.', vacancies: 1 },
    { title: 'Customer Support Associate', employer: 'Duran Customer Care', posted: '2026-10-01', deadline: '2026-10-31', status: 'Closed', salary: 'Not specified', skills: 'Communication, typing, customer service', qualifications: 'Entry-level applicants welcome.', description: 'Assist customers and maintain service records.', vacancies: 3 }
  ];
  const search = document.getElementById('post-search');
  const filter = document.getElementById('post-status');
  const dialog = document.getElementById('post-dialog');
  const formatDate = value => value ? new Date(value + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not published';
  const showPost = post => {
    document.getElementById('post-dialog-title').textContent = post.title;
    document.getElementById('post-employer').textContent = post.employer;
    const details = document.getElementById('post-details'); details.replaceChildren();
    [['Status', post.status], ['Location', 'Pio Duran, Albay'], ['Employment type', 'Full-time'], ['Vacancies', post.vacancies], ['Salary', post.salary], ['Date posted', formatDate(post.posted)], ['Application deadline', formatDate(post.deadline)]].forEach(([label, value]) => {
      const group = document.createElement('div'); const dt = document.createElement('dt'); const dd = document.createElement('dd'); dt.textContent = label; dd.textContent = value; group.append(dt, dd); details.append(group);
    });
    ['description', 'skills', 'qualifications'].forEach(key => document.getElementById(`post-${key}`).textContent = post[key]);
    dialog.showModal();
  };
  const render = () => {
    const query = search.value.trim().toLowerCase();
    const matches = posts.filter(post => `${post.title} ${post.employer}`.toLowerCase().includes(query) && (filter.value === 'all' || post.status === filter.value));
    const body = document.getElementById('post-rows'); body.replaceChildren();
    matches.forEach(post => {
      const row = document.createElement('tr');
      const heading = document.createElement('th'); heading.scope = 'row';
      const title = document.createElement('strong'); title.textContent = post.title;
      const employer = document.createElement('small'); employer.textContent = post.employer; heading.append(title, employer); row.append(heading);
      [formatDate(post.posted), formatDate(post.deadline)].forEach(value => { const td = document.createElement('td'); td.textContent = value; row.append(td); });
      const status = document.createElement('td'); const badge = document.createElement('span'); badge.className = `post-status ${post.status.toLowerCase()}`; badge.textContent = post.status; status.append(badge); row.append(status);
      const action = document.createElement('td'); const view = document.createElement('button'); view.type = 'button'; view.className = 'post-view'; view.title = 'View job details'; view.setAttribute('aria-label', `View ${post.title} at ${post.employer}`); view.setAttribute('aria-haspopup', 'dialog'); view.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>'; view.addEventListener('click', () => showPost(post)); action.append(view); row.append(action); body.append(row);
    });
    document.getElementById('post-count').textContent = `${matches.length} sample job post${matches.length === 1 ? '' : 's'}`;
    document.getElementById('post-empty').hidden = matches.length !== 0;
  };
  search.addEventListener('input', render); filter.addEventListener('change', render);
  document.getElementById('post-close').addEventListener('click', () => dialog.close());
  render();
})();
