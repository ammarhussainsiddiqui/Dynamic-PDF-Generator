"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Plus, 
  FilePlus2, 
  Receipt, 
  User, 
  Ticket, 
  FileText,
  ChevronRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { PREBUILT_TEMPLATES, PrebuiltTemplate } from "@/lib/prebuilt-templates";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const iconMap: Record<string, any> = {
  FilePlus2,
  Receipt,
  User,
  Ticket,
  FileText
};

export default function NewTemplate() {
  const [selectedTemplate, setSelectedTemplate] = useState<PrebuiltTemplate | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Selection, 2: Naming
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !selectedTemplate) return;
    setLoading(true);

    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name,
          htmlContent: selectedTemplate.htmlContent,
          cssContent: selectedTemplate.cssContent,
          sampleJson: selectedTemplate.sampleJson,
          pageSize: selectedTemplate.pageSize,
          sizeKey: selectedTemplate.sizeKey,
          googleFonts: selectedTemplate.googleFonts
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Template created successfully!");
        router.push(`/templates/${data._id}/edit`);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create template");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error occurred while creating template");
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template: PrebuiltTemplate) => {
    setSelectedTemplate(template);
    setName(template.id === 'blank' ? "" : `My ${template.name}`);
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col p-6 lg:p-12">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        
        {/* Header */}
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-muted/50 rounded-full transition-colors text-foreground/40 hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge>Library</Badge>
                <h1 className="text-2xl font-heading font-bold tracking-tight">Create Template</h1>
              </div>
              <p className="text-foreground/40 text-sm">Choose a starter or a blank canvas</p>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {PREBUILT_TEMPLATES.map((template, idx) => {
                const Icon = iconMap[template.icon] || FilePlus2;
                return (
                  <motion.button
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleTemplateSelect(template)}
                    className="group relative bg-card border border-muted hover:border-accent/40 rounded-2xl p-6 text-left transition-all hover:shadow-2xl hover:shadow-accent/5 flex flex-col items-start gap-4 overflow-hidden"
                  >
                    {/* Decorative hover bg */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="p-3 bg-muted/40 rounded-xl group-hover:bg-accent/10 transition-colors relative z-10">
                      <Icon className="w-6 h-6 text-foreground/60 group-hover:text-accent transition-colors" />
                    </div>

                    <div className="relative z-10 w-full">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h2 className="font-heading font-semibold group-hover:text-accent transition-colors">{template.name}</h2>
                        <ChevronRight className="w-4 h-4 text-foreground/0 group-hover:text-accent transition-all translate-x-[-10px] group-hover:translate-x-0" />
                      </div>
                      <p className="text-sm text-foreground/40 line-clamp-2">{template.description}</p>
                    </div>

                    <div className="mt-auto w-full flex items-center justify-between relative z-10 pt-4 border-t border-muted/50">
                      <span className="text-[10px] items-center gap-1.5 flex uppercase tracking-wider font-bold text-foreground/30 group-hover:text-foreground/50 transition-colors">
                        {template.category}
                      </span>
                      {template.id !== 'blank' && <Sparkles className="w-3 h-3 text-accent/40 animate-pulse" />}
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto w-full"
            >
              <div className="bg-card border border-muted rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                {/* Selected template highlight */}
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   {(() => {
                     const Icon = iconMap[selectedTemplate?.icon || 'FilePlus2'];
                     return <Icon className="w-32 h-32" />;
                   })()}
                </div>

                <div className="relative z-10">
                  <header className="mb-8">
                    <h2 className="text-xl font-heading font-bold mb-2">Almost there!</h2>
                    <p className="text-sm text-foreground/40">Give your <span className="text-accent font-semibold">{selectedTemplate?.name}</span> a name.</p>
                  </header>

                  <form onSubmit={handleCreate} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-foreground/40 px-1">Template Name</label>
                      <input
                        type="text"
                        className="w-full bg-muted/30 border border-muted focus:border-accent hover:border-muted-foreground/30 rounded-xl px-4 py-3 text-base outline-none transition-all placeholder:text-foreground/20"
                        placeholder="e.g. March Payroll Receipt"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        isLoading={loading}
                        withArrow
                        className="w-full"
                      >
                        Create Template
                      </Button>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-sm text-foreground/40 hover:text-foreground transition-colors py-2"
                      >
                        Back to library
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
