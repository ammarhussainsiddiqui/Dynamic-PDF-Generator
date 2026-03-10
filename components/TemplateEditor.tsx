'use client';
import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import Handlebars from 'handlebars';
import { ArrowLeft, Code2, FileCode2, Braces, Terminal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ApiIntegrationModal from './ApiIntegrationModal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { motion, useScroll, useTransform } from 'framer-motion';
import { toast } from 'sonner';

export default function TemplateEditor({ initialTemplate }: { initialTemplate: any }) {
  const [html, setHtml] = useState(initialTemplate.htmlContent || '');
  const [css, setCss] = useState(initialTemplate.cssContent || '');
  const [jsonStr, setJsonStr] = useState(initialTemplate.sampleJson || '');
  const [previewHtml, setPreviewHtml] = useState('');
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'json'>('html');
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  
  const { scrollY } = useScroll();
  const editorY = useTransform(scrollY, [0, 500], [0, 50]);

  useEffect(() => {
    try {
      const data = JSON.parse(jsonStr);
      const template = Handlebars.compile(html);
      const result = template(data);
      // Construct srcDoc for iframe
      const injected = `
        <html>
          <head>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>${css}</style>
          </head>
          <body>${result}</body>
        </html>
      `;
      setPreviewHtml(injected);
    } catch (e) {
      // Ignore errors while typing
    }
  }, [html, css, jsonStr]);

  const saveTemplate = async () => {
    setSaving(true);
    try {
      await fetch(`/api/templates/${initialTemplate._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          htmlContent: html,
          cssContent: css,
          sampleJson: jsonStr,
        }),
      });
      toast.success('Template saved successfully!');
    } catch (e) {
      toast.error('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const generatePdf = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: initialTemplate._id,
          data: JSON.parse(jsonStr),
        }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        toast.success("PDF generated successfully");
      } else {
        toast.error('Failed to generate PDF');
      }
    } catch (e) {
      toast.error('Error generating PDF');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Navbar Toolbar */}
      <nav className="h-20 border-b border-muted flex items-center justify-between px-6 bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors mr-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Badge>Editor</Badge>
          <h2 className="font-heading text-xl truncate max-w-[200px] md:max-w-md">{initialTemplate.name}</h2>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" onClick={() => setShowApiModal(true)}>
            <Terminal className="w-4 h-4 mr-2" />
            API Code
          </Button>
          <Button variant="secondary" size="sm" onClick={saveTemplate} isLoading={saving}>
            Save Draft
          </Button>
          <Button variant="primary" size="sm" onClick={generatePdf} isLoading={generating} withArrow>
            Generate Test PDF
          </Button>
        </div>
      </nav>

      {/* Split Layout */}
      <div className="flex flex-col lg:flex-row flex-1 p-6 gap-6 relative z-10">
        
        {/* Left: Monaco Editor Panel */}
        <motion.div style={{ y: editorY }} className="w-full lg:w-1/2 flex flex-col gap-4 h-[calc(100vh-8rem)]">
          <div className="flex gap-2 border-b border-muted pb-2">
            <button 
              className={`px-4 py-2 font-mono text-sm transition-colors ${activeTab === 'html' ? 'border-b-2 border-accent text-accent font-semibold' : 'text-foreground/50 hover:text-foreground'}`}
              onClick={() => setActiveTab('html')}
            >
               <Code2 className="w-4 h-4 inline mr-2" /> HTML
            </button>
            <button 
              className={`px-4 py-2 font-mono text-sm transition-colors ${activeTab === 'css' ? 'border-b-2 border-accent text-accent font-semibold' : 'text-foreground/50 hover:text-foreground'}`}
              onClick={() => setActiveTab('css')}
            >
               <FileCode2 className="w-4 h-4 inline mr-2" /> CSS
            </button>
            <button 
              className={`px-4 py-2 font-mono text-sm transition-colors ${activeTab === 'json' ? 'border-b-2 border-accent text-accent font-semibold' : 'text-foreground/50 hover:text-foreground'}`}
              onClick={() => setActiveTab('json')}
            >
               <Braces className="w-4 h-4 inline mr-2" /> JSON Data
            </button>
          </div>
          
          <div className="flex-1 rounded-xl overflow-hidden border border-muted shadow-inner bg-[#1e1e1e]">
            {activeTab === 'html' && (
              <Editor
                height="100%"
                language="html"
                theme="vs-dark"
                value={html}
                onChange={(v) => setHtml(v || '')}
                options={{ minimap: { enabled: false }, fontLigatures: true, fontFamily: 'var(--font-jetbrains-mono)' }}
              />
            )}
            {activeTab === 'css' && (
              <Editor
                height="100%"
                language="css"
                theme="vs-dark"
                value={css}
                onChange={(v) => setCss(v || '')}
                options={{ minimap: { enabled: false }, fontLigatures: true, fontFamily: 'var(--font-jetbrains-mono)' }}
              />
            )}
            {activeTab === 'json' && (
               <Editor
               height="100%"
               language="json"
               theme="vs-dark"
               value={jsonStr}
               defaultLanguage="json"
               onChange={(v) => setJsonStr(v || '')}
               options={{ minimap: { enabled: false }, fontLigatures: true, fontFamily: 'var(--font-jetbrains-mono)' }}
             />
            )}
          </div>
        </motion.div>

        {/* Right: Live Preview Panel */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4 h-[calc(100vh-8rem)]">
          <div className="flex justify-between items-center pb-2">
             <Badge active>Live Preview</Badge>
          </div>
          {/* Subtle radial glow corner accents applied behind the preview */}
          <div className="relative flex-1 rounded-xl bg-muted/30 border border-muted shadow-lg overflow-y-auto overflow-x-hidden flex flex-col items-center pattern-dots p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-5 blur-[80px] rounded-full pointer-events-none" />
            
            {/* 
              Aspect ratio and max-width ensure an A4-like appearance up to a certain size, 
              but allowing flex-shrink/grow prevents it from disappearing on smaller screens. 
              The pointer-events-none was removed so text can be selected.
            */}
            <div className="w-full max-w-[800px] min-h-[842px] bg-white shadow-xl transition-all duration-300 relative z-10 shrink-0">
               <iframe 
                srcDoc={previewHtml} 
                className="absolute inset-0 w-full h-full border-none" 
                title="PDF Preview"
              />
            </div>
          </div>
        </div>

      </div>

      <ApiIntegrationModal 
        isOpen={showApiModal} 
        onClose={() => setShowApiModal(false)} 
        templateId={initialTemplate._id} 
        sampleJson={jsonStr} 
      />
    </div>
  );
}
