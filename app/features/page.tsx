'use client';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { Badge } from '@/components/ui/Badge';
import { FileCode2, Zap, LayoutTemplate, Shield, Globe, Cpu } from 'lucide-react';

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

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background relative pt-20 pb-32 overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-accent opacity-5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-accent-light opacity-5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-24"
        >
          <motion.div variants={fadeInUp} className="flex justify-center mb-6">
            <Badge active>FEATURES</Badge>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-heading text-foreground mb-6 leading-tight">
            Everything you need to <span className="text-gradient">generate PDFs</span> at scale.
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-lg text-foreground/60 leading-relaxed">
            Replace complex PDF libraries with a simple API. Design templates with standard web technologies and merge dynamic JSON payloads in seconds.
          </motion.p>
        </motion.div>

        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title}
              variants={fadeInUp}
              className="bg-card rounded-2xl border border-muted p-8 shadow-sm hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors text-accent">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading text-foreground mb-3">{feature.title}</h3>
              <p className="text-foreground/60 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
