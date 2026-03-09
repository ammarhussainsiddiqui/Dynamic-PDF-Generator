"use client";
import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import Handlebars from "handlebars";
import { ArrowLeft, Save, Play, Code2, FileCode2, Braces, Terminal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ApiIntegrationModal from "./ApiIntegrationModal";

export default function TemplateEditor({ initialTemplate }: { initialTemplate: any }) {
  const [html, setHtml] = useState(initialTemplate.htmlContent || "");
  const [css, setCss] = useState(initialTemplate.cssContent || "");
  const [jsonStr, setJsonStr] = useState(initialTemplate.sampleJson || "");
  const [previewHtml, setPreviewHtml] = useState("");
  const [activeTab, setActiveTab] = useState<"html" | "css" | "json">("html");
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const router = useRouter();

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
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          htmlContent: html,
          cssContent: css,
          sampleJson: jsonStr,
        }),
      });
    } catch (e) {
      alert("Failed to save template");
    } finally {
      setSaving(false);
    }
  };

  const generatePdf = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: initialTemplate._id,
          data: JSON.parse(jsonStr),
        }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      } else {
        alert("Failed to generate PDF");
      }
    } catch (e) {
      alert("Error generating PDF");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="h-14 border-b flex items-center justify-between px-4 bg-gray-50 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-semibold text-gray-900 truncate max-w-xs">{initialTemplate.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowApiModal(true)}
            className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded text-sm font-medium transition border border-indigo-200"
          >
            <Terminal className="w-4 h-4" />
            API Code
          </button>
          <button
            onClick={generatePdf}
            disabled={generating}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded text-sm font-medium transition disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            {generating ? "Generating..." : "Test PDF"}
          </button>
          <button
            onClick={saveTemplate}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-medium transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="flex flex-grow overflow-hidden">
        {/* Editor Pane */}
        <div className="w-1/2 flex flex-col border-r bg-gray-50">
          <div className="flex border-b">
            <button
              className={`flex-1 py-2 text-sm font-medium flex justify-center items-center gap-2 ${activeTab === 'html' ? 'bg-white border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('html')}
            >
              <Code2 className="w-4 h-4" /> HTML
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium flex justify-center items-center gap-2 ${activeTab === 'css' ? 'bg-white border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('css')}
            >
              <FileCode2 className="w-4 h-4" /> CSS
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium flex justify-center items-center gap-2 ${activeTab === 'json' ? 'bg-white border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('json')}
            >
              <Braces className="w-4 h-4" /> Test JSON
            </button>
          </div>
          
          <div className="flex-grow relative">
            {activeTab === 'html' && (
              <Editor
                className="absolute inset-0"
                language="html"
                theme="vs-light"
                value={html}
                onChange={(v) => setHtml(v || "")}
                options={{ minimap: { enabled: false }, fontSize: 13 }}
              />
            )}
            {activeTab === 'css' && (
              <Editor
                className="absolute inset-0"
                language="css"
                theme="vs-light"
                value={css}
                onChange={(v) => setCss(v || "")}
                options={{ minimap: { enabled: false }, fontSize: 13 }}
              />
            )}
            {activeTab === 'json' && (
              <Editor
                className="absolute inset-0"
                language="json"
                theme="vs-light" // vs-dark for dark mode
                value={jsonStr}
                onChange={(v) => setJsonStr(v || "")}
                options={{ minimap: { enabled: false }, fontSize: 13, formatOnPaste: true }}
              />
            )}
          </div>
        </div>

        {/* Live Preview Pane */}
        <div className="w-1/2 bg-gray-200 p-6 flex flex-col max-h-full overflow-y-auto">
          <div className="bg-white mx-auto shadow-xl flex-shrink-0" style={{ width: "210mm", height: "297mm", maxWidth: "100%" }}>
            <iframe 
              srcDoc={previewHtml} 
              className="w-full h-full border-none pointer-events-none" 
              title="PDF Preview"
            />
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
