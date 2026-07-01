# Fast PDF — Dynamic PDF Generator

Generate pixel-perfect PDFs from HTML/CSS templates and dynamic JSON data — designed in a browser editor, rendered by a real browser engine, and delivered through a simple API call.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

## Overview

Fast PDF lets you design a document once — an invoice, receipt, certificate, CV, or voucher — using standard HTML and CSS with Handlebars-style placeholders (`{{ invoice_number }}`), then generate as many populated PDFs as you need by POSTing JSON data to an API endpoint. Rendering is done with a real headless browser (Puppeteer + Chromium), so the output matches what you'd see on screen: real fonts, real CSS, real layout — not an approximation.

## Features

- **HTML-to-PDF templates** — build documents with the web technologies you already know
- **Live template editor** — Monaco-powered code editor with a live split-pane preview
- **Prebuilt starting points** — invoice, receipt, professional CV, gift voucher, and blank templates
- **Dynamic data injection** — merge arbitrary JSON payloads into a template at generation time
- **Google Fonts support** — fonts are fetched and inlined as base64 so PDFs render correctly with no external font requests
- **Custom page sizing** — configurable per-template page dimensions
- **One-click API snippets** — ready-to-copy cURL, Node.js, and Python examples for every template
- **Account system** — email/password auth with OTP email verification and password reset
- **Usage dashboard** — track plan, API calls, and total PDFs generated

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | NextAuth (Credentials provider, JWT sessions) |
| Database | MongoDB via Mongoose |
| PDF rendering | Puppeteer-core + `@sparticuz/chromium` |
| Templating | Handlebars |
| Email | Nodemailer |
| Editor | Monaco Editor |
| Animation | Framer Motion |

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB connection string (local or hosted, e.g. MongoDB Atlas)
- SMTP credentials for transactional email (OTP / password reset)

### Installation

```bash
git clone https://github.com/ammarhussainsiddiqui/Dynamic-PDF-Generator.git
cd Dynamic-PDF-Generator
npm install
```

### Environment variables

Create a `.env.local` file in the project root:

```bash
# MongoDB
MONGODB_URI=your-mongodb-connection-string

# NextAuth
NEXTAUTH_SECRET=a-long-random-secret
NEXTAUTH_URL=http://localhost:3000

# Email (SMTP) for OTP / password reset
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
EMAIL_FROM=noreply@yourdomain.com
```

### Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Usage

1. **Sign up** and verify your email via the OTP flow.
2. **Create a template** in the dashboard — start from a prebuilt example or a blank canvas — and write HTML/CSS with `{{ placeholders }}` for dynamic fields. Use the live preview to iterate.
3. **Save the template** to get a `templateId`.
4. **Generate PDFs** from your own application by calling the API:

```bash
curl -X POST http://localhost:3000/api/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "YOUR_TEMPLATE_ID",
    "data": { "invoice_number": "INV-1042", "amount": "250.00" }
  }' \
  --output document.pdf
```

Node.js and Python equivalents are available directly in the app's "API Integration" panel for each template.

## Project Structure

```
app/
  (auth)/            # Login, register, password reset, email verification pages
  api/
    auth/            # Auth + OTP + password reset endpoints
    generate-pdf/    # Core PDF rendering endpoint
    templates/       # Template CRUD endpoints
    stats/           # Usage stats endpoint
  dashboard/         # User dashboard
  templates/         # Template editor pages
components/          # UI components, template editor, API integration modal
lib/                 # DB connection, email, browser (Puppeteer) setup, prebuilt templates
models/              # Mongoose models
```

## Pricing Tiers

| Plan | Price | Highlights |
|---|---|---|
| Hobby | Free | 100 PDFs/month, basic templates, watermarked |
| Pro | $29/mo | 10,000 PDFs/month, no watermark, custom domains, advanced API access |
| Enterprise | Custom | Unlimited PDFs, dedicated infrastructure, SLA, account manager |

## Roadmap / Known Limitations

This is an actively evolving project. A few things to be aware of if you're deploying it:

- The `generate-pdf` endpoint does not currently enforce authentication or plan-based rate limits — treat it as a starting point, not production-hardened, until usage metering is wired up.
- Google Fonts are fetched at request time on a cache miss; consider pre-warming the font cache for latency-sensitive deployments.

Contributions and issue reports are welcome — see [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) before opening a PR or issue.

## License

Distributed under the MIT License. See [LICENSE](./LICENSE) for details.
