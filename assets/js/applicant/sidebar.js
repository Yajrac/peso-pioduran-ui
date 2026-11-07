(() => {
  const sidebar = document.querySelector('.sidebar');
  const layout = document.querySelector('.dash-layout');
  if (!sidebar || !layout) return;
  const logout = document.createElement('a');
  logout.className = 'side-link sidebar-logout';
  logout.href = '../login.html';
  logout.title = 'Log Out';
  logout.setAttribute('aria-label', 'Log Out');
  sidebar.append(logout);
  const shapes = {
    'employers.html': '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 21v-4h6v4M8 7h1m6 0h1M8 11h1m6 0h1"/>',
    'dashboard.html': '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    'jobs.html': '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12a20 20 0 0 0 18 0M12 11v4"/>',
    'applications.html': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5"/>',
    'profile.html': '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>'
  };
  const svg = (shape) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shape}</svg>`;
  sidebar.querySelectorAll('.side-link').forEach(link => {
    if (link === logout) return;
    link.querySelectorAll('span:not(.sidebar-link-label), svg').forEach(icon => icon.remove());
    const text = link.textContent.trim();
    const shape = shapes[link.getAttribute('href')] || (
      /profile|seeker|applicant|employer/i.test(text) ? shapes['profile.html'] :
      /job|vacanc/i.test(text) ? shapes['jobs.html'] :
      /overview|dashboard/i.test(text) ? shapes['dashboard.html'] : shapes['applications.html']
    );
    link.textContent = '';
    link.insertAdjacentHTML('afterbegin', svg(shape));
    const label = document.createElement('span');
    label.className = 'sidebar-link-label';
    label.textContent = text;
    link.append(label);
    link.title = text;
    link.setAttribute('aria-label', text);
  });
  logout.innerHTML = svg('<path d="M9 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4M14 8l4 4-4 4M8 12h13"/>') + '<span class="sidebar-link-label">Log Out</span>';
  sidebar.id = 'applicant-sidebar';
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'sidebar-toggle';
  toggle.innerHTML = svg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18m6-12-3 3 3 3"/>');
  toggle.setAttribute('aria-controls', sidebar.id);
  layout.append(toggle);
  const positionToggle = () => {
    layout.style.setProperty('--sidebar-toggle-left', `${sidebar.offsetLeft + sidebar.offsetWidth - 16}px`);
  };
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(positionToggle).observe(sidebar);
  }
  window.addEventListener('resize', positionToggle);
  const update = (collapsed) => {
    layout.classList.toggle('sidebar-collapsed', collapsed);
    toggle.setAttribute('aria-expanded', String(!collapsed));
    toggle.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
    toggle.title = collapsed ? 'Expand sidebar' : 'Collapse sidebar';
    positionToggle();
  };
  let saved = false;
  try { saved = localStorage.getItem('applicant-sidebar-collapsed') === 'true'; } catch {}
  update(saved);
  toggle.addEventListener('click', () => {
    const collapsed = !layout.classList.contains('sidebar-collapsed');
    update(collapsed);
    try { localStorage.setItem('applicant-sidebar-collapsed', String(collapsed)); } catch {}
  });
})();
