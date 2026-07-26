import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  BookOpen,
  X,
  Lock,
  ArrowRight,
  Filter,
  Sparkles,
  Download,
  BookMarked,
  ChevronDown,
  Check,
} from 'lucide-react';
import { Book } from '../types';
import { bookService } from '../services/bookService';
import { PdfReaderModal } from './PdfReaderModal';
import { AdminModal } from './AdminModal';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  'All',
  'Technology & AI',
  'Mindset & Growth',
  'Islamic',
  'Political',
  'Deep Thought & Thinking',
  'Design & Arts',
  'Leadership',
  'Philosophy',
];

export const LibraryModal: React.FC<LibraryModalProps> = React.memo(
  ({ isOpen, onClose }) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const [activeBook, setActiveBook] = useState<Book | null>(null);
    const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const loadBooks = async () => {
      setIsLoading(true);
      try {
        const data = await bookService.fetchBooks();
        setBooks(data);
      } catch (err) {
        console.error('Failed to load books:', err);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      if (isOpen) {
        loadBooks();
      }
    }, [isOpen]);

    const filteredBooks = useMemo(() => {
      return books.filter((book) => {
        const matchesCategory =
          selectedCategory === 'All' || book.category === selectedCategory;
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query) ||
          book.category.toLowerCase().includes(query);
        return matchesCategory && matchesQuery;
      });
    }, [books, selectedCategory, searchQuery]);

    if (!isOpen) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl text-[#E1E0CC] overflow-y-auto p-3 sm:p-6 md:p-10"
        >
          <div className="max-w-7xl mx-auto space-y-5 sm:space-y-8 pb-16">
            {/* Header Navigation */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <BookMarked className="w-6 h-6 text-[#E1E0CC]" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#E1E0CC]">
                    TheWaqarMind Digital Library
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400">
                    A curated archive of PDF literature, research, and technical insights.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white transition"
                  title="Admin Portal"
                >
                  <motion.span
                    animate={{
                      opacity: [1, 0.35, 1],
                      scale: [1, 1.12, 1],
                      filter: [
                        'drop-shadow(0 0 2px rgba(252, 211, 77, 0.5))',
                        'drop-shadow(0 0 10px rgba(252, 211, 77, 1))',
                        'drop-shadow(0 0 2px rgba(252, 211, 77, 0.5))',
                      ],
                    }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="inline-flex items-center justify-center"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-300" />
                  </motion.span>
                  <span className="hidden sm:inline">Admin Management</span>
                </button>

                <button
                  onClick={onClose}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition"
                  title="Close Library"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Testing Notice Notification Banner */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-amber-500/10 border border-amber-400/30 p-4 sm:p-5 shadow-2xl backdrop-blur-xl"
            >
              <motion.div
                className="absolute inset-0 bg-amber-400/10 rounded-2xl -z-10 pointer-events-none"
                animate={{
                  scale: [1, 1.02, 1],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              <div className="flex items-start sm:items-center gap-3.5">
                <motion.div
                  animate={{
                    scale: [1, 1.15, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="p-2.5 rounded-xl bg-amber-400/20 border border-amber-300/40 text-amber-300 shrink-0 mt-0.5 sm:mt-0 shadow-lg"
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                    </span>
                    <p className="text-[11px] font-semibold tracking-wider uppercase text-amber-300">
                      Notice / Update
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-100/90 font-medium leading-relaxed">
                    The current books are for testing purposes only. My personal research material and deep thoughts will be live soon.
                  </p>
                  <p className="text-[11px] sm:text-xs font-semibold text-amber-300 pt-1 tracking-wide flex items-center gap-1">
                    <span className="opacity-70">—</span>
                    <span>TheWaqarMind</span>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books, authors, topics..."
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm focus:border-white/30 focus:outline-none placeholder:text-gray-500 text-white transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Filter Dropdown Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsFilterOpen((prev) => !prev)}
                  className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-medium text-white transition active:scale-[0.98] shadow-lg cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#E1E0CC]" />
                    <span>
                      Filter:{' '}
                      <strong className="text-[#E1E0CC] font-semibold">
                        {selectedCategory}
                      </strong>
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      isFilterOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Filter Dropdown Menu */}
                <AnimatePresence>
                  {isFilterOpen && (
                    <>
                      {/* Transparent backdrop to close dropdown on click outside */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsFilterOpen(false)}
                      />

                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-full sm:w-64 py-2 rounded-2xl bg-[#121212] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 overflow-hidden"
                      >
                        <div className="px-4 py-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400 border-b border-white/10 flex items-center justify-between">
                          <span>Categories</span>
                          {selectedCategory !== 'All' && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCategory('All');
                                setIsFilterOpen(false);
                              }}
                              className="text-[#E1E0CC] hover:underline normal-case font-normal text-[11px] cursor-pointer"
                            >
                              Reset
                            </button>
                          )}
                        </div>

                        <div className="max-h-64 overflow-y-auto py-1">
                          {CATEGORIES.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => {
                                setSelectedCategory(cat);
                                setIsFilterOpen(false);
                              }}
                              className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm font-medium flex items-center justify-between transition-colors cursor-pointer ${
                                selectedCategory === cat
                                  ? 'bg-[#E1E0CC]/15 text-[#E1E0CC] font-semibold'
                                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              <span>{cat}</span>
                              {selectedCategory === cat && (
                                <Check className="w-4 h-4 text-[#E1E0CC]" />
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Book Grid */}
            {isLoading ? (
              <div className="py-20 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-[#E1E0CC] animate-spin mx-auto opacity-70" />
                <p className="text-sm text-gray-400">Loading digital library archives...</p>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="py-20 text-center space-y-4 border border-dashed border-white/10 rounded-3xl p-8 bg-white/[0.02]">
                <BookOpen className="w-12 h-12 text-gray-600 mx-auto" />
                <h3 className="text-base font-medium text-gray-300">No books found matching your criteria</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Try adjusting your search query or selecting a different category.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6 md:gap-8">
                {filteredBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="group relative bg-[#0d0d0d] border border-white/10 hover:border-white/25 rounded-xl sm:rounded-2xl md:rounded-3xl p-2.5 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black/80"
                  >
                    {/* Top Cover Section */}
                    <div className="space-y-2 sm:space-y-4">
                      <div className="relative aspect-[3/4] w-full rounded-lg sm:rounded-xl overflow-hidden bg-black/60 border border-white/5 shadow-inner">
                        <img
                          src={book.cover_image}
                          alt={book.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-[8px] sm:text-[10px] font-semibold tracking-wide text-[#E1E0CC] line-clamp-1 max-w-[85%]">
                          {book.category}
                        </div>
                      </div>

                      {/* Info Section */}
                      <div className="space-y-1 sm:space-y-1.5">
                        <h3 className="text-xs sm:text-base font-semibold tracking-tight text-[#E1E0CC] line-clamp-1 group-hover:text-white transition">
                          {book.title}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-gray-400 font-medium line-clamp-1">
                          by {book.author}
                        </p>
                        {book.description && (
                          <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-1 sm:line-clamp-2 pt-0.5 sm:pt-1 leading-relaxed">
                            {book.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Section */}
                    <div className="pt-2.5 sm:pt-5 mt-2 sm:mt-4 border-t border-white/5 flex items-center justify-between gap-1.5 sm:gap-3">
                      <button
                        onClick={() => setActiveBook(book)}
                        className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-4 rounded-lg sm:rounded-xl bg-[#E1E0CC] text-black hover:bg-white font-medium text-[10px] sm:text-xs transition shadow-md whitespace-nowrap"
                      >
                        <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                        <span>Read PDF</span>
                        <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 hidden sm:inline" />
                      </button>

                      <a
                        href={book.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition shrink-0"
                        title="Download / Open PDF directly"
                      >
                        <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* PDF Reader Modal */}
          <PdfReaderModal
            book={activeBook}
            onClose={() => setActiveBook(null)}
          />

          {/* Admin Portal Modal */}
          <AdminModal
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            books={books}
            onRefreshBooks={loadBooks}
          />
        </motion.div>
      </AnimatePresence>
    );
  }
);

LibraryModal.displayName = 'LibraryModal';
