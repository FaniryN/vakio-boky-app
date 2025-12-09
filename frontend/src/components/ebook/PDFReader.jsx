import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import Button from '@/components/ui/Button';

// Set worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PDFReader({ blob, onClose }) {
  const canvasRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.5);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const pdf = await pdfjsLib.getDocument(URL.createObjectURL(blob)).promise;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    if (blob) {
      loadPDF();
    }
  }, [blob]);

  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current) return;

      try {
        const page = await pdfDoc.getPage(pageNumber);
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
      } catch (error) {
        console.error('Error rendering page:', error);
      }
    };

    renderPage();
  }, [pdfDoc, pageNumber, scale]);

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => setScale(prev => prev + 0.25);
  const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Page {pageNumber} of {numPages}
            </span>
            <div className="flex gap-2">
              <Button size="sm" onClick={zoomOut}>-</Button>
              <span className="text-sm self-center">{Math.round(scale * 100)}%</span>
              <Button size="sm" onClick={zoomIn}>+</Button>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={onClose}>
            <FiX />
          </Button>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-auto p-4 flex justify-center">
          <canvas ref={canvasRef} className="shadow-lg" />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-4 border-t">
          <Button
            variant="secondary"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
          >
            <FiChevronLeft /> Précédent
          </Button>

          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max={numPages}
              value={pageNumber}
              onChange={(e) => setPageNumber(Math.min(Math.max(parseInt(e.target.value) || 1, 1), numPages))}
              className="w-16 px-2 py-1 border rounded text-center"
            />
            <span className="self-center">/ {numPages}</span>
          </div>

          <Button
            variant="secondary"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
          >
            Suivant <FiChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}