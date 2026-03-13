'use client';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { 
  Trash2, 
  ExternalLink, 
  Copy, 
  Check, 
  Code2, 
  Zap, 
  Layers, 
  Sparkles, 
  Plus,
  Play,
  Search,
  Filter,
  Clock,
  ArrowUpRight
} from "lucide-react";
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { toast } from 'sonner';

interface Template {
  _id: string;
  name: string;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [templates, setTemplates] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalGenerated: 0, apiCalls: 0, plan: 'Free' });
  const [loading, setLoading] = useState(true);

  // Modal State
  const [templateToDelete, setTemplateToDelete] = useState<{ id: string, name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchTemplates();
      fetchStats();
    }
  }, [status, router]);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/templates");
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      } else {
        toast.error("Could not load templates. Please refresh.");
      }
    } catch (error) {
      console.error("Error fetching templates", error);
      toast.error("Connection error. Please check your network.");
    } finally {
      setLoading(false);
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

  const confirmDelete = async () => {
    if (!templateToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/templates/${templateToDelete.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setTemplates((prev: any[]) => prev.filter((t: any) => t._id !== templateToDelete.id));
        toast.success('Template deleted successfully');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete template');
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error('Connection lost. Could not delete template.');
    } finally {
      setIsDeleting(false);
      setTemplateToDelete(null);
    }
  };

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === "loading" || (loading && templates.length === 0)) {
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 ml-64 p-12">
           <div className="space-y-12 animate-pulse">
              <div className="h-12 w-64 bg-muted rounded-xl" />
              <div className="grid grid-cols-4 gap-6">
                 {[1,2,3,4].map(i => <div key={i} className="h-32 bg-card border border-muted rounded-2xl" />)}
              </div>
              <div className="grid grid-cols-3 gap-8">
                 {[1,2,3].map(i => <div key={i} className="h-80 bg-card border border-muted rounded-3xl" />)}
              </div>
           </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-white">
      <Sidebar />

      <main className="flex-1 ml-64 p-12 overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* Workspace Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <h1 className="text-4xl font-heading font-black tracking-tighter">Your Workspace</h1>
              <p className="text-foreground/40 text-sm font-mono uppercase tracking-[0.2em]">Manage your PDF automation flow</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 bg-card border border-muted rounded-xl pl-11 pr-4 text-sm focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Logs', value: stats.totalGenerated, icon: Zap, color: 'text-yellow-500' },
              { label: 'Active Projects', value: templates.length, icon: Layers, color: 'text-accent' },
              { label: 'API Usage', value: stats.apiCalls, icon: Code2, color: 'text-emerald-500' },
              { label: 'Current Plan', value: stats.plan, icon: Sparkles, color: 'text-purple-500' },
            ].map((s, i) => (
              <div key={i} className="group p-6 rounded-2xl border border-muted bg-card hover:border-accent/30 transition-all shadow-sm hover:shadow-xl hover:shadow-accent/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg bg-muted/50 ${s.color}`}>
                    <s.icon className="w-4 h-4" />
                  </div>
                  <p className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest">
                    {s.label}
                  </p>
                </div>
                <p className="font-heading text-3xl font-bold tracking-tight">
                  {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
                </p>
              </div>
            ))}
          </motion.div>

          <div className="space-y-8 pt-8">
             <div className="flex items-center gap-4">
                <h2 className="text-xl font-heading font-black tracking-tight">Your Templates</h2>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-muted to-transparent" />
             </div>

             {filteredTemplates.length === 0 ? (
              <div className="text-center py-32 bg-card/50 rounded-3xl border border-muted border-dashed">
                 {searchQuery ? (
                   <p className="text-foreground/40 font-mono text-sm uppercase">No templates matching "{searchQuery}"</p>
                 ) : (
                   <>
                    <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Plus className="w-10 h-10 text-foreground/20" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-foreground mb-3">No templates found</h3>
                    <p className="text-foreground/40 font-sans mb-10 max-w-xs mx-auto">Start by creating your first document template in the library.</p>
                    <Button onClick={() => router.push('/templates/new')} variant="primary" withArrow>
                      Create First Template
                    </Button>
                   </>
                 )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTemplates.map((template: any) => (
                  <motion.div key={template._id} variants={fadeInUp}>
                    <div className="group bg-card border border-muted hover:border-accent/40 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-accent/5 flex flex-col h-full ring-offset-background active:scale-[0.99]">
                      <div className="aspect-[16/10] bg-muted/20 relative overflow-hidden p-6 flex items-center justify-center">
                         <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
                         <div className="w-3/4 h-full bg-white shadow-lg rounded-t-lg origin-bottom transform translate-y-4 group-hover:translate-y-2 transition-transform duration-500 flex flex-col p-4">
                            <div className="w-1/2 h-2 bg-gray-100 rounded mb-2" />
                            <div className="w-full h-1 bg-gray-50 rounded mb-1" />
                            <div className="w-full h-1 bg-gray-50 rounded mb-1" />
                            <div className="w-3/4 h-1 bg-gray-50 rounded mb-4" />
                            <div className="mt-auto flex justify-between">
                              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent text-[8px] font-bold">PDF</div>
                              <div className="w-16 h-4 bg-gray-100 rounded" />
                            </div>
                         </div>
                         <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                            <Button size="sm" variant="primary" onClick={() => router.push(`/templates/${template._id}/edit`)}>
                              Edit Template
                            </Button>
                         </div>
                      </div>

                      <div className="p-6 space-y-4 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-heading text-xl font-bold truncate group-hover:text-accent transition-colors" title={template.name}>
                              {template.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                               <span className="text-[10px] font-mono text-foreground/30 uppercase tracking-[0.15em] shrink-0">Production Ready</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setTemplateToDelete({ id: template._id, name: template.name })}
                            className="p-2 text-foreground/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="pt-4 border-t border-muted/50 grid grid-cols-2 gap-4 mt-auto">
                          <div>
                            <p className="text-[9px] uppercase font-bold text-foreground/30 tracking-wider mb-1">Last Sync</p>
                            <p className="text-xs text-foreground/60">{new Date(template.updatedAt || template.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-[9px] uppercase font-bold text-foreground/30 tracking-wider mb-1">Doc Type</p>
                            <p className="text-xs text-foreground/60">{template.sizeKey?.toUpperCase() || 'A4'} Format</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <ConfirmModal
        isOpen={!!templateToDelete}
        onClose={() => setTemplateToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Template?"
        description={`Are you absolutely sure you want to delete "${templateToDelete?.name}"? Any ongoing PDF generations via API will fail. This action cannot be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Delete permanently"}
        cancelText="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
