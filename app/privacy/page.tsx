import { Badge } from '@/components/ui/Badge';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-32">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-12">
          <div className="mb-6"><Badge>LEGAL</Badge></div>
          <h1 className="text-4xl md:text-5xl font-heading text-foreground mb-4">Privacy Policy</h1>
          <p className="text-foreground/60 font-mono text-sm">Last Updated: March 10, 2026</p>
        </div>

        <div className="prose prose-slate max-w-none text-foreground/80 space-y-8">
          <section>
            <h2 className="text-2xl font-heading text-foreground mb-4">1. Introduction</h2>
            <p className="leading-relaxed">
              At Fast PDF, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and API services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-foreground mb-4">2. Information We Collect</h2>
            <p className="leading-relaxed mb-4">
              We collect information that you provide directly to us when registering for an account, including:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Your name and email address.</li>
              <li>Authentication credentials (securely hashed).</li>
              <li>Billing information (processed securely through third-party payment providers).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-foreground mb-4">3. Data Processing and Storage</h2>
            <p className="leading-relaxed mb-4">
              <strong>Transient PDF Generation:</strong> Fast PDF acts as an API pass-through for your document generation needs. We do not permanently store the HTML templates or JSON data payloads you transmit to our generation endpoints.
            </p>
            <p className="leading-relaxed">
              Any generated PDFs are stored temporarily in transient memory just long enough to be delivered back to your API request. Once delivered, the PDF and its source data are immediately purged from our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-foreground mb-4">4. Sharing Your Information</h2>
            <p className="leading-relaxed">
              We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information with our business partners and trusted affiliates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-foreground mb-4">5. Contacting Us</h2>
            <p className="leading-relaxed">
              If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at privacy@fastpdf.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
