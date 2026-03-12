import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import Handlebars from 'handlebars';
import { connectToDatabase } from '@/lib/db';
import Template from '@/lib/models/Template';

export async function POST(req: Request) {
try {
const body = await req.json();
const { templateId, data, pageSize } = body;

if (!templateId) {
  return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
}

await connectToDatabase();
const template = await Template.findById(templateId);

if (!template) {
  return NextResponse.json({ error: 'Template not found' }, { status: 404 });
}

// Compile Handlebars
const hbTemplate = Handlebars.compile(template.htmlContent);
const compiledHtml = hbTemplate(data || {});

// Determine effective page size: Body > Template > Default (A4)
const effectivePageSize = {
  width: pageSize?.width || template.pageSize?.width || 794,
  height: pageSize?.height || template.pageSize?.height || 1123,
};

// Final HTML with proper print reset
const finalHtml = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <script src="https://cdn.tailwindcss.com"></script>

      <style>
        * {
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
        }

        @page {
          margin: 0;
          size: ${effectivePageSize.width}px ${effectivePageSize.height}px;
        }

        ${template.cssContent}
      </style>
    </head>

    <body>
      ${compiledHtml}
    </body>
  </html>
`;

// Puppeteer setup
let executablePath: string;
let launchArgs = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'];

// Priority 1: Environment variable
if (process.env.CHROME_EXECUTABLE_PATH) {
  executablePath = process.env.CHROME_EXECUTABLE_PATH;
} 
// Priority 2: Local Mac (Darwin) - Use local Chrome
else if (process.platform === 'darwin') {
  executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
} 
// Priority 3: Serverless Production (AWS/Vercel)
else if (process.env.NODE_ENV === 'production') {
  const chromium = require('@sparticuz/chromium');
  executablePath = await chromium.executablePath();
  launchArgs = [...launchArgs, ...chromium.args];
} 
// Priority 4: Default Fallback
else {
  executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
}

const browser = await puppeteer.launch({
  args: launchArgs,
  executablePath,
  headless: true,
  defaultViewport: {
    width: effectivePageSize.width,
    height: effectivePageSize.height,
  },
});

try {
  const page = await browser.newPage();

  await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    width: `${effectivePageSize.width}px`,
    height: `${effectivePageSize.height}px`,
    printBackground: true,
    preferCSSPageSize: true,
    margin: {
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    },
  });

  await browser.close();

  return new NextResponse(Buffer.from(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="generated-${Date.now()}.pdf"`,
    },
  });

} catch (pageError) {
  await browser.close();
  throw pageError;
}

} catch (error) {
  console.error('PDF Gen Error:', error);
  return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
}
}
