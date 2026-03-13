'use client';
import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import Handlebars from 'handlebars';
import { ArrowLeft, Code2, FileCode2, Braces, Terminal, ChevronDown, Type } from 'lucide-react';
import Link from 'next/link';
import ApiIntegrationModal from './ApiIntegrationModal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { motion, useScroll, useTransform } from 'framer-motion';
import { toast } from 'sonner';

// ─── PDF Size Definitions ────────────────────────────────────────────────────

type PdfSize = {
  label: string;
  width: number;   // px at 96dpi
  height: number;
  description?: string;
};

const PDF_SIZES: Record<string, PdfSize> = {
  a4: { label: 'A4', width: 794, height: 1123, description: '210 × 297 mm' },
  a3: { label: 'A3', width: 1123, height: 1587, description: '297 × 420 mm' },
  a5: { label: 'A5', width: 559, height: 794, description: '148 × 210 mm' },
  letter: { label: 'US Letter', width: 816, height: 1056, description: '8.5 × 11 in' },
  legal: { label: 'US Legal', width: 816, height: 1344, description: '8.5 × 14 in' },
  receipt_58: { label: 'Receipt 58mm', width: 220, height: 600, description: '58 mm wide' },
  receipt_80: { label: 'Receipt 80mm', width: 302, height: 800, description: '80 mm wide' },
  business: { label: 'Business Card', width: 340, height: 204, description: '3.5 × 2 in' },
  label: { label: 'Label (4×6)', width: 384, height: 576, description: '4 × 6 in' },
  custom: { label: 'Custom', width: 800, height: 1000, description: 'Set your own size' },
};

const SIZE_GROUPS = [
  { groupLabel: 'Standard', keys: ['a4', 'a3', 'a5', 'letter', 'legal'] },
  { groupLabel: 'Receipts', keys: ['receipt_58', 'receipt_80'] },
  { groupLabel: 'Small Formats', keys: ['business', 'label'] },
  { groupLabel: 'Other', keys: ['custom'] },
];

// ─── Size Selector Dropdown ──────────────────────────────────────────────────

