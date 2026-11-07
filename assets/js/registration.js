(() => {
  const form = document.getElementById('registration-form');
  const password = document.getElementById('new-password');
  const confirmation = document.getElementById('confirm-password');
  const validateMatch = () => {
    confirmation.setCustomValidity(confirmation.value && confirmation.value !== password.value ? 'Passwords do not match.' : '');
  };
  password.addEventListener('input', validateMatch);
  confirmation.addEventListener('input', validateMatch);
  document.querySelectorAll('.password-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.getAttribute('aria-controls'));
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      button.textContent = show ? 'Hide' : 'Show';
      button.setAttribute('aria-pressed', String(show));
      button.setAttribute('aria-label', `${show ? 'Hide' : 'Show'} ${input === confirmation ? 'confirm password' : 'password'}`);
    });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    validateMatch();
    if (!form.reportValidity()) return;
    password.value = '';
    confirmation.value = '';
    const status = document.getElementById('registration-status');
    status.textContent = 'Your form passed validation. This is a registration preview; no account was created and no details were saved.';
    status.focus();
  });
})();
