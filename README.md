# PESO Pio Duran UI

Open `index.html` using Live Server to select a demonstration portal.

## File structure

```text
index.html                 Role selection
landing-page.html          Public website
login.html                 Login preview
applicant-register.html    Applicant registration
admin/                     Admin HTML pages
applicant/                 Job seeker HTML pages
employer/                  Employer HTML pages and registration
assets/
  css/                     Shared styles and styles grouped by portal
  js/                      Shared scripts and scripts grouped by portal
  images/                  Logo and background image
tests/
  responsive-qa.cjs        Responsive browser checks
  results/                 Browser reports and screenshots
```

`assets/css/theme.css` controls the shared header/footer colors and floating return button. `assets/css/style.css` contains the base styles. The shared portal layout and sidebar files are in the `applicant` subfolders under `assets/css` and `assets/js` and are also used by the admin and employer pages.

Pages are static previews. Registration, login, approval, and uploads are not connected to a backend.

The browser test currently uses a locally installed Playwright package and Microsoft Edge on Windows. Update its dependency/executable paths when running on another machine. Run from the project directory with `node tests/responsive-qa.cjs`.
