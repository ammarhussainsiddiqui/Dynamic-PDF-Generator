import { NextResponse } from 'next/server';
import Handlebars from 'handlebars';
import { connectToDatabase } from '@/lib/db';
import Template from '@/lib/models/Template';
import { getBrowser } from '@/lib/browser';

// Template cache to store compiled Handlebars functions
const templateCache = new Map<string, Handlebars.TemplateDelegate>();

// Font cache to store inlined @font-face CSS
const fontCache = new Map<string, { css: string; timestamp: number }>();

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

    // Use cached template or compile new one
    let hbTemplate = templateCache.get(templateId);
    if (!hbTemplate || template.updatedAt.getTime() > (hbTemplate as any)._lastUpdate) {
      hbTemplate = Handlebars.compile(template.htmlContent);
      (hbTemplate as any)._lastUpdate = template.updatedAt.getTime();
      templateCache.set(templateId, hbTemplate);
    }

    const compiledHtml = hbTemplate(data || {});

    // Determined effective page size and fonts
    const effectivePageSize = {
      width: pageSize?.width || template.pageSize?.width || 794,
      height: pageSize?.height || template.pageSize?.height || 1123,
    };

    const fontsToLoad = template.googleFonts && template.googleFonts.length > 0 
      ? [...template.googleFonts].sort() 
      : ['Inter', 'Poppins'];

    const fontCacheKey = fontsToLoad.join('|');
    let inlinedFontsCss = '';
    
    // Check font cache first (expire after 24 hours)
    const cachedFonts = fontCache.get(fontCacheKey);
    const CACHE_TTL = 24 * 60 * 60 * 1000;

    if (cachedFonts && (Date.now() - cachedFonts.timestamp < CACHE_TTL)) {
      inlinedFontsCss = cachedFonts.css;
      console.log('PDF Gen - Using cached inlined fonts');
    } else {
      console.log('PDF Gen - Fetching and inlining fonts:', fontsToLoad);
      try {
        const googleFontsUrl = `https://fonts.googleapis.com/css2?${fontsToLoad.map(f => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700`).join('&')}`;
        
        const cssResponse = await fetch(googleFontsUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        
        let cssText = await cssResponse.text();
        
        // Find all src URLs in the CSS (handling quotes)
        const urlRegex = /src:\s*url\(['"]?(https:\/\/[^'")]*)['"]?\)/g;
        let match;
        const urlMap = new Map<string, string>();
        
        const matches = [...cssText.matchAll(urlRegex)];
        await Promise.all(matches.map(async (m) => {
          const url = m[1];
          if (!urlMap.has(url)) {
            const fontRes = await fetch(url);
            const fontBuffer = await fontRes.arrayBuffer();
            const base64 = Buffer.from(fontBuffer).toString('base64');
            const mimeType = url.endsWith('.woff2') ? 'font/woff2' : 'font/woff';
            urlMap.set(url, `data:${mimeType};base64,${base64}`);
          }
        }));

        // Replace URLs with Base64
        for (const [url, base64] of urlMap.entries()) {
          cssText = cssText.replace(new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), base64);
        }
        
        inlinedFontsCss = cssText;
        fontCache.set(fontCacheKey, { css: cssText, timestamp: Date.now() });
        console.log('PDF Gen - Successfully fully inlined and cached fonts');
      } catch (e) {
        console.error('PDF Gen - Failed to inline Google Fonts:', e);
      }
    }

    // Final HTML - Minimal and Robust
    const finalHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            ${inlinedFontsCss}
            * { box-sizing: border-box; }
            html, body { 
              margin: 0; 
              padding: 0;
              font-family: "${fontsToLoad[0]}", "Inter", "Poppins", sans-serif !important;
              -webkit-font-smoothing: antialiased;
            }
            @page {
              margin: 0;
              size: ${effectivePageSize.width}px ${effectivePageSize.height}px;
            }
            ${template.cssContent}
          </style>
        </head>
        <body>
          <div id="pdf-root">
            ${compiledHtml}
          </div>
        </body>
      </html>
    `;

    const browser = await getBrowser();
    const page = await browser.newPage();

    // Set a modern User-Agent

    try {
      await page.setViewport({
        width: effectivePageSize.width,
        height: effectivePageSize.height,
        deviceScaleFactor: 2, // Higher density for better font rendering
      });

      console.log('PDF Gen - Loading Content into Puppeteer...');
      
      await page.setContent(finalHtml, { 
        waitUntil: ['load', 'networkidle2'],
        timeout: 30000 
      });

      // Quick font validation (optional)
      const primaryFont = fontsToLoad[0];
      const isLoaded = await page.evaluate(async (f) => {
        return (await document.fonts.load(`1em "${f}"`)).length > 0;
      }, primaryFont);
      console.log(`PDF Gen - Font "${primaryFont}" loaded:`, isLoaded);

      console.log('PDF Gen - Stabilization delay (200ms)...');
      await new Promise(r => setTimeout(r, 200));

      console.log('PDF Gen - Creating PDF Final...');
      const pdfBuffer = await page.pdf({
        width: `${effectivePageSize.width}px`,
        height: `${effectivePageSize.height}px`,
        printBackground: true,
        preferCSSPageSize: true,
      });

      await page.close();

      return new NextResponse(Buffer.from(pdfBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="generated-${Date.now()}.pdf"`,
        },
      });

    } catch (pageError) {
      await page.close();
      throw pageError;
    }

  } catch (error: any) {
    console.error('PDF Gen Error:', error);
    let errorMessage = 'Failed to generate PDF';
    
    if (error.name === 'TimeoutError') {
      errorMessage = 'Generation timed out. The template may be too complex or assets are slow.';
    } else if (error.message?.includes('Protocol error')) {
      errorMessage = 'Browser protocol error. Please try again.';
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
