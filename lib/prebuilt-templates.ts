export interface PrebuiltTemplate {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  category: 'Standard' | 'Small Formats' | 'Marketing';
  htmlContent: string;
  cssContent: string;
  sampleJson: string;
  sizeKey: string;
  pageSize: {
    width: number;
    height: number;
  };
  googleFonts: string[];
}

export const PREBUILT_TEMPLATES: PrebuiltTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Template',
    description: 'Start from scratch with a clean slate.',
    icon: 'FilePlus2',
    category: 'Standard',
    htmlContent: '<div className="p-8">\n  <h1 className="text-3xl font-bold">New Template</h1>\n  <p className="mt-4 text-gray-600">Start editing to create your PDF.</p>\n</div>',
    cssContent: 'body { font-family: "Inter", sans-serif; }',
    sampleJson: '{\n  "title": "My New Template"\n}',
    sizeKey: 'a4',
    pageSize: { width: 794, height: 1123 },
    googleFonts: ['Inter']
  },
  {
    id: 'receipt',
    name: 'Modern Receipt',
    description: 'Perfect for retail and thermal printers.',
    icon: 'Receipt',
    category: 'Small Formats',
    htmlContent: `<div class="receipt">
  <div class="header">
    <div class="store-name">{{storeName}}</div>
    <div class="store-address">{{storeAddress}}</div>
    <div class="store-phone">{{storePhone}}</div>
  </div>

  <div class="divider">***************************</div>

  <div class="details">
    <div>Date: {{date}}</div>
    <div>Receipt #: {{receiptNo}}</div>
    <div>Cashier: {{cashier}}</div>
  </div>

  <div class="divider">---------------------------</div>

  <table class="items">
    {{#each items}}
    <tr>
      <td colspan="2">{{name}}</td>
    </tr>
    <tr>
      <td>{{qty}} x {{price}}</td>
      <td class="text-right">{{total}}</td>
    </tr>
    {{/each}}
  </table>

  <div class="divider">---------------------------</div>

  <div class="totals font-bold">
    <div class="flex justify-between">
      <span>SUBTOTAL</span>
      <span>{{subtotal}}</span>
    </div>
    <div class="flex justify-between">
      <span>TAX ({{taxRate}}%)</span>
      <span>{{taxAmount}}</span>
    </div>
    <div class="flex justify-between text-xl mt-2 pb-2">
      <span>TOTAL</span>
      <span>{{grandTotal}}</span>
    </div>
  </div>

  <div class="divider">***************************</div>

  <div class="footer">
    <div>THANK YOU FOR SHOPPING!</div>
    <div class="mt-2">{{website}}</div>
  </div>
</div>`,
    cssContent: `body {
  background: white;
  color: black;
  font-family: 'JetBrains Mono', monospace;
}

.receipt {
  padding: 15px;
  width: 100%;
}

.header {
  text-align: center;
  margin-bottom: 10px;
}

.store-name {
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
}

.store-address, .store-phone {
  font-size: 0.8rem;
}

.divider {
  text-align: center;
  margin: 5px 0;
  letter-spacing: 2px;
}

.details {
  font-size: 0.8rem;
  margin: 10px 0;
}

.items {
  width: 100%;
  font-size: 0.85rem;
  border-collapse: collapse;
}

.items td {
  padding: 2px 0;
}

.text-right {
  text-align: right;
}

.totals {
  margin-top: 10px;
}

.flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.font-bold {
  font-weight: bold;
}

.text-xl {
  font-size: 1.1rem;
}

.footer {
  text-align: center;
  font-size: 0.8rem;
  margin-top: 20px;
}`,
    sampleJson: `{
  "storeName": "TurnUp Tech Store",
  "storeAddress": "123 Innovation Drive, Tech City",
  "storePhone": "+1 (555) 000-1111",
  "date": "2024-03-13 14:30",
  "receiptNo": "TRX-99821",
  "cashier": "Sarah J.",
  "items": [
    { "name": "Wireless Mouse", "qty": 1, "price": "$25.00", "total": "$25.00" },
    { "name": "USB-C Cable (2m)", "qty": 2, "price": "$12.50", "total": "$25.00" },
    { "name": "Mechanical Keyboard", "qty": 1, "price": "$85.00", "total": "$85.00" }
  ],
  "subtotal": "$135.00",
  "taxRate": "8",
  "taxAmount": "$10.80",
  "grandTotal": "$145.80",
  "website": "www.turnuptech.com"
}`,
    sizeKey: 'receipt_80',
    pageSize: { width: 302, height: 800 },
    googleFonts: ['JetBrains Mono']
  },
  {
    id: 'cv',
    name: 'Professional CV',
    description: 'Clean, modern resume template for professionals.',
    icon: 'User',
    category: 'Standard',
    htmlContent: `<div class="cv-container">
  <div class="header">
    <div class="name-section">
      <h1>{{fullName}}</h1>
      <p class="role">{{targetRole}}</p>
    </div>
    <div class="contact-info">
      <div>{{email}}</div>
      <div>{{phone}}</div>
      <div>{{location}}</div>
    </div>
  </div>

  <div class="main-grid">
    <div class="left-col">
      <section>
        <h2>Experience</h2>
        {{#each experience}}
        <div class="job">
          <div class="job-header">
            <span class="company">{{company}}</span>
            <span class="dates">{{dates}}</span>
          </div>
          <div class="job-title">{{title}}</div>
          <p class="job-desc">{{description}}</p>
        </div>
        {{/each}}
      </section>

      <section>
        <h2>Education</h2>
        {{#each education}}
        <div class="school">
          <div class="school-header">
            <span class="institution">{{institution}}</span>
          </div>
          <div class="degree">{{degree}} | {{dates}}</div>
        </div>
        {{/each}}
      </section>
    </div>

    <div class="right-col">
      <section>
        <h2>Skills</h2>
        <div class="skills-list">
          {{#each skills}}
          <span class="skill-tag">{{this}}</span>
          {{/each}}
        </div>
      </section>

      <section>
        <h2>Languages</h2>
        {{#each languages}}
        <div class="lang">
          <span class="lang-name">{{name}}</span>
          <span class="lang-level">({{level}})</span>
        </div>
        {{/each}}
      </section>
    </div>
  </div>
</div>`,
    cssContent: `body {
  font-family: 'Inter', sans-serif;
  color: #333;
  line-height: 1.6;
}

.cv-container {
  padding: 40px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 2px solid #333;
  padding-bottom: 20px;
  margin-bottom: 30px;
}

h1 {
  font-size: 2.5rem;
  margin: 0;
  color: #000;
  letter-spacing: -1px;
}

.role {
  font-size: 1.1rem;
  color: #666;
  margin: 5px 0 0 0;
}

.contact-info {
  text-align: right;
  font-size: 0.9rem;
  color: #555;
}

h2 {
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
  margin-top: 30px;
  color: #000;
}

.main-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}

.job {
  margin-bottom: 20px;
}

.job-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}

.job-title {
  color: #0052FF;
  font-weight: 500;
}

.job-desc {
  font-size: 0.95rem;
  margin-top: 5px;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  background: #f0f4ff;
  color: #0052FF;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
}

.lang {
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.lang-level {
  color: #888;
  margin-left: 5px;
}`,
    sampleJson: `{
  "fullName": "Alex Rivera",
  "targetRole": "Senior Full-Stack Developer",
  "email": "alex.rivera@example.com",
  "phone": "+1 (555) 123-4567",
  "location": "San Francisco, CA",
  "experience": [
    {
      "company": "TechFlow Systems",
      "title": "Lead Engineer",
      "dates": "2021 - Present",
      "description": "Architected high-performance PDF engine and scaled API infrastructure by 400%."
    },
    {
      "company": "PixelPerfect",
      "title": "Full Stack Dev",
      "dates": "2018 - 2021",
      "description": "Developed dynamic visual editors and optimized real-time synchronization systems."
    }
  ],
  "education": [
    {
      "institution": "Stanford University",
      "degree": "B.S. Computer Science",
      "dates": "2014 - 2018"
    }
  ],
  "skills": ["React", "Next.js", "Node.js", "MongoDB", "TypeScript", "Puppeteer", "AWS"],
  "languages": [
    { "name": "English", "level": "Native" },
    { "name": "Spanish", "level": "Fluent" }
  ]
}`,
    sizeKey: 'a4',
    pageSize: { width: 794, height: 1123 },
    googleFonts: ['Inter']
  },
  {
    id: 'voucher',
    name: 'Gift Voucher',
    description: 'Elegant voucher for discounts or rewards.',
    icon: 'Ticket',
    category: 'Marketing',
    htmlContent: `<div class="voucher">
  <div class="pattern-bg"></div>
  <div class="content">
    <div class="logo">TURNUP</div>
    <div class="tagline">PREMIUM EXPERIENCES</div>
    
    <div class="offer">
      <div class="amount">{{discountAmount}}</div>
      <div class="off">OFF</div>
    </div>
    
    <p class="description">{{description}}</p>
    
    <div class="footer">
      <div class="code">CODE: {{promoCode}}</div>
      <div class="expiry">Valid until: {{expiryDate}}</div>
    </div>
  </div>
</div>`,
    cssContent: `body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
}

.voucher {
  width: 100%;
  height: 100%;
  background: #0052FF;
  color: white;
  position: relative;
  overflow: hidden;
  padding: 20px;
}

.pattern-bg {
  position: absolute;
  inset: 0;
  opacity: 0.1;
  background-image: radial-gradient(circle at 10px 10px, white 2px, transparent 0);
  background-size: 25px 25px;
  transform: rotate(5deg);
}

.content {
  position: relative;
  z-index: 10;
  border: 2px solid rgba(255,255,255,0.3);
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.logo {
  font-weight: 800;
  font-size: 1.5rem;
  letter-spacing: 5px;
}

.tagline {
  font-size: 0.6rem;
  letter-spacing: 2px;
  margin-top: 5px;
  opacity: 0.8;
}

.offer {
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.amount {
  font-size: 4rem;
  font-weight: 900;
  line-height: 1;
}

.off {
  font-size: 1.5rem;
  font-weight: 700;
  transform: rotate(-90deg);
}

.description {
  font-size: 0.8rem;
  max-width: 80%;
  margin-bottom: 20px;
}

.footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: auto;
}

.code {
  background: white;
  color: #0052FF;
  padding: 5px 15px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 0.9rem;
  font-family: monospace;
}

.expiry {
  font-size: 0.6rem;
  opacity: 0.7;
}`,
    sampleJson: `{
  "discountAmount": "$50",
  "description": "Your exclusive reward. Use this code at checkout to claim your discount on any service.",
  "promoCode": "DISCOVER-TURNUP",
  "expiryDate": "Dec 31, 2024"
}`,
    sizeKey: 'business',
    pageSize: { width: 340, height: 204 },
    googleFonts: ['Poppins']
  },
  {
    id: 'invoice',
    name: 'Modern Invoice',
    description: 'Clean business invoice with detailed item table.',
    icon: 'FileText',
    category: 'Standard',
    htmlContent: `<div class="invoice-box">
  <div class="header">
    <div class="company-info">
      <div class="logo">INVOICE</div>
      <div>{{companyName}}</div>
      <div>{{companyAddress}}</div>
    </div>
    <div class="bill-to">
      <div class="label">BILL TO:</div>
      <div class="client-name">{{clientName}}</div>
      <div>{{clientAddress}}</div>
    </div>
  </div>

  <div class="meta">
    <div class="meta-item">
      <div class="label">INVOICE #</div>
      <div class="value">{{invoiceNo}}</div>
    </div>
    <div class="meta-item">
      <div class="label">DATE</div>
      <div class="value">{{date}}</div>
    </div>
    <div class="meta-item">
      <div class="label">DUE DATE</div>
      <div class="value">{{dueDate}}</div>
    </div>
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th>Description</th>
        <th class="text-center">Qty</th>
        <th class="text-right">Price</th>
        <th class="text-right">Amount</th>
      </tr>
    </thead>
    <tbody>
      {{#each items}}
      <tr>
        <td>{{description}}</td>
        <td class="text-center">{{qty}}</td>
        <td class="text-right">{{price}}</td>
        <td class="text-right">{{amount}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>

  <div class="summary">
    <div class="summary-line">
      <span>Subtotal:</span>
      <span>{{subtotal}}</span>
    </div>
    <div class="summary-line font-bold total">
      <span>Total:</span>
      <span>{{total}}</span>
    </div>
  </div>

  <div class="notes">
    <div class="label">NOTES</div>
    <p>{{notes}}</p>
  </div>
</div>`,
    cssContent: `body {
  font-family: 'Inter', sans-serif;
  padding: 40px;
}
.header { display: flex; justify-content: space-between; margin-bottom: 40px; }
.logo { font-size: 2rem; font-weight: 800; color: #0052FF; margin-bottom: 10px; }
.label { font-size: 0.75rem; color: #888; text-transform: uppercase; font-weight: 700; margin-bottom: 3px; }
.bill-to { text-align: right; }
.client-name { font-weight: 700; font-size: 1.1rem; }
.meta { display: flex; gap: 40px; background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 40px; }
.meta-item .value { font-weight: 600; }
.items-table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
.items-table th { text-align: left; padding: 12px 10px; border-bottom: 2px solid #eee; font-size: 0.85rem; color: #666; }
.items-table td { padding: 15px 10px; border-bottom: 1px solid #eee; }
.text-right { text-align: right; }
.text-center { text-align: center; }
.summary { margin-left: auto; width: 250px; }
.summary-line { display: flex; justify-content: space-between; padding: 10px 0; }
.total { font-size: 1.25rem; color: #0052FF; border-top: 2px solid #0052FF; margin-top: 10px; }
.notes { margin-top: 60px; font-size: 0.85rem; color: #666; }`,
    sampleJson: `{
  "companyName": "TurnUp Technologies",
  "companyAddress": "123 Innovation St, Tech Valley",
  "clientName": "Acme Corp",
  "clientAddress": "456 Enterprise Ave, Big City",
  "invoiceNo": "INV-2024-001",
  "date": "March 13, 2024",
  "dueDate": "March 27, 2024",
  "items": [
    { "description": "PDF Generation Service", "qty": 1, "price": "$499.00", "amount": "$499.00" },
    { "description": "Custom Template Design", "qty": 2, "price": "$150.00", "amount": "$300.00" }
  ],
  "subtotal": "$799.00",
  "total": "$799.00",
  "notes": "Thank you for your business. Please pay within 14 days."
}`,
    sizeKey: 'a4',
    pageSize: { width: 794, height: 1123 },
    googleFonts: ['Inter']
  }
];
