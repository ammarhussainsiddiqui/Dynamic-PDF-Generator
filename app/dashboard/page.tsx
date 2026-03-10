'use client';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Template {
  _id: string;
  name: string;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [templates, setTemplates] = useState<Template[]>([]);
  const [stats, setStats] = useState({ plan: 'Free', apiCalls: 0, totalGenerated: 0 });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      Promise.all([fetchTemplates(), fetchStats()]).finally(() => setLoading(false));
    }
  }, [status, router]);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/templates");
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error("Error fetching templates", error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats", error);
    }
  };

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center p-8 text-center text-foreground/50 font-mono">Loading Workspace...</div>;
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="py-28 max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-12"
        >
          <motion.div
            variants={fadeInUp}
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
          >
            <div className="space-y-4">
              <Badge active>Workspace</Badge>
              <h1 className="font-heading text-5xl tracking-tight text-foreground">
                Your <span className="text-gradient">Templates</span>
              </h1>
            </div>
            <Button
              withArrow
              variant="primary"
              size="lg"
              onClick={() => router.push('/templates/new')}
            >
              Create Template
            </Button>
          </motion.div>

          <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {['Total Generated', 'Active Templates', 'API Calls', 'Plan Quota'].map(
              (stat, i) => (
                <div key={i} className="p-6 rounded-xl border border-muted bg-card">
                  <p className="font-mono text-xs text-foreground/50 mb-2 uppercase">
                    {stat}
                  </p>
                  <p className="font-heading text-3xl font-semibold">
                    {i === 0 
                      ? stats.totalGenerated.toLocaleString() 
                      : i === 1 
                        ? templates.length.toString() 
                        : i === 2 
                          ? stats.apiCalls.toLocaleString() 
                          : stats.plan}
                  </p>
                </div>
              )
            )}
          </motion.div>

          {templates.length === 0 ? (
            <motion.div variants={fadeInUp} className="text-center py-20 bg-card rounded-xl border border-muted shadow-sm mt-8">
               <h3 className="font-heading text-2xl text-foreground mb-4">No templates yet</h3>
               <p className="text-foreground/70 font-sans mb-8">Create your first HTML-to-PDF template to get started.</p>
               <Button onClick={() => router.push('/templates/new')} variant="secondary">
                 Create Project
               </Button>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8"
            >
              {templates.map((template, index) => (
                <motion.div key={template._id} variants={fadeInUp} className={index === 0 ? "md:col-span-2" : ""}>
                  <Card featured={index === 0} className="h-full flex flex-col justify-between">
                    <div>
                      <p className="font-mono text-xs text-accent mb-4 truncate">ID: {template._id}</p>
                      <h3 className="font-heading text-2xl mb-2 truncate" title={template.name}>{template.name}</h3>
                      <p className="text-foreground/70 font-sans text-sm">
                        Created: {new Date(template.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-8">
                      <Button variant="secondary" size="sm" onClick={() => router.push(`/templates/${template._id}/edit`)}>
                        Edit Template
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

        </motion.div>
      </div>

      <section className="inverted-section py-32 mt-12 relative overflow-hidden pattern-dots-inverted">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-accent/20 rounded-full animate-slow-spin z-0" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-8">
          <div className="inline-block"><Badge>API Integration</Badge></div>
          <h2 className="font-heading text-5xl md:text-7xl">
            Ready to <span className="text-gradient">Generate?</span>
          </h2>
          <p className="font-mono text-background/70 p-6 bg-black/50 rounded-xl border border-white/10 text-left max-w-xl mx-auto overflow-x-auto">
            <code className="block text-accent">POST /api/generate</code>
            <code className="block mt-2">{'{'}</code>
            <code className="block ml-4">"template_id": "{templates[0]?._id || "tpl_9f8x2m"}",</code>
            <code className="block ml-4">
              "data": {'{'} "name": "John Doe" {'}'}
            </code>
            <code className="block">{'}'}</code>
          </p>
        </div>
      </section>
    </div>
  );
}
