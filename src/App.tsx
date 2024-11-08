import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { FileUp, Loader2, LogOut } from 'lucide-react';
import { SignIn, SignedIn, SignedOut, useUser, useClerk } from '@clerk/clerk-react';
import PDFViewer from './components/PDFViewer';
import ChatPanel from './components/ChatPanel';
import { extractTextFromPDF } from './lib/gemini';
import { supabase } from './lib/supabase';

function App() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [file, setFile] = React.useState<File | null>(null);
  const [pdfContent, setPdfContent] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || !user) return;

    setFile(selectedFile);
    setIsProcessing(true);

    try {
      // Upload to Supabase
      const fileName = `${user.id}/${Date.now()}-${selectedFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('talktopdf')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const content = await extractTextFromPDF(selectedFile);
      setPdfContent(content);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Failed to process PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <SignedOut>
        <div className="h-screen flex items-center justify-center">
          <SignIn />
        </div>
      </SignedOut>

      <SignedIn>
        <header className="bg-white border-b px-6 py-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">PDF Q&A Assistant</h1>
            <div className="flex items-center gap-4">
              <label className="relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isProcessing}
                />
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    isProcessing
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  onClick={() => document.querySelector('input[type="file"]')?.click()}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileUp className="w-5 h-5" />
                      Upload PDF
                    </>
                  )}
                </button>
              </label>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          <div className="h-full max-w-7xl mx-auto p-6">
            <PanelGroup direction="horizontal" className="h-full">
              <Panel defaultSize={50} minSize={30}>
                <PDFViewer file={file} />
              </Panel>
              <PanelResizeHandle className="w-2 bg-gray-200 hover:bg-gray-300 transition-colors" />
              <Panel defaultSize={50} minSize={30}>
                <ChatPanel pdfContent={pdfContent} />
              </Panel>
            </PanelGroup>
          </div>
        </main>
      </SignedIn>
    </div>
  );
}

export default App;