function SizeSelector({
  sizeKey,
  onChange,
  customW,
  customH,
  onCustomChange,
}: {
  sizeKey: string;
  onChange: (key: string) => void;
  customW: number;
  customH: number;
  onCustomChange: (w: number, h: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = PDF_SIZES[sizeKey];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-muted bg-card text-sm font-mono hover:bg-muted/50 transition-colors"
      >
        <span className="text-foreground/70 text-xs uppercase tracking-widest">Size</span>
        <span className="font-semibold">{current.label}</span>
        <span className="text-foreground/40 text-xs hidden sm:inline">{current.description}</span>
        <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-2 z-50 w-72 bg-card border border-muted rounded-xl shadow-2xl overflow-y-auto max-h-[400px]">
            {SIZE_GROUPS.map((group) => (
              <div key={group.groupLabel}>
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-foreground/40 font-semibold bg-muted/30 border-b border-muted">
                  {group.groupLabel}
                </div>
                {group.keys.map((key) => {
                  const s = PDF_SIZES[key];
                  const active = key === sizeKey;
                  return (
                    <button
                      key={key}
                      onClick={() => { onChange(key); setOpen(false); }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-muted/40 ${active ? 'bg-accent/10 text-accent' : 'text-foreground'}`}
                    >
                      <span className="font-medium">{s.label}</span>
                      <span className="text-xs text-foreground/40">{s.description}</span>
                    </button>
                  );
                })}
              </div>
            ))}

            {sizeKey === 'custom' && (
              <div className="px-4 py-3 border-t border-muted flex gap-3 bg-muted/20">
                <label className="flex flex-col gap-1 flex-1">
                  <span className="text-[10px] uppercase tracking-widest text-foreground/40">Width px</span>
                  <input
                    type="number"
                    value={customW}
                    min={100}
                    max={3000}
                    onChange={(e) => onCustomChange(Number(e.target.value), customH)}
                    className="w-full px-2 py-1 rounded border border-muted bg-background text-sm font-mono"
                  />
                </label>
                <label className="flex flex-col gap-1 flex-1">
                  <span className="text-[10px] uppercase tracking-widest text-foreground/40">Height px</span>
                  <input
                    type="number"
                    value={customH}
                    min={100}
                    max={5000}
                    onChange={(e) => onCustomChange(customW, Number(e.target.value))}
                    className="w-full px-2 py-1 rounded border border-muted bg-background text-sm font-mono"
                  />
                </label>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Font Selector Dropdown ──────────────────────────────────────────────────

function FontsSelector({
  googleFonts,
  onFontsChange,
}: {
  googleFonts: string[];
  onFontsChange: (fonts: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(googleFonts.join(', '));

  const handleBlur = () => {
    const fonts = inputValue.split(',').map(f => f.trim()).filter(f => f !== '');
    onFontsChange(fonts);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-muted bg-card text-sm font-mono hover:bg-muted/50 transition-colors"
      >
        <Type className="w-3.5 h-3.5 text-foreground/40" />
        <span className="text-foreground/70 text-xs uppercase tracking-widest">Fonts</span>
        <span className="font-semibold">{googleFonts.length} Loaded</span>
        <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-2 z-50 w-72 bg-card border border-muted rounded-xl shadow-2xl overflow-y-auto max-h-[400px] p-4">
            <label className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Google Fonts</span>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={handleBlur}
                rows={3}
                placeholder="Poppins, Inter, Montserrat"
                className="w-full px-3 py-2 rounded-lg border border-muted bg-background text-sm font-mono focus:ring-1 focus:ring-accent outline-none"
              />
              <p className="text-[10px] text-foreground/40 leading-relaxed">
                Enter names from Google Fonts. Example: <span className="text-accent italic">Poppins, Playfair Display</span>. Separated by commas.
              </p>
            </label>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Editor ─────────────────────────────────────────────────────────────

export default function TemplateEditor({ initialTemplate }: { initialTemplate: any }) {
  const [html, setHtml] = useState(initialTemplate.htmlContent || '');
  const [css, setCss] = useState(initialTemplate.cssContent || '');
  const [jsonStr, setJsonStr] = useState(initialTemplate.sampleJson || '');
  const [templateName, setTemplateName] = useState(initialTemplate.name || '');
  const [googleFonts, setGoogleFonts] = useState<string[]>(initialTemplate.googleFonts || ['Poppins', 'Inter', 'JetBrains Mono']);
  const [previewHtml, setPreviewHtml] = useState('');
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'json'>('html');
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);

  // Size state
  const [sizeKey, setSizeKey] = useState(initialTemplate.sizeKey || "a4");
  const [customW, setCustomW] = useState(
    initialTemplate.pageSize?.width || PDF_SIZES[initialTemplate.sizeKey || "a4"].width
  );
  const [customH, setCustomH] = useState(
    initialTemplate.pageSize?.height || PDF_SIZES[initialTemplate.sizeKey || "a4"].height
  );

  // Resolved dimensions
  const resolvedSize =
    sizeKey === 'custom'
      ? { width: customW, height: customH }
      : { width: PDF_SIZES[sizeKey].width, height: PDF_SIZES[sizeKey].height };

  // Scaling logic to fit the template in the container
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!containerRef) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const targetW = resolvedSize.width;
        const targetH = resolvedSize.height;

        // Reduce padding for a tighter fit
        const padding = 40;
        const scaleW = (width - padding) / targetW;
        const scaleH = (height - padding) / targetH;

        // Never upscale, only downscale to fit
        const newScale = Math.min(1, scaleW, scaleH);
        setScale(newScale);
      }
    });
    observer.observe(containerRef);
    return () => observer.disconnect();
  }, [containerRef, resolvedSize]);

  // Live preview compilation
  useEffect(() => {
    try {
      const data = JSON.parse(jsonStr || '{}');
      const template = Handlebars.compile(html);
      const result = template(data);

      const fontsLink = googleFonts.map(f => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700`).join('&');

      const injected = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<link href="https://fonts.googleapis.com/css2?${fontsLink}&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"><\/script>
<style>
  *, *::before, *::after { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    background: white;
    min-height: 100%;
    font-family: '${googleFonts[0]}', sans-serif;
  }
  ${css}
</style>
</head>
<body>${result}</body>
</html>`;
      setPreviewHtml(injected);
    } catch (e) {
      // Stay on previous valid state
    }
  }, [html, css, jsonStr, googleFonts]);

  const saveTemplate = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/templates/${initialTemplate._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: templateName,
          htmlContent: html,
          cssContent: css,
          sampleJson: jsonStr,
          pageSize: resolvedSize,
          sizeKey,
          googleFonts
        }),
      });

      if (res.ok) {
        toast.success("Template synchronization successful");
      } else {
        const data = await res.json();
        toast.error(data.error || "Sync failed");
      }
    } catch {
      toast.error("Network synchronization lost");
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
          data: JSON.parse(jsonStr || '{}'),
          pageSize: resolvedSize,
        }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        toast.success('PDF Engine: Generation Success');
      } else {
        toast.error('PDF Engine: Generation Failed');
      }
    } catch {
      toast.error('Network Error: PDF Engine Unreachable');
    } finally {
      setGenerating(false);
    }
  };

  const tabs: { key: 'html' | 'css' | 'json'; label: string; icon: any }[] = [
    { key: 'html', label: 'HTML', icon: Code2 },
    { key: 'css', label: 'CSS', icon: FileCode2 },
    { key: 'json', label: 'JSON', icon: Braces },
  ];

  return (
    <div className="h-screen bg-background flex flex-col relative overflow-hidden selection:bg-accent/30 selection:text-white">

      {/* ── Visual Noise ── */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* ── Navbar ── */}
      <nav className="h-20 border-b border-muted/50 flex items-center justify-between px-8 bg-card/40 backdrop-blur-2xl sticky top-0 z-50 gap-4">
        <div className="flex items-center gap-6 min-w-0">
          <Link href="/dashboard" className="text-foreground/30 hover:text-accent transition-all p-2 hover:bg-accent/5 rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Badge active className="font-mono text-[10px] uppercase tracking-widest bg-emerald-500/5 text-emerald-500 border-emerald-500/20 px-2 py-0.5 rounded-full border">Active Session</Badge>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="font-heading font-black text-xl bg-transparent border-none focus:ring-0 text-foreground w-auto min-w-[200px] outline-none"
                placeholder="Untitled Project"
              />
            </div>
            <p className="text-[10px] font-mono text-foreground/30 uppercase tracking-[0.2em] mt-1 pl-1">Document Architect Mode</p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <Button variant="ghost" size="sm" onClick={() => setShowApiModal(true)} className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 hover:text-foreground">
            <Terminal className="w-4 h-4 mr-2" />
            Integrate
          </Button>
          <div className="h-8 w-[1px] bg-muted/50 mx-2" />
          <Button variant="secondary" size="sm" onClick={saveTemplate} isLoading={saving} className="font-mono text-[10px] tracking-widest uppercase px-6">
            Sync Changes
          </Button>
          <Button variant="primary" size="sm" onClick={generatePdf} isLoading={generating} withArrow className="font-mono text-[10px] tracking-widest uppercase px-6">
            Build PDF
          </Button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Code Editor */}
        <div className="w-[45%] flex flex-col border-r border-muted/50 bg-card/20 overflow-hidden">
          <div className="p-4 space-y-4 flex-1 flex flex-col">
            <div className="flex gap-2 p-1 bg-muted/20 rounded-2xl border border-muted/50">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 flex-1 justify-center py-2.5 rounded-xl transition-all font-mono text-[10px] font-bold uppercase tracking-widest ${activeTab === tab.key
                      ? 'bg-card text-accent shadow-xl shadow-accent/5 border border-accent/20'
                      : 'text-foreground/30 hover:text-foreground hover:bg-white/5'
                    }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 rounded-2xl overflow-hidden border border-muted/50 bg-[#0d1117] relative group shadow-2xl">
              <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <Badge active className="bg-white/5 backdrop-blur-md border border-white/10 text-white/40 text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full">
                  {activeTab === 'html' ? 'Handlebars' : activeTab === 'css' ? 'Tailwind Ready' : 'Payload'}
                </Badge>
              </div>
              <Editor
                height="100%"
                language={activeTab}
                theme="vs-dark"
                value={activeTab === 'html' ? html : activeTab === 'css' ? css : jsonStr}
                onChange={(v) => activeTab === 'html' ? setHtml(v || '') : activeTab === 'css' ? setCss(v || '') : setJsonStr(v || '')}
                options={{
                  minimap: { enabled: false },
                  fontLigatures: true,
                  fontFamily: 'var(--font-jetbrains-mono)',
                  fontSize: 13,
                  lineHeight: 22,
                  padding: { top: 20, bottom: 20 },
                  scrollBeyondLastLine: false,
                  cursorSmoothCaretAnimation: 'on',
                  smoothScrolling: true,
                  contextmenu: false,
                  folding: true,
                  bracketPairColorization: { enabled: true }
                }}
              />
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="flex-1 flex flex-col bg-muted/5 relative">
          {/* Preview Toolbar - High Z-index for dropdowns */}
          <div className="h-14 border-b border-muted/50 px-6 flex items-center justify-between bg-card/20 backdrop-blur-xl relative z-30">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-foreground/40 uppercase tracking-[0.2em]">Real-time Fiber Preview</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-foreground/30 uppercase tracking-widest hidden sm:block">
                Canvas: {resolvedSize.width}x{resolvedSize.height}
              </span>
              <div className="h-4 w-[1px] bg-muted/50 mx-2" />
              <SizeSelector
                sizeKey={sizeKey}
                onChange={setSizeKey}
                customW={customW}
                customH={customH}
                onCustomChange={(w, h) => { setCustomW(w); setCustomH(h); }}
              />
              <FontsSelector
                googleFonts={googleFonts}
                onFontsChange={setGoogleFonts}
              />
            </div>
          </div>

          {/* Adobe-style Canvas Container */}
          <div
            ref={setContainerRef}
            className="flex-1 overflow-auto bg-[#1a1a1a] relative group/canvas"
            style={{
              backgroundImage: `
                radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)
              `,
              backgroundSize: '24px 24px'
            }}
          >
            <div
              className="min-h-full flex items-center justify-center p-8"
              style={{ minWidth: 'fit-content' }}
            >
              <div
                className="bg-white shadow-[0_32px_128px_-32px_rgba(0,0,0,0.8)] transition-all duration-300 relative"
                style={{
                  width: resolvedSize.width,
                  height: resolvedSize.height,
                  transform: `scale(${scale})`,
                  transformOrigin: 'center center'
                }}
              >
                <iframe
                  srcDoc={previewHtml}
                  className="w-full h-full border-none pointer-events-none"
                  title="Render Engine"
                />

                {/* Overlay for scaling hint */}
                {scale < 1 && (
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/canvas:opacity-100 transition-opacity">
                    <Badge active className="bg-white/50 backdrop-blur-md border border-white/10 text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full">
                      View Scaled at {Math.round(scale * 100)}%
                    </Badge>
                  </div>
                )}
              </div>
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
