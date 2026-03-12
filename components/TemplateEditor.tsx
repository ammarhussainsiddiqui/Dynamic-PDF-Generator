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
          <div className="absolute left-0 top-full mt-2 z-50 w-72 bg-card border border-muted rounded-xl shadow-2xl overflow-hidden">
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
          <div className="absolute left-0 top-full mt-2 z-50 w-72 bg-card border border-muted rounded-xl shadow-2xl overflow-hidden p-4">
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
  // Size state
  const [sizeKey, setSizeKey] = useState(initialTemplate.sizeKey || "a4");

  const [customW, setCustomW] = useState(
    initialTemplate.pageSize?.width || PDF_SIZES[initialTemplate.sizeKey || "a4"].width
  );

  const [customH, setCustomH] = useState(
    initialTemplate.pageSize?.height || PDF_SIZES[initialTemplate.sizeKey || "a4"].height
  );

  const { scrollY } = useScroll();
  const editorY = useTransform(scrollY, [0, 500], [0, 50]);

  // Resolved dimensions
  const resolvedSize =
    sizeKey === 'custom'
      ? { width: customW, height: customH }
      : { width: PDF_SIZES[sizeKey].width, height: PDF_SIZES[sizeKey].height };

  const isLandscape = resolvedSize.width > resolvedSize.height;

  // Live preview compilation
  useEffect(() => {
    try {
      const data = JSON.parse(jsonStr);
      const template = Handlebars.compile(html);
      const result = template(data);
      
      const fontsLink = googleFonts.length > 0 
        ? `<link href="https://fonts.googleapis.com/css2?${googleFonts.map(f => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700`).join('&')}&display=swap" rel="stylesheet">` 
        : '';

      const injected = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
${fontsLink}
<script src="https://cdn.tailwindcss.com"><\/script>
<style>
  *, *::before, *::after { box-sizing: border-box; }

  html, body {
    margin: 0;
    padding: 0;
    font-family: '${googleFonts[0]}', sans-serif;
  }

  ${css}
</style>
</head>
<body>${result}</body>
</html>`;;
      setPreviewHtml(injected);
    } catch {
      // Ignore parse/compile errors while typing
    }
  }, [html, css, jsonStr, googleFonts]);

  const saveTemplate = async () => {
    setSaving(true);

    try {
      const pageSize =
        sizeKey === "custom"
          ? { width: customW, height: customH }
          : {
            width: PDF_SIZES[sizeKey].width,
            height: PDF_SIZES[sizeKey].height,
          };

      await fetch(`/api/templates/${initialTemplate._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: templateName,
          htmlContent: html,
          cssContent: css,
          sampleJson: jsonStr,
          pageSize,
          sizeKey,
          googleFonts
        }),
      });

      toast.success("Template saved!");


    } catch (error) {
      toast.error("Failed to save template");
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
          pageSize: { width: resolvedSize.width, height: resolvedSize.height },
        }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        toast.success('PDF generated!');
      } else {
        toast.error('Failed to generate PDF');
      }
    } catch {
      toast.error('Error generating PDF');
    } finally {
      setGenerating(false);
    }
  };

  const handleCustomChange = (w: number, h: number) => {
    setCustomW(w);
    setCustomH(h);
    // Update PDF_SIZES.custom dimensions reactively
    PDF_SIZES.custom.width = w;
    PDF_SIZES.custom.height = h;
  };

  const tabs: { key: 'html' | 'css' | 'json'; label: string; icon: React.ReactNode }[] = [
    { key: 'html', label: 'HTML', icon: <Code2 className="w-3.5 h-3.5" /> },
    { key: 'css', label: 'CSS', icon: <FileCode2 className="w-3.5 h-3.5" /> },
    { key: 'json', label: 'JSON', icon: <Braces className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">

      {/* ── Navbar ── */}
      <nav className="h-16 border-b border-muted flex items-center justify-between px-6 bg-card/60 backdrop-blur-md sticky top-0 z-50 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Badge>Editor</Badge>
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="font-heading text-base bg-transparent border-none focus:ring-0 text-foreground/80 w-auto min-w-[100px] outline-none hover:bg-muted/30 rounded px-1 transition-colors"
            placeholder="Template Name"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" onClick={() => setShowApiModal(true)}>
            <Terminal className="w-4 h-4 mr-1.5" />
            API
          </Button>
          <Button variant="secondary" size="sm" onClick={saveTemplate} isLoading={saving}>
            Save
          </Button>
          <Button variant="primary" size="sm" onClick={generatePdf} isLoading={generating} withArrow>
            Generate PDF
          </Button>
        </div>
      </nav>

      {/* ── Split Layout ── */}
      <div className="flex flex-col lg:flex-row flex-1 p-4 gap-4 relative z-10">

        {/* Left: Code Editor */}
        <motion.div
          className="w-full lg:w-1/2 flex flex-col gap-3"
          style={{ y: editorY, height: 'calc(100vh - 5rem)' }}
        >
          {/* Tab bar */}
          <div className="flex gap-1 bg-muted/30 p-1 rounded-lg border border-muted">
            {tabs.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-medium transition-all flex-1 justify-center ${activeTab === key
                    ? 'bg-card shadow text-accent border border-muted'
                    : 'text-foreground/50 hover:text-foreground'
                  }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          {/* Monaco */}
          <div className="flex-1 rounded-xl overflow-hidden border border-muted shadow-inner bg-[#0d1117]">
            {activeTab === 'html' && (
              <Editor
                height="100%"
                language="html"
                theme="vs-dark"
                value={html}
                onChange={(v) => setHtml(v || '')}
                options={{
                  minimap: { enabled: false },
                  fontLigatures: true,
                  fontFamily: 'var(--font-jetbrains-mono, "JetBrains Mono", monospace)',
                  fontSize: 13,
                  lineHeight: 22,
                  padding: { top: 12 },
                  scrollBeyondLastLine: false,
                }}
              />
            )}
            {activeTab === 'css' && (
              <Editor
                height="100%"
                language="css"
                theme="vs-dark"
                value={css}
                onChange={(v) => setCss(v || '')}
                options={{
                  minimap: { enabled: false },
                  fontLigatures: true,
                  fontFamily: 'var(--font-jetbrains-mono, "JetBrains Mono", monospace)',
                  fontSize: 13,
                  lineHeight: 22,
                  padding: { top: 12 },
                  scrollBeyondLastLine: false,
                }}
              />
            )}
            {activeTab === 'json' && (
              <Editor
                height="100%"
                language="json"
                theme="vs-dark"
                value={jsonStr}
                onChange={(v) => setJsonStr(v || '')}
                options={{
                  minimap: { enabled: false },
                  fontLigatures: true,
                  fontFamily: 'var(--font-jetbrains-mono, "JetBrains Mono", monospace)',
                  fontSize: 13,
                  lineHeight: 22,
                  padding: { top: 12 },
                  scrollBeyondLastLine: false,
                }}
              />
            )}
          </div>
        </motion.div>

        {/* Right: Preview */}
        <div
          className="w-full lg:w-1/2 flex flex-col gap-3"
          style={{ height: 'calc(100vh - 5rem)' }}
        >
          {/* Preview toolbar */}
          <div className="flex items-center justify-between gap-3">
            <Badge active>Live Preview</Badge>
            <div className="flex items-center gap-3">
              {/* Dimensions readout */}
              <span className="text-xs font-mono text-foreground/40">
                {resolvedSize.width} × {resolvedSize.height}px
              </span>
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

          {/* Preview canvas */}
          <div className="flex-1 rounded-xl bg-muted/20 border border-muted overflow-auto relative">
            {/* Subtle dot pattern */}
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                color: 'var(--color-muted-foreground, #888)',
              }}
            />

            {/* Centered scroll area */}
            <div className="min-h-full flex items-start justify-center relative z-10">
              {/* 
                The page wrapper: exact pixel size, no forced bg/padding.
                Shadow gives the "paper" feel without coloring the document itself.
              */}
              <div
                className="relative shrink-0 shadow-[0_4px_40px_rgba(0,0,0,0.25)]"
                style={{
                  width: resolvedSize.width,
                  height: resolvedSize.height,
                  // Scale down if wider than available (only scales, never upscales)
                  maxWidth: '100%',
                  transformOrigin: 'top center',
                }}
              >
                <iframe
                  key={`${sizeKey}-${resolvedSize.width}-${resolvedSize.height}`}
                  srcDoc={previewHtml}
                  title="PDF Preview"
                  style={{
                    width: resolvedSize.width,
                    height: resolvedSize.height,
                    border: 'none',
                    display: 'block',
                    // Scale iframe to fit container width without cutting off
                    transformOrigin: 'top left',
                  }}
                  className="absolute inset-0"
                />
              </div>
            </div>
          </div>

          {/* Orientation hint for wide formats */}
          {isLandscape && (
            <p className="text-xs text-foreground/40 text-center font-mono">
              Landscape format — {resolvedSize.width} × {resolvedSize.height}px
            </p>
          )}
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
