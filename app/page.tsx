'use client';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Code2, Zap, Layers, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 flex flex-col items-center justify-center">
        {/* Ambient Glows */}
        <div className="absolute top-[20%] left-[20%] w-[600px] h-[600px] bg-accent opacity-10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-accent-light opacity-10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl">
            <motion.div variants={fadeInUp} className="flex justify-center mb-8">
              <Badge active>FAST PDF v1.0 LIVE</Badge>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-heading text-foreground mb-8 text-balance leading-[1.1]">
              Generate PDFs <br className="hidden md:block"/>
              with <span className="text-gradient">pure code.</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-foreground/60 mb-12 max-w-2xl mx-auto leading-relaxed text-balance">
              Design beautiful templates with HTML and CSS. Merge dynamic JSON payloads. Render high-fidelity documents in milliseconds.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button variant="primary" className="h-14 px-8 text-lg w-full sm:w-auto" withArrow>
                  Start Building for Free
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="secondary" className="h-14 px-8 text-lg w-full sm:w-auto bg-background/50 backdrop-blur-md">
                  View Features
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Code Snippet Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl mx-auto px-6 mt-16 z-20 hidden md:block"
        >
          <div className="rounded-t-3xl border-t border-x border-muted bg-foreground shadow-2xl overflow-hidden shadow-accent/20">
            <div className="h-12 border-b border-muted/20 flex items-center px-6 gap-2 bg-[#1A1A1A]">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="font-mono text-xs text-background/40 ml-4">template.html</span>
            </div>
            <div className="p-8 font-mono text-sm text-background/80 bg-[#0F0F0F] leading-loose">
              <span className="text-accent-light">&lt;div</span> <span className="text-emerald-400">class</span>=<span className="text-yellow-300">"invoice-box"</span><span className="text-accent-light">&gt;</span><br/>
              &nbsp;&nbsp;<span className="text-accent-light">&lt;h1&gt;</span>{`{{ invoice_number }}`}<span className="text-accent-light">&lt;/h1&gt;</span><br/>
              &nbsp;&nbsp;<span className="text-accent-light">&lt;p&gt;</span>Total: {`{{ currency }}`}{`{{ amount }}`}<span className="text-accent-light">&lt;/p&gt;</span><br/>
              <span className="text-accent-light">&lt;/div&gt;</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Value Props Section */}
      <section className="bg-foreground py-24 pb-32 relative z-10 -mt-10">
        <div className="max-w-6xl mx-auto px-6 pt-20">
          <div className="grid md:grid-cols-3 gap-12 text-background">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-white mb-6">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-heading">Developer First</h3>
              <p className="opacity-60 leading-relaxed text-sm">No clunky drag-and-drop builders. Write standard HTML/CSS and let our API handle the rest.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-white mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-heading">Puppeteer Engine</h3>
              <p className="opacity-60 leading-relaxed text-sm">Backed by headless Chromium. If the browser can render it, we can turn it into a high-fidelity PDF.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-white mb-6">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-heading">Dynamic Data</h3>
              <p className="opacity-60 leading-relaxed text-sm">Send a simple JSON payload to our robust API and seamlessly merge variables into your templates.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
