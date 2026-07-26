import { Book } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const bookService = {
  // Fetch all books from Supabase Database
  async fetchBooks(): Promise<Book[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        console.log('[Supabase DB Query]: Fetching books from public.books table...');
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('[Supabase DB Fetch Failure]:', error.message, error);
          return [];
        }

        const count = data?.length || 0;
        console.log(`Fetched books count: ${count}`);

        if (count === 0) {
          console.warn(
            '[Supabase DB Warning]: Fetched books count is 0. The "public.books" table currently contains zero rows. ' +
            'Use the Library Administration modal to upload and publish new books, or run /supabase/schema.sql in your Supabase SQL Editor if the table schema needs initialization.'
          );
        } else {
          console.log('[Supabase DB Fetch Success]: Successfully retrieved books from public.books:', data);
        }

        return (data as Book[]) || [];
      } catch (err: any) {
        console.error('[Supabase DB Query Error]:', err?.message || err);
        return [];
      }
    }

    console.warn('[Supabase DB Warning]: Fetched books count: 0 (Supabase is not configured with valid URL/Key).');
    return [];
  },

  // Add a new book row to Supabase Database
  async addBook(book: Omit<Book, 'id' | 'created_at'>): Promise<Book | null> {
    if (!isSupabaseConfigured || !supabase) {
      const err = new Error('Supabase is not configured. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      console.error('[Supabase DB Insert Failure]:', err.message);
      throw err;
    }

    const payload = {
      title: book.title,
      description: book.description || '',
      author: book.author,
      category: book.category || 'Mindset & Growth',
      cover_image: book.cover_image,
      pdf_url: book.pdf_url,
    };

    console.log('[Supabase DB Insert Start]: Calling addBook() with payload:', payload);

    const { data, error } = await supabase
      .from('books')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('[Supabase DB Insert Failure]: Error inserting into public.books table:', error.message, error);
      throw new Error(`Supabase DB Insert Error: ${error.message}${error.details ? ` (${error.details})` : ''}`);
    }

    console.log('[Supabase DB Insert Success]: Inserted row into public.books:', data);
    return data as Book;
  },

  // Update existing book in Supabase Database
  async updateBook(id: string, updates: Partial<Book>): Promise<Book | null> {
    if (!isSupabaseConfigured || !supabase) {
      const err = new Error('Supabase is not configured.');
      console.error('[Supabase DB Update Failure]:', err.message);
      throw err;
    }

    console.log(`[Supabase DB Update Start]: Updating book ID ${id}:`, updates);

    const { data, error } = await supabase
      .from('books')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[Supabase DB Update Failure]:', error.message, error);
      throw new Error(`Supabase DB Update Error: ${error.message}`);
    }

    console.log('[Supabase DB Update Success]: Updated book:', data);
    return data as Book;
  },

  // Delete book from Supabase Database
  async deleteBook(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      const err = new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      console.error('[Supabase DB Delete Failure]:', err.message);
      throw err;
    }

    console.log(`[Supabase DB Delete Start]: Executing DELETE query for book ID: "${id}"...`);

    const { error, count } = await supabase
      .from('books')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (error) {
      console.error('[Supabase DB Delete Failure]: Error deleting row from public.books:', error.message, error);
      throw new Error(`Supabase DB Delete Error: ${error.message}${error.details ? ` (${error.details})` : ''}`);
    }

    console.log(`[Supabase DB Delete Success]: Successfully deleted book row. Rows removed: ${count ?? 1}`);
    return true;
  },

  // Upload file directly to Supabase Storage bucket 'books'
  async uploadFile(file: File, folder: 'covers' | 'pdfs'): Promise<string> {
    if (!isSupabaseConfigured || !supabase) {
      const err = new Error('Supabase Storage is not configured.');
      console.error('[Supabase Storage Upload Failure]:', err.message);
      throw err;
    }

    const fileExt = file.name.split('.').pop() || 'bin';
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    console.log(`[Supabase Storage Upload Start]: Uploading file "${file.name}" (${file.size} bytes) to bucket "books", path: "${fileName}"...`);

    const { error: uploadError } = await supabase.storage
      .from('books')
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type || (folder === 'pdfs' ? 'application/pdf' : 'image/jpeg'),
      });

    if (uploadError) {
      console.error('[Supabase Storage Upload Failure]: Failed to upload to bucket "books":', uploadError.message, uploadError);
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from('books').getPublicUrl(fileName);
    if (!data?.publicUrl) {
      const err = new Error('Could not retrieve public URL for uploaded file.');
      console.error('[Supabase Storage Upload Failure]:', err.message);
      throw err;
    }

    console.log('[Supabase Storage Upload Success]: Uploaded file successfully. Public URL:', data.publicUrl);
    return data.publicUrl;
  }
};
