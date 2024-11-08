import React, { useState, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Loader2, LogOut, User, X, Menu } from 'lucide-react';
import { SignIn, SignedIn, SignedOut, useUser, useClerk } from '@clerk/clerk-react';
import PDFViewer from './components/PDFViewer';
import ChatPanel from './components/ChatPanel';
import { extractTextFromPDF } from './lib/gemini';
import { supabase } from './lib/supabase';

function App() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [file, setFile] = useState<File | null>(null);
  const [pdfContent, setPdfContent] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    if (!file) {
      setShowUploadPopup(true);
    }
  }, [file]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || !user) return;

    setFile(selectedFile);
    setIsProcessing(true);
    setShowUploadPopup(false);

    try {
      const fileName = `${user.id}/${Date.now()}-${selectedFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('talktopdf')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const content = await extractTextFromPDF(selectedFile);
      setPdfContent(content);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Failed to process PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center p-4">
          <SignIn />
        </div>
      </SignedOut>

      <SignedIn>
        <header className="bg-white border-b px-4 py-3 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">PDF Q&A Assistant</h1>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setShowProfilePopup(true)}
                className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <User className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-1.5 sm:hidden text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {showMobileMenu && (
          <div className="sm:hidden bg-white border-b px-4 py-2">
            <button
              onClick={() => {
                setShowUploadPopup(true);
                setShowMobileMenu(false);
              }}
              className="w-full text-left py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              Upload PDF
            </button>
            <button
              onClick={() => signOut()}
              className="w-full text-left py-2 text-red-600 hover:bg-gray-100 rounded transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}

        <main className="flex-1 overflow-hidden">
          <div className="h-full max-w-7xl mx-auto p-4">
            {file ? (
              <PanelGroup direction="horizontal" className="h-full">
                <Panel defaultSize={50} minSize={30}>
                  <PDFViewer file={file} />
                </Panel>
                <PanelResizeHandle className="w-1 sm:w-2 bg-gray-200 hover:bg-gray-300 transition-colors" />
                <Panel defaultSize={50} minSize={30}>
                  <ChatPanel pdfContent={pdfContent} />
                </Panel>
              </PanelGroup>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500 text-lg text-center px-4">Upload a PDF to get started</p>
              </div>
            )}
          </div>
        </main>

        {showUploadPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">Upload PDF</h2>
                {file && (
                  <button onClick={() => setShowUploadPopup(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <p className="mb-4 text-sm sm:text-base text-gray-600">Select a PDF file to upload and analyze.</p>
              <label className="block">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </label>
            </div>
          </div>
        )}

        {showProfilePopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">Profile</h2>
                <button onClick={() => setShowProfilePopup(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-4">
                <p className="font-medium">Name: {user?.fullName}</p>
                <p className="text-gray-600 text-sm sm:text-base">Email: {user?.primaryEmailAddress?.emailAddress}</p>
              </div>
              <button
                onClick={() => signOut()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                Sign Out
              </button>
            </div>
          </div>
        )}

        {showToast && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm sm:text-base">
            PDF uploaded and processed successfully!
          </div>
        )}

        {isProcessing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 sm:p-6 flex items-center">
              <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-blue-500 mr-3" />
              <p className="text-sm sm:text-base">Processing PDF...</p>
            </div>
          </div>
        )}
      </SignedIn>
    </div>
  );
}

export default App;