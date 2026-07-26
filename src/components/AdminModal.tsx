import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Lock,
  Plus,
  Trash2,
  Edit,
  Upload,
  CheckCircle,
  Database,
  Sparkles,
  LogOut,
  Mail,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { Book } from '../types';
import { bookService } from '../services/bookService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  onRefreshBooks: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = React.memo(
  ({ isOpen, onClose, books, onRefreshBooks }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userEmail, setUserEmail] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
    const [authError, setAuthError] = useState<string>('');

    // Editing / Adding state
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

    // Form inputs
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('Technology & AI');
    const [description, setDescription] = useState('');
    const [coverUrl, setCoverUrl] = useState('');
    const [pdfUrl, setPdfUrl] = useState('');

    // Upload loading & delete state
    const [isUploading, setIsUploading] = useState(false);
    const [statusMsg, setStatusMsg] = useState('');
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [deletingBookId, setDeletingBookId] = useState<string | null>(null);

    // Check active Supabase Auth session
    useEffect(() => {
      if (!isSupabaseConfigured || !supabase) return;

      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (error) {
          console.error('[Supabase Auth Session Failure]:', error.message, error);
        } else if (session?.user) {
          console.log('[Supabase Auth Session Restored]: Logged in user:', session.user.email, '| ID:', session.user.id);
          setIsAuthenticated(true);
          setUserEmail(session.user.email || 'Admin');
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log(`[Supabase Auth State Event]: ${event}, User: ${session?.user?.email || 'None'}`);
        if (session?.user) {
          setIsAuthenticated(true);
          setUserEmail(session.user.email || 'Admin');
        } else {
          setIsAuthenticated(false);
          setUserEmail('');
        }
      });

      return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
      if (editingBook) {
        setTitle(editingBook.title);
        setAuthor(editingBook.author);
        setCategory(editingBook.category);
        setDescription(editingBook.description);
        setCoverUrl(editingBook.cover_image);
        setPdfUrl(editingBook.pdf_url);
        setIsCreatingNew(false);
      }
    }, [editingBook]);

    if (!isOpen) return null;

    const handleAuthSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError('');

      if (!isSupabaseConfigured || !supabase) {
        const errorMsg = 'Supabase is not configured. Please verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in environment variables.';
        console.error('[Supabase Auth Error]:', errorMsg);
        setAuthError(errorMsg);
        return;
      }

      setIsAuthenticating(true);

      console.log(`[Supabase Auth Login Start]: Attempting signInWithPassword for email: "${email}"...`);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('[Supabase Auth Login Failure]:', error.message, error);
          setAuthError(error.message);
        } else if (data.session) {
          console.log('[Supabase Auth Login Success]: Authenticated session established for:', data.session.user.email);
          setIsAuthenticated(true);
          setUserEmail(data.session.user.email || 'Admin');
          setEmail('');
          setPassword('');
        }
      } catch (err: any) {
        console.error('[Supabase Auth Login Exception]:', err?.message || err);
        setAuthError(err?.message || 'Authentication failed.');
      } finally {
        setIsAuthenticating(false);
      }
    };

    const handleLogout = async () => {
      if (supabase) {
        console.log('[Supabase Auth Logout]: Signing out user...');
        await supabase.auth.signOut();
      }
      setIsAuthenticated(false);
      setUserEmail('');
      resetForm();
    };

    const resetForm = () => {
      setEditingBook(null);
      setIsCreatingNew(false);
      setTitle('');
      setAuthor('');
      setCategory('Technology & AI');
      setDescription('');
      setCoverUrl('');
      setPdfUrl('');
      setStatusMsg('');
      setConfirmDeleteId(null);
      setDeletingBookId(null);
    };

    const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setIsUploading(true);
      setStatusMsg('Uploading cover image to Supabase Storage bucket "books"...');
      try {
        console.log(`[Admin Modal Cover Upload]: Selected file "${file.name}" (${file.size} bytes)`);
        const url = await bookService.uploadFile(file, 'covers');
        setCoverUrl(url);
        setStatusMsg('Cover image uploaded successfully.');
      } catch (err: any) {
        const exactError = err?.message || String(err);
        console.error('[Admin Modal Cover Upload Failure]:', exactError, err);
        setStatusMsg(`Failed to upload cover: ${exactError}`);
      } finally {
        setIsUploading(false);
      }
    };

    const handlePdfFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setIsUploading(true);
      setStatusMsg('Uploading PDF document to Supabase Storage bucket "books"...');
      try {
        console.log(`[Admin Modal PDF Upload]: Selected file "${file.name}" (${file.size} bytes)`);
        const url = await bookService.uploadFile(file, 'pdfs');
        setPdfUrl(url);

        // Auto-fill Title if empty
        if (!title) {
          const rawName = file.name.replace(/\.[^/.]+$/, '');
          const cleanTitle = rawName.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
          setTitle(cleanTitle);
        }

        // Auto-fill a default aesthetic cover image if empty
        if (!coverUrl) {
          setCoverUrl('https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600');
        }

        setStatusMsg('PDF document uploaded successfully to "books" bucket! Review details and click Publish Book.');
      } catch (err: any) {
        const exactError = err?.message || String(err);
        console.error('[Admin Modal PDF Upload Failure]:', exactError, err);
        setStatusMsg(`Failed to upload PDF: ${exactError}`);
      } finally {
        setIsUploading(false);
      }
    };

    const handleSubmitBook = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!title || !author || !coverUrl || !pdfUrl) {
        const msg = 'Please complete all required fields (Title, Author, Cover Image, and PDF Document).';
        console.warn('[Admin Modal Submit Warning]:', msg);
        setStatusMsg(msg);
        return;
      }

      setIsUploading(true);
      setStatusMsg('Inserting row into public.books table...');

      try {
        if (editingBook) {
          console.log('[Admin Modal Book Update]: Modifying book ID:', editingBook.id);
          const updated = await bookService.updateBook(editingBook.id, {
            title,
            author,
            category,
            description,
            cover_image: coverUrl,
            pdf_url: pdfUrl,
          });
          if (updated) {
            console.log('[Admin Modal Book Update Success]: Updated book ID:', updated.id);
            setStatusMsg(`Book "${updated.title}" updated successfully!`);
          }
        } else {
          console.log('[Admin Modal Book Insert]: Publishing new book to public.books...');
          const inserted = await bookService.addBook({
            title,
            author,
            category,
            description,
            cover_image: coverUrl,
            pdf_url: pdfUrl,
          });
          if (inserted) {
            console.log('[Admin Modal Book Insert Success]: Inserted row in public.books with ID:', inserted.id);
            setStatusMsg(`Book "${inserted.title}" published successfully in public.books!`);
          }
        }
        console.log('[Admin Modal Refresh]: Triggering onRefreshBooks()...');
        onRefreshBooks();
        setTimeout(() => {
          resetForm();
        }, 1200);
      } catch (err: any) {
        const exactError = err?.message || String(err);
        console.error('[Admin Modal Save Failure]:', exactError, err);
        setStatusMsg(`Error saving book: ${exactError}`);
      } finally {
        setIsUploading(false);
      }
    };

    const executeDeleteBook = async (id: string, bookTitle: string) => {
      setDeletingBookId(id);
      setStatusMsg(`Deleting "${bookTitle}" from Supabase Database...`);

      try {
        console.log('[Admin Modal Delete Start]: Deleting book ID:', id, '| Title:', bookTitle);
        await bookService.deleteBook(id);
        console.log('[Admin Modal Delete Success]: Deleted book ID:', id);
        setStatusMsg(`Book "${bookTitle}" deleted successfully!`);
        if (editingBook?.id === id) {
          resetForm();
        }
        onRefreshBooks();
      } catch (err: any) {
        const exactError = err?.message || String(err);
        console.error('[Admin Modal Delete Failure]:', exactError, err);
        setStatusMsg(`Failed to delete book: ${exactError}`);
      } finally {
        setDeletingBookId(null);
        setConfirmDeleteId(null);
      }
    };

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl text-[#E1E0CC]"
        >
          <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-2xl md:rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <Lock className="w-5 h-5 text-[#E1E0CC]" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-medium tracking-tight text-[#E1E0CC]">
                    Library Administration
                  </h2>
                  <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    Supabase Database & Storage Status:{' '}
                    <span className={isSupabaseConfigured ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                      {isSupabaseConfigured ? 'Connected & Secured' : 'Configuration Pending'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-xs text-gray-300 hover:text-red-300 border border-white/10 transition cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer"
                  title="Close Modal"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
              </div>
            </div>

            {/* Supabase Authentication Screen */}
            {!isAuthenticated ? (
              <form
                onSubmit={handleAuthSubmit}
                className="max-w-md mx-auto my-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-transparent border border-[#E1E0CC]/20 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl relative overflow-hidden space-y-6"
              >
                {/* Subtle luxury glow effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E1E0CC]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col items-center text-center space-y-3 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-[#E1E0CC]/10 border border-[#E1E0CC]/30 flex items-center justify-center shadow-[0_0_25px_rgba(225,224,204,0.15)]">
                    <ShieldCheck className="w-6 h-6 text-[#E1E0CC]" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-[11px] font-semibold tracking-widest text-[#E1E0CC]/90 uppercase">
                    <Sparkles className="w-3 h-3 text-[#E1E0CC]" />
                    Secure Admin Portal
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal tracking-wide px-1">
                    Sign in with your authorized <strong className="font-semibold text-white">TheWaqarMind</strong> administrator credentials to manage library content and publish PDF books.
                  </p>
                </div>

                <div className="space-y-4 relative z-10 pt-2">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-[#E1E0CC]/80 mb-2 block">
                      Admin Email
                    </label>
                    <div className="relative group">
                      <Mail className="w-4 h-4 text-gray-400 group-focus-within:text-[#E1E0CC] transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@thewaqarmind.com"
                        className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/15 rounded-xl focus:border-[#E1E0CC]/60 focus:ring-1 focus:ring-[#E1E0CC]/40 focus:outline-none text-white text-sm placeholder:text-gray-500 transition-all shadow-inner"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-[#E1E0CC]/80 mb-2 block">
                      Password
                    </label>
                    <div className="relative group">
                      <KeyRound className="w-4 h-4 text-gray-400 group-focus-within:text-[#E1E0CC] transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter account password"
                        className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/15 rounded-xl focus:border-[#E1E0CC]/60 focus:ring-1 focus:ring-[#E1E0CC]/40 focus:outline-none text-white text-sm placeholder:text-gray-500 transition-all shadow-inner"
                        required
                      />
                    </div>
                  </div>
                </div>

                {authError && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 leading-relaxed break-words relative z-10 shadow-sm flex items-start gap-2">
                    <span className="shrink-0 text-red-400 font-bold">!</span>
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#E1E0CC] via-[#f5f4e8] to-[#D5D4BE] text-zinc-950 font-semibold text-sm hover:brightness-105 active:scale-[0.99] transition-all shadow-[0_10px_25px_rgba(225,224,204,0.18)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer border border-[#E1E0CC]/30 relative z-10"
                >
                  {isAuthenticating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-zinc-950" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-zinc-950" />
                      <span>Sign In as Admin</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Admin Management Dashboard */
              <div className="space-y-8">
                {/* Action Row */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        resetForm();
                        setIsCreatingNew(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E1E0CC] text-black font-medium text-xs sm:text-sm hover:bg-white transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Book
                    </button>
                  </div>
                  <div className="text-xs text-gray-400">
                    Logged in as: <span className="text-white font-medium">{userEmail}</span> • Total Books: {books.length}
                  </div>
                </div>

                {/* Book Editor Form */}
                {(isCreatingNew || editingBook) && (
                  <motion.form
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmitBook}
                    className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-5"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <h3 className="text-sm font-semibold tracking-wide text-[#E1E0CC] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        {editingBook ? `Edit Book: ${editingBook.title}` : 'Publish New PDF Book'}
                      </h3>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="text-xs text-gray-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 font-medium mb-1 block">
                          Book Title *
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Masterclass in Web Motion"
                          className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-sm focus:border-white/30 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 font-medium mb-1 block">
                          Author Name *
                        </label>
                        <input
                          type="text"
                          value={author}
                          onChange={(e) => setAuthor(e.target.value)}
                          placeholder="e.g. Waqar Haider"
                          className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-sm focus:border-white/30 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 font-medium mb-1 block">
                          Category
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-sm focus:border-white/30 focus:outline-none text-white"
                        >
                          <option value="Technology & AI">Technology & AI</option>
                          <option value="Mindset & Growth">Mindset & Growth</option>
                          <option value="Islamic">Islamic</option>
                          <option value="Political">Political</option>
                          <option value="Deep Thought & Thinking">Deep Thought & Thinking</option>
                          <option value="Design & Arts">Design & Arts</option>
                          <option value="Leadership">Leadership</option>
                          <option value="Philosophy">Philosophy</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 font-medium mb-1 block">
                          Cover Image (Supabase Storage) *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={coverUrl}
                            onChange={(e) => setCoverUrl(e.target.value)}
                            placeholder="Supabase storage image URL"
                            className="flex-1 px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs focus:border-white/30 focus:outline-none"
                            required
                          />
                          <label className="flex items-center gap-1 px-3 py-2.5 bg-white/10 border border-white/10 hover:bg-white/20 rounded-xl text-xs cursor-pointer shrink-0">
                            <Upload className="w-3.5 h-3.5" />
                            Upload Cover
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleCoverFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 font-medium mb-1 block">
                        PDF Document (Supabase Storage) *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={pdfUrl}
                          onChange={(e) => setPdfUrl(e.target.value)}
                          placeholder="Supabase storage PDF URL"
                          className="flex-1 px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs focus:border-white/30 focus:outline-none"
                          required
                        />
                        <label className="flex items-center gap-1.5 px-3 py-2.5 bg-white/10 border border-white/10 hover:bg-white/20 rounded-xl text-xs cursor-pointer shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          Upload PDF
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={handlePdfFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 font-medium mb-1 block">
                        Short Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="Provide a concise summary of the book content..."
                        className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs focus:border-white/30 focus:outline-none resize-none"
                      />
                    </div>

                    {statusMsg && (
                      <div
                        className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                          statusMsg.toLowerCase().includes('fail') || statusMsg.toLowerCase().includes('error')
                            ? 'bg-red-500/10 border-red-500/30 text-red-400'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        }`}
                      >
                        {statusMsg.toLowerCase().includes('fail') || statusMsg.toLowerCase().includes('error') ? (
                          <X className="w-4 h-4 shrink-0 text-red-400" />
                        ) : (
                          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                        )}
                        <span className="break-words">{statusMsg}</span>
                      </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isUploading}
                        className="px-5 py-2 rounded-xl bg-[#E1E0CC] text-black font-medium text-xs hover:bg-white transition disabled:opacity-50 cursor-pointer"
                      >
                        {editingBook ? 'Save Changes' : 'Publish Book'}
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* Published Books List */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                    Supabase Database Records
                  </h3>

                  {books.length === 0 ? (
                    <div className="p-6 text-center text-xs text-gray-500 border border-dashed border-white/10 rounded-2xl">
                      No books found in Supabase Database. Click "Add New Book" above to publish your first PDF book.
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5 border border-white/10 rounded-2xl overflow-hidden bg-black/40">
                      {books.map((b) => (
                        <div
                          key={b.id}
                          className="p-4 flex items-center justify-between gap-4 hover:bg-white/5 transition"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <img
                              src={b.cover_image}
                              alt={b.title}
                              className="w-10 h-14 object-cover rounded border border-white/10 shrink-0"
                              loading="lazy"
                            />
                            <div className="min-w-0">
                              <h4 className="text-sm font-medium text-white truncate">
                                {b.title}
                              </h4>
                              <p className="text-xs text-gray-400 truncate">
                                {b.author} • {b.category}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {confirmDeleteId === b.id ? (
                              <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 p-1 rounded-xl">
                                <span className="text-[11px] text-red-300 font-medium px-1.5">
                                  Delete?
                                </span>
                                <button
                                  type="button"
                                  onClick={() => executeDeleteBook(b.id, b.title)}
                                  disabled={deletingBookId === b.id}
                                  className="px-2.5 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium text-xs transition disabled:opacity-50 cursor-pointer flex items-center gap-1"
                                >
                                  {deletingBookId === b.id ? (
                                    <Sparkles className="w-3 h-3 animate-spin" />
                                  ) : (
                                    'Confirm'
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  disabled={deletingBookId === b.id}
                                  className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 text-xs transition cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => setEditingBook(b)}
                                  className="p-2 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition cursor-pointer"
                                  title="Edit Book"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteId(b.id)}
                                  className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition cursor-pointer"
                                  title="Delete Book"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }
);

AdminModal.displayName = 'AdminModal';
