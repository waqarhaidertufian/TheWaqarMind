import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  BookOpen,
  Download,
  ExternalLink,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { Book } from '../types';

interface PdfReaderModalProps {
  book: Book | null;
  onClose: () => void;
}

export const PdfReaderModal: React.FC<PdfReaderModalProps> = React.memo(
  ({ book, onClose }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [zoom, setZoom] = useState<number>(100);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [viewerMode, setViewerMode] = useState<'google' | 'direct'>('google');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (isFullscreen) {
            setIsFullscreen(false);
          } else {
            onClose();
          }
        } else if (e.key === 'ArrowRight') {
          setCurrentPage((prev) => prev + 1);
        } else if (e.key === 'ArrowLeft') {
          setCurrentPage((prev) => Math.max(1, prev - 1));
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen, onClose]);

    if (!book) return null;

    const toggleFullscreen = () => {
      if (!containerRef.current) return;
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen?.().catch(() => {});
        setIsFullscreen(true);
      } else {
        document.exitFullscreen?.().catch(() => {});
        setIsFullscreen(false);
      }
    };

    const handleZoomIn = () => setZoom((z) => Math.min(200, z + 25));
    const handleZoomOut = () => setZoom((z) => Math.max(50, z - 25));

    // Ensure URL is clean
    const rawPdfUrl = book.pdf_url?.trim() || '';

    // Construct URL based on viewer mode
    const googleDocsViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(rawPdfUrl)}&embedded=true`;
    const directPdfUrl = `${rawPdfUrl}#page=${currentPage}&zoom=${zoom}`;

    const iframeSrc = viewerMode === 'google' ? googleDocsViewerUrl : directPdfUrl;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-xl text-[#E1E0CC]"
          ref={containerRef}
        >
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-black/80 gap-3">
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 shrink-0">
                <BookOpen className="w-5 h-5 text-[#E1E0CC]" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-semibold truncate text-[#E1E0CC]">
                  {book.title}
                </h2>
                <p className="text-xs text-gray-400 truncate">
                  by {book.author} • {book.category}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 flex-wrap">
              {/* Viewer Engine Toggle */}
              <div className="flex items-center p-1 bg-white/5 border border-white/10 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setViewerMode('google')}
                  className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
                    viewerMode === 'google'
                      ? 'bg-[#E1E0CC] text-black font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Google Web Engine (Bypasses Chrome origin blocks)"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Web Embed</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewerMode('direct')}
                  className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
                    viewerMode === 'direct'
                      ? 'bg-[#E1E0CC] text-black font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Direct PDF Stream"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Direct PDF</span>
                </button>
              </div>

              {/* Zoom Controls (Direct Mode) */}
              {viewerMode === 'direct' && (
                <div className="hidden sm:flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
                  <button
                    onClick={handleZoomOut}
                    disabled={zoom <= 50}
                    className="p-1.5 hover:bg-white/10 rounded transition disabled:opacity-30"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4 text-[#E1E0CC]" />
                  </button>
                  <span className="text-xs font-mono px-2 min-w-[3rem] text-center">
                    {zoom}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    disabled={zoom >= 200}
                    className="p-1.5 hover:bg-white/10 rounded transition disabled:opacity-30"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4 text-[#E1E0CC]" />
                  </button>
                </div>
              )}

              {/* Open in New Tab Button */}
              <a
                href={rawPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E1E0CC] text-black font-medium hover:bg-white rounded-lg transition text-xs shadow-md"
                title="Open PDF directly in new browser tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Tab</span>
              </a>

              {/* Download Direct Link */}
              <a
                href={rawPdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition text-gray-300 hover:text-white"
                title="Download PDF File"
              >
                <Download className="w-4 h-4" />
              </a>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="hidden md:flex p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition text-gray-300 hover:text-white"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition text-white"
                title="Close Reader (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Fallback Security Bar */}
          <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Viewing mode: <strong className="text-white capitalize">{viewerMode} Engine</strong>. If blocked by browser cross-origin policy, use the button on the right.
            </span>
            <div className="flex items-center gap-2">
              <a
                href={rawPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E1E0CC] hover:underline font-medium flex items-center gap-1"
              >
                Open Original PDF <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Main Viewer Area */}
          <div className="flex-1 relative w-full h-full bg-[#111111] overflow-hidden flex items-center justify-center p-2 sm:p-4">
            <div
              className="w-full h-full max-w-6xl rounded-xl overflow-hidden border border-white/10 shadow-2xl transition-transform duration-200"
              style={{
                transform: viewerMode === 'direct' ? `scale(${zoom / 100})` : 'none',
                transformOrigin: 'top center',
              }}
            >
              <iframe
                key={`${viewerMode}-${rawPdfUrl}`}
                src={iframeSrc}
                title={`PDF Reader - ${book.title}`}
                className="w-full h-full border-0 bg-white"
                allow="fullscreen"
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }
);

PdfReaderModal.displayName = 'PdfReaderModal';
