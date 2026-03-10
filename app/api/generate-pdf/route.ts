import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import Handlebars from 'handlebars';
import { connectToDatabase } from '@/lib/db';
import Template from '@/lib/models/Template';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { templateId, data } = body;

    if (!templateId) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    const template = await Template.findById(templateId);

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // 1. Compile Handlebars
    const hbTemplate = Handlebars.compile(template.htmlContent);
    const compiledHtml = hbTemplate(data || {});

    // 2. Inject CSS and Tailwind via CDN
    const finalHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            ${template.cssContent}
          </style>
        </head>
        <body>
          ${compiledHtml}
        </body>
      </html>
    `;

    // 3. Launch Puppeteer (Serverless optimized)
    let executablePath;
    let launchArgs = ['--no-sandbox', '--disable-setuid-sandbox'];
    
    if (process.env.NODE_ENV === 'production') {
      const chromium = require('@sparticuz/chromium');
      executablePath = await chromium.executablePath();
      launchArgs = chromium.args;
    } else {
      // Local development fallback (macOS specific for user's environment)
      executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    }

    const browser = await puppeteer.launch({
      args: launchArgs,
      defaultViewport: { width: 1920, height: 1080 },
      executablePath,
      headless: true,
    });

    try {
      const page = await browser.newPage();
      
      // Wait for networkidle0 to ensure Tailwind CDN and Google Fonts load properly!
      await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

      // 4. Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true, 
        margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
      });

      await browser.close();

      // 5. Return PDF
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
