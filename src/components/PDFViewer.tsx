import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Loader2, ZoomIn, ZoomOut } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File | null;
}

export default function PDFViewer({ file }: PDFViewerProps) {
  const [numPages, setNumPages] = React.useState<number>(0);
  const [scale, setScale] = React.useState(1.2);
  const [isLoading, setIsLoading] = React.useState(false);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (file) {
      setIsLoading(true);
    }
  }, [file]);

  return (
    <div className="h-full flex flex-col bg-[#0A0A0A] text-white">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 p-3 bg-[#1A1A1A] border-b border-[#2A2A2A]">
        <div className="text-sm font-medium text-gray-300">
          {file?.name}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setScale(s => s + 0.1)}
            className="p-2 text-gray-300 hover:bg-[#2A2A2A] rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
            className="p-2 text-gray-300 hover:bg-[#2A2A2A] rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        )}

        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          className="flex flex-col items-center"
        >
          {Array.from(new Array(numPages), (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              scale={scale}
              className="mb-4 shadow-lg bg-[#1A1A1A]"
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          ))}
        </Document>
      </div>
    </div>
  );
}