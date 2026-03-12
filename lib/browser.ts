import puppeteer, { Browser } from 'puppeteer-core';

let browserInstance: Browser | null = null;
let browserPromise: Promise<Browser> | null = null;

export async function getBrowser(): Promise<Browser> {
  if (browserInstance && browserInstance.connected) {
    return browserInstance;
  }

  if (browserPromise) {
    return browserPromise;
  }

  browserPromise = (async () => {
    let executablePath: string;
    let launchArgs = [
      '--no-sandbox', 
      '--disable-setuid-sandbox', 
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--font-render-hinting=none', // Helps with consistent font rendering
    ];

    if (process.env.CHROME_EXECUTABLE_PATH) {
      executablePath = process.env.CHROME_EXECUTABLE_PATH;
    } else if (process.platform === 'darwin') {
      executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    } else if (process.env.NODE_ENV === 'production') {
      const chromium = require('@sparticuz/chromium');
      executablePath = await chromium.executablePath();
      launchArgs = [...launchArgs, ...chromium.args];
    } else {
      executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    }

    const browser = await puppeteer.launch({
      args: launchArgs,
      executablePath,
      headless: true,
    });

    browserInstance = browser;
    browserPromise = null;

    browser.on('disconnected', () => {
      browserInstance = null;
    });

    return browser;
  })();

  return browserPromise;
}
