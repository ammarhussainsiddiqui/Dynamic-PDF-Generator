import { useState, useEffect } from 'react';
import { X, Copy, Check, Terminal, Code2, Braces } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ApiIntegrationModal({
  isOpen,
  onClose,
  templateId,
  sampleJson
}: {
  isOpen: boolean,
  onClose: () => void,
  templateId: string,
  sampleJson: string
}) {
  const [activeTab, setActiveTab] = useState<'curl' | 'js' | 'python'>('curl');
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState("http://localhost:3000");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  if (!isOpen) return null;

  let formattedJson = sampleJson;
  try {
    formattedJson = JSON.stringify(JSON.parse(sampleJson), null, 2);
  } catch (e) { }

  const curlSnippet = `curl -X POST ${baseUrl}/api/generate-pdf \\
  -H "Content-Type: application/json" \\
  -d '{
    "templateId": "${templateId}",
    "data": ${formattedJson.split('\n').join('\n    ')}
  }' \\
  --output document.pdf`;

  const jsSnippet = `const generatePDF = async () => {
  const response = await fetch("${baseUrl}/api/generate-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      templateId: "${templateId}",
      data: ${formattedJson.split('\n').join('\n      ')}
    })
  });
  
  if (!response.ok) throw new Error("Failed to generate PDF");
  
  const pdfBlob = await response.blob();
  const url = window.URL.createObjectURL(pdfBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "document.pdf";
  a.click();
};`;

  const pySnippet = `import requests

url = "${baseUrl}/api/generate-pdf"
payload = {
    "templateId": "${templateId}",
    "data": ${formattedJson.split('\n').join('\n    ')}
}

response = requests.post(url, json=payload)

if response.status_code == 200:
    with open("document.pdf", "wb") as f:
        f.write(response.content)
    print("PDF saved successfully!")
else:
    print("Error:", response.text)`;

  const snippets = {
    curl: curlSnippet,
    js: jsSnippet,
    python: pySnippet
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'curl' as const, label: 'cURL', icon: <Terminal className="w-3.5 h-3.5" /> },
    { id: 'js' as const, label: 'Node.js', icon: <Code2 className="w-3.5 h-3.5" /> },
    { id: 'python' as const, label: 'Python', icon: <Braces className="w-3.5 h-3.5" /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-card border border-muted w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-muted">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-accent/10 rounded-xl">
                  <Terminal className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-semibold text-foreground">API Integration</h2>
                  <p className="text-sm text-foreground/50">Generate PDFs programmatically from your applications.</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted/50 rounded-full text-foreground/40 hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-6 pt-4">
              <div className="flex p-1 bg-muted/40 rounded-xl border border-muted w-fit">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                      ? 'bg-card text-accent shadow-sm border border-muted'
                      : 'text-foreground/50 hover:text-foreground'
                      }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Block Content */}
            <div className="p-6 flex-1 overflow-hidden flex flex-col min-h-0">
              <div className="relative group flex-1 flex flex-col min-h-0">
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg text-xs font-semibold transition-all border border-accent/20 mt-[-10]"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy Snippet"}
                  </button>
                </div>

                <div className="flex-1 bg-[#0d1117] rounded-xl border border-muted overflow-hidden flex flex-col shadow-inner">
                  {/* Fake traffic lights */}
                  <div className="flex gap-1.5 px-4 py-3 bg-[#161b22] border-b border-[#30363d]">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                    <span className="ml-2 text-[10px] text-foreground/30 font-mono uppercase tracking-widest">{activeTab}</span>
                  </div>

                  <pre className="p-5 overflow-auto text-sm font-mono leading-relaxed text-[#c9d1d9] flex-1 scrollbar-thin scrollbar-thumb-muted-foreground/20">
                    <code>{snippets[activeTab]}</code>
                  </pre>
                </div>
              </div>

              {/* Tips/Info Footer */}
              <div className="mt-4 p-4 bg-accent/5 rounded-xl border border-accent/10 flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                <p className="text-xs text-foreground/60 leading-relaxed font-sans">
                  <strong className="text-foreground">Pro-tip:</strong> Ensure you handle the PDF binary response correctly. For browser-side integration, use <code className="text-accent font-semibold px-1">window.URL.createObjectURL(blob)</code> to display or download the result.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
