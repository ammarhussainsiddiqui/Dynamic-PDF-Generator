'use client';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const tiers = [
  {
    name: 'Hobby',
    price: '$0',
    description: 'Perfect for side projects and testing.',
    features: ['100 PDFs / month', 'Basic templates', 'Community support', 'Watermarked'],
    buttonText: 'Get Started',
    buttonVariant: 'secondary' as const,
    href: '/register',
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    description: 'For professionals and growing businesses.',
    features: ['10,000 PDFs / month', 'Custom domains', 'Premium support', 'No watermarks', 'Advanced API access'],
    buttonText: 'Start Free Trial',
    buttonVariant: 'primary' as const,
    href: '/register',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Dedicated infrastructure and high volume.',
    features: ['Unlimited PDFs', 'Dedicated servers', 'SLA 99.99%', 'Account Manager', 'Custom integrations'],
    buttonText: 'Contact Sales',
    buttonVariant: 'ghost' as const,
    href: 'mailto:sales@fastpdf.com',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background relative pt-20 pb-32">
      {/* Background ambient glows */}
      <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-accent opacity-5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-[10%] w-[500px] h-[500px] bg-accent-light opacity-5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <motion.div variants={fadeInUp} className="flex justify-center mb-6">
            <Badge active>PRICING</Badge>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-heading text-foreground mb-6 leading-tight">
            Simple, <span className="text-gradient">transparent</span> pricing.
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-lg text-foreground/60">
            Start for free, upgrade when you need more power. No hidden fees.
          </motion.p>
        </motion.div>

        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8 items-start"
        >
          {tiers.map((tier, index) => (
            <motion.div 
              key={tier.name}
              variants={fadeInUp}
              className={`bg-card rounded-3xl p-8 relative ${tier.featured ? 'border-2 border-accent shadow-2xl shadow-accent/10 md:-translate-y-4' : 'border border-muted shadow-xl'}`}
            >
              {tier.featured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-accent to-accent-light text-white font-mono text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-heading text-foreground mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-heading text-foreground">{tier.price}</span>
                  {tier.period && <span className="text-foreground/50 font-mono text-sm">{tier.period}</span>}
                </div>
                <p className="text-foreground/60 text-sm">{tier.description}</p>
              </div>

              <div className="mb-8 space-y-4 min-h-[220px]">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 ${tier.featured ? 'text-accent' : 'text-foreground/30'}`} />
                    <span className="text-sm text-foreground/80">{feature}</span>
                  </div>
                ))}
              </div>

              <Link href={tier.href} className="block w-full">
                <Button variant={tier.buttonVariant} className="w-full h-12">
                  {tier.buttonText}
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
