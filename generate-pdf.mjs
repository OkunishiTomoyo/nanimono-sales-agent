import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const htmlPath = resolve(__dirname, 'index.html');
const pdfPath = resolve(__dirname, 'NANIMONO_SALES_AGENT.pdf');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Set viewport to landscape A4 proportions
  await page.setViewport({ width: 1122, height: 794, deviceScaleFactor: 2 });

  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });

  await page.pdf({
    path: pdfPath,
    width: '297mm',
    height: '210mm',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    displayHeaderFooter: false,
    preferCSSPageSize: true,
  });

  await browser.close();
  console.log(`PDF generated: ${pdfPath}`);
})();
