import { Badge } from '@/components/ui/Badge';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-32">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-12">
          <div className="mb-6"><Badge>LEGAL</Badge></div>
          <h1 className="text-4xl md:text-5xl font-heading text-foreground mb-4">Terms of Service</h1>
          <p className="text-foreground/60 font-mono text-sm">Last Updated: March 10, 2026</p>
        </div>

        <div className="prose prose-slate max-w-none text-foreground/80 space-y-8">
          <section>
            <h2 className="text-2xl font-heading text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing and using Fast PDF ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. Fast PDF provides an API-based PDF generation service allowing developers to convert HTML/CSS templates into PDF documents.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-foreground mb-4">2. Account Registration</h2>
            <p className="leading-relaxed mb-4">
              You must register for an account to access certain features of the Service. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>You must provide accurate and complete information during registration.</li>
              <li>You must notify us immediately of any unauthorized use of your account.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-foreground mb-4">3. API Usage and Limits</h2>
            <p className="leading-relaxed">
              Use of the Fast PDF API is subject to rate limiting and quotas depending on your active subscription tier. You agree not to attempt to circumvent these limits or use the API in a manner that degrades the performance of the Service for other users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-foreground mb-4">4. Content and intellectual Property</h2>
            <p className="leading-relaxed">
              You retain all rights to the HTML/CSS templates and JSON data you process through our Service. Fast PDF claims no ownership over your generated documents. However, you agree not to use the Service to generate illegal, abusive, or malicious content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-foreground mb-4">5. Disclaimer of Warranties</h2>
            <p className="leading-relaxed">
              The Service is provided "as is" and "as available" without any warranties of any kind, whether express or implied. We do not guarantee that the Service will be uninterrupted, error-free, or completely secure.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
