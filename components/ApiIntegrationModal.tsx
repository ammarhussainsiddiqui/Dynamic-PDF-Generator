import { useState, useEffect } from 'react';
import { X, Copy, Check } from 'lucide-react';

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
  const [baseUrl, setBaseUrl] = useState('http://localhost:3000');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  if (!isOpen) return null;

  // Format the JSON nicely if possible, or use raw
  let formattedJson = sampleJson;
  try {
     formattedJson = JSON.stringify(JSON.parse(sampleJson), null, 2);
  } catch (e) {}

  const curlSnippet = `curl -X POST ${baseUrl}/api/generate-pdf \\
  -H "Content-Type: application/json" \\
  -d '{
    "templateId": "${templateId}",
    "data": ${formattedJson.split('\\n').join('\\n    ')}
  }' \\
  --output document.pdf`;

  const jsSnippet = `const generatePDF = async () => {
  const response = await fetch("${baseUrl}/api/generate-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      templateId: "${templateId}",
      data: ${formattedJson.split('\\n').join('\\n      ')}
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
    "data": ${formattedJson.split('\\n').join('\\n    ')}
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

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">API Integration Guide</h2>
            <p className="text-sm text-gray-500 mt-1">Use this exact code to dynamically generate PDFs from your external apps.</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 bg-gray-100 p-2 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex border-b bg-gray-50 px-6 pt-2">
          {(['curl', 'js', 'python'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-lg' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
              {tab === 'js' ? 'Node.js / Browser' : tab === 'curl' ? 'cURL' : 'Python'}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto bg-gray-50 flex-grow">
          <div className="relative group">
            <button 
              onClick={handleCopy}
              className="absolute top-3 right-3 p-2 bg-gray-800/80 text-gray-300 rounded hover:text-white hover:bg-gray-700 transition backdrop-blur flex items-center gap-2 text-xs font-semibold"
              title="Copy code"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <pre className="bg-[#1e1ea8] bg-opacity-95 text-[#a6accd] p-5 rounded-xl overflow-x-auto text-sm font-mono shadow-inner leading-relaxed border border-gray-800" style={{ backgroundColor: '#0d1117' }}>
              <code>{snippets[activeTab]}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
