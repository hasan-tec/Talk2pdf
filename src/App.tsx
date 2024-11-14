import React, { useState, useEffect } from 'react';
import { Loader2, LogOut, User, X, Upload, Home } from 'lucide-react';
import { SignIn, SignedIn, SignedOut, useUser, useClerk } from '@clerk/clerk-react';
import PDFViewer from './components/PDFViewer';
import ChatPanel from './components/ChatPanel';
import LandingPage from './components/LandingPage';
import { extractTextFromPDF } from './lib/gemini';
import { supabase } from './lib/supabase';
import { Button } from "./components/ui/button"
import { Card, CardContent } from "./components/ui/card"
import ModePicker from './components/ModePicker';
import QuizPanel from './components/QuizPanel';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./components/ui/sheet"

export default function App() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [file, setFile] = useState<File | null>(null);
  const [pdfContent, setPdfContent] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [interactionMode, setInteractionMode] = useState<'chat' | 'quiz' | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || !user) return;

    setFile(selectedFile);
    setInteractionMode(null);
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

  useEffect(() => {
    if (user) {
      setShowLanding(false);
    }
  }, [user]);

  const handleHome = () => {
    setInteractionMode(null);
  };

  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-white">
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center p-4">
          <SignIn />
        </div>
      </SignedOut>

      <SignedIn>
        <header className="bg-[#1A1A1A] border-b border-[#2A2A2A] px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold">PDF Q&A Assistant</h1>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Open user menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Profile</SheetTitle>
                    <SheetDescription>
                      <div className="py-4">
                        <p className="font-medium">Name: {user?.fullName}</p>
                        <p className="text-sm text-gray-400">Email: {user?.primaryEmailAddress?.emailAddress}</p>
                      </div>
                      <Button
                        onClick={() => signOut()}
                        variant="destructive"
                        className="w-full mt-4"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowUploadPopup(true)}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload PDF
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          <div className="h-full max-w-7xl mx-auto p-4">
          {file ? (
            <>
              {!interactionMode ? (
                <ModePicker onModeSelect={setInteractionMode} />
              ) : (
                interactionMode === 'chat' ? (
                  <div className="h-[calc(100vh-6rem)] grid gap-4 grid-cols-1 lg:grid-cols-2">
                    <Card className="overflow-hidden bg-[#1A1A1A] border-[#2A2A2A]">
                      <CardContent className="p-0 h-full">
                        <PDFViewer file={file} />
                      </CardContent>
                    </Card>
                    <Card className="overflow-hidden bg-[#1A1A1A] border-[#2A2A2A]">
                      <CardContent className="p-0 h-full">
                        <ChatPanel pdfContent={pdfContent} onHome={handleHome} />
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <QuizPanel 
                    pdfContent={pdfContent} 
                    onExit={() => setInteractionMode(null)} 
                  />
                )
              )}
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <Card className="w-full max-w-md bg-[#1A1A1A] border-[#2A2A2A]">
                <CardContent className="flex flex-col items-center p-6">
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-center mb-2">No PDF uploaded yet</p>
                  <p className="text-sm text-gray-400 text-center mb-4">Upload a PDF to start asking questions</p>
                  <Button onClick={() => setShowUploadPopup(true)}>
                    Upload PDF
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
          </div>
        </main>

        {showUploadPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md bg-[#1A1A1A] border-[#2A2A2A]">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Upload PDF</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowUploadPopup(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mb-4 text-sm text-gray-400">Select a PDF file to upload and analyze.</p>
                <label className="block">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                  />
                </label>
              </CardContent>
            </Card>
          </div>
        )}

        {showToast && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
            PDF uploaded and processed successfully!
          </div>
        )}

        {isProcessing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-sm bg-[#1A1A1A] border-[#2A2A2A]">
              <CardContent className="flex items-center justify-center p-6">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-3" />
                <p>Processing PDF...</p>
              </CardContent>
            </Card>
          </div>
        )}
      </SignedIn>
    </div>
  );
}