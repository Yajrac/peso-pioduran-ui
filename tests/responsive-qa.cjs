const { chromium } = require('C:/Users/user/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const out = path.join(__dirname, 'results');
fs.mkdirSync(out, { recursive: true });
const allFiles = ['.', 'admin', 'applicant', 'employer'].flatMap(dir => fs.readdirSync(path.join(root, dir)).filter(file => file.endsWith('.html')).map(file => path.posix.join(dir, file)));
const files = process.argv.length > 2 ? allFiles.filter(file => process.argv.slice(2).includes(file)) : allFiles;
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0]));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', ({ '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg' })[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const results = [];
  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: width < 500 ? 844 : 900 }, isMobile: width < 500, hasTouch: width < 500 });
    for (const file of files) {
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${base}/${file}`, { waitUntil: 'load', timeout: 60000 });
      await page.waitForTimeout(120);
      const info = await page.evaluate(() => {
        const main = document.querySelector('.dash-main');
        const sidebar = document.querySelector('.sidebar');
        const viewport = document.documentElement.clientWidth;
        return {
          overflow: document.documentElement.scrollWidth > viewport + 2,
          mainOverflow: !!main && main.scrollWidth > main.clientWidth + 2,
          sidebarVisible: !!sidebar && getComputedStyle(sidebar).display !== 'none',
          offenders: [...document.querySelectorAll('body *')].filter(el => {
            const rect = el.getBoundingClientRect();
            return rect.width && rect.right > viewport + 2 && !el.closest('.overflow-x-auto, .employer-table-wrap, .table-wrap, .mobile-nav') && getComputedStyle(el).position !== 'fixed';
          }).slice(0, 6).map(el => ({ tag: el.tagName, cls: el.className }))
        };
      });
      const result = { file, width, ...info, errors };
      results.push(result);
      if (info.overflow || info.mainOverflow || errors.length || (width < 500 && info.sidebarVisible)) {
        await page.screenshot({ path: path.join(out, `${file.replaceAll('/', '-')}-${width}.png`), fullPage: true });
        console.log(JSON.stringify(result));
      }
      await page.close();
    }
    await context.close();
  }
  // Exercise modal, dropdown and collapse behavior at representative sizes.
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${base}/admin/employers.html`);
  await page.locator('.registry-action-menu summary').first().click();
  await page.locator('.registry-view').first().click();
  if (!await page.locator('#employer-profile-dialog').evaluate(el => el.open)) throw Error('Employer modal failed');
  await page.keyboard.press('Escape');
  await page.locator('.review-view').first().click();
  if (!await page.locator('.registration-review-dialog').evaluate(el => el.open)) throw Error('Review modal failed');
  await page.keyboard.press('Escape');
  await page.goto(`${base}/admin/job-posts.html`);
  await page.locator('.post-view').first().click();
  if (!await page.locator('#post-dialog').evaluate(el => el.open)) throw Error('Job modal failed');
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.locator('.sidebar-toggle').click();
  await page.waitForTimeout(350);
  if (!await page.locator('.dash-layout').evaluate(el => el.classList.contains('sidebar-collapsed'))) throw Error('Sidebar collapse failed');
  await page.close();
  fs.writeFileSync(path.join(out, files.length === allFiles.length ? 'responsive-audit.json' : 'responsive-recheck.json'), JSON.stringify(results, null, 2));
  console.log(`Completed ${results.length} page/viewport checks and modal/dropdown/collapse checks.`);
  await browser.close();
  server.close();
})().catch(error => { console.error(error); server.close(); process.exit(1); });
