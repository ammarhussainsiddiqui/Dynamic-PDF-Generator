'use client';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Code2, Zap, Layers, ArrowRight } from 'lucide-react';
import { FileCode2, LayoutTemplate, Shield, Globe, Cpu } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: 'HTML to PDF',
    description: 'Write templates using standard HTML and CSS. We render it perfectly into high-fidelity PDFs.',
    icon: FileCode2,
  },
  {
    title: 'Lightning Fast',
    description: 'Our rendering engine leverages Puppeteer under the hood for millisecond generations.',
    icon: Zap,
  },
  {
    title: 'Live Preview',
    description: 'See your changes instantly as you type with our integrated split-pane editor experience.',
    icon: LayoutTemplate,
  },
  {
    title: 'Secure & Private',
    description: 'We do not store the data you send to our API. Your generated PDFs are transient by default.',
    icon: Shield,
  },
  {
    title: 'Global Edge Network',
    description: 'APIs distributed globally ensure low-latency generation no matter where your users are.',
    icon: Globe,
  },
  {
    title: 'Dynamic Data Injection',
    description: 'Pass dynamic JSON payloads to our API and we will seamlessly map them into your templates.',
    icon: Cpu,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 flex flex-col items-center justify-center overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-[10%] left-[15%] w-[600px] h-[600px] bg-accent opacity-10 blur-[140px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute bottom-[10%] right-[15%] w-[500px] h-[500px] bg-accent-light opacity-10 blur-[140px] rounded-full pointer-events-none animate-pulse" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl">
            <motion.div variants={fadeInUp} className="flex justify-center mb-8">
              <div className="px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Fast PDF v1.0 Live</span>
              </div>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-6xl md:text-[5.5rem] font-heading font-black text-foreground mb-8 tracking-tighter leading-[0.95] text-balance">
              Generate PDFs <br className="hidden md:block"/>
              with <span className="text-gradient">pure code.</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-foreground/50 mb-12 max-w-2xl mx-auto leading-relaxed text-balance">
              Design beautiful templates with HTML and CSS. Merge dynamic JSON payloads. Render high-fidelity documents in milliseconds.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button variant="primary" className="h-14 px-10 text-lg w-full sm:w-auto shadow-2xl shadow-accent/20" withArrow>
                  Start Building for Free
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="secondary" className="h-14 px-10 text-lg w-full sm:w-auto bg-card border-muted hover:bg-muted/50 transition-all">
                  Go to Dashboard
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Code Snippet Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl mx-auto px-6 mt-20 z-20 hidden md:block"
        >
          <div className="relative rounded-2xl border border-muted bg-[#0d1117] shadow-2xl overflow-hidden shadow-accent/10 group">
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent pointer-events-none" />
            
            <div className="h-11 border-b border-muted/50 flex items-center justify-between px-6 bg-[#161b22]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                <span className="font-mono text-[10px] text-foreground/30 ml-4 tracking-widest uppercase">template.html</span>
              </div>
              <div className="flex items-center gap-1.5 opacity-30 group-hover:opacity-100 transition-opacity">
                 <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                 <span className="text-[10px] font-mono">Live</span>
              </div>
            </div>
            <div className="p-8 font-mono text-sm leading-loose overflow-x-auto">
              <div className="flex gap-4">
                <div className="flex flex-col text-white/10 select-none pr-4 border-r border-white/5">
                  {[1,2,3,4,5].map(n => <span key={n}>{n}</span>)}
                </div>
                <div className="text-white/80">
                  <span className="text-[#79c0ff]">&lt;div</span> <span className="text-[#a5d6ff]">class</span>=<span className="text-[#a5d6ff]">"invoice-box"</span><span className="text-[#79c0ff]">&gt;</span><br/>
                  &nbsp;&nbsp;<span className="text-[#79c0ff]">&lt;h1&gt;</span>{`{{ invoice_number }}`}<span className="text-[#79c0ff]">&lt;/h1&gt;</span><br/>
                  &nbsp;&nbsp;<span className="text-[#79c0ff]">&lt;p&gt;</span>Total: <span className="text-[#7ee787]">{`{{ currency }}`}</span><span className="text-[#7ee787]">{`{{ amount }}`}</span><span className="text-[#79c0ff]">&lt;/p&gt;</span><br/>
                  <span className="text-[#79c0ff]">&lt;/div&gt;</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Workflow Section */}
      <section className="py-32 relative overflow-hidden bg-card/30 border-y border-muted">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
             <Badge active>WORKFLOW</Badge>
             <h2 className="text-4xl font-heading font-black tracking-tight">From Code to Cloud</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connector Line */}
            <div className="hidden lg:block absolute top-[60px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-muted to-transparent z-0" />
            
            {[
              { step: '01', title: 'Design', desc: 'Craft your template with standard web tech.', icon: FileCode2 },
              { step: '02', title: 'Connect', desc: 'Securely merge your JSON payloads.', icon: Layers },
              { step: '03', title: 'Generate', desc: 'Get production-ready PDFs in ms.', icon: Zap },
            ].map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-2xl bg-card border border-muted flex items-center justify-center text-accent shadow-2xl transition-all hover:scale-110 hover:border-accent group">
                   <s.icon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                   <span className="text-[10px] font-mono font-bold text-accent/40 block mb-2">{s.step}</span>
                   <h3 className="text-xl font-heading font-bold mb-3">{s.title}</h3>
                   <p className="text-foreground/50 text-sm leading-relaxed max-w-[200px]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-40 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto mb-24"
          >
            <motion.div variants={fadeInUp} className="flex justify-center mb-6">
              <Badge active>FEATURES</Badge>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-heading font-black text-foreground mb-6 leading-tight tracking-tight">
              Everything you need for <br/> <span className="text-gradient">high-fidelity PDFs.</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-foreground/50 leading-relaxed">
              Design templates with standard web technologies and merge dynamic JSON payloads in seconds.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="group relative bg-card/40 backdrop-blur-xl rounded-3xl border border-muted/50 p-10 hover:border-accent/40 transition-all duration-500 overflow-hidden"
              >
                {/* Subtle gradient hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="w-14 h-14 bg-muted/40 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent group-hover:text-white transition-all duration-500 text-accent relative z-10">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-foreground mb-4 relative z-10">{feature.title}</h3>
                <p className="text-foreground/50 text-base leading-relaxed relative z-10">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
