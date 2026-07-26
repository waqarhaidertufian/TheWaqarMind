-- ============================================================
-- SUPABASE SCHEMA FOR THEWAQARMIND DIGITAL LIBRARY
-- ============================================================

-- 1. Create Books Table
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    author TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Mindset & Growth',
    cover_image TEXT NOT NULL,
    pdf_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- 2. RLS Policies for Books Table
-- Allow visitors (public) to view/read all books
CREATE POLICY "Public Read Access for Books" 
ON public.books 
FOR SELECT 
USING (true);

-- Allow authenticated users / admins to insert new books
CREATE POLICY "Admin Insert Access for Books" 
ON public.books 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users / admins to update existing books
CREATE POLICY "Admin Update Access for Books" 
ON public.books 
FOR UPDATE 
TO authenticated 
USING (auth.role() = 'authenticated');

-- Allow authenticated users / admins to delete books
CREATE POLICY "Admin Delete Access for Books" 
ON public.books 
FOR DELETE 
TO authenticated 
USING (auth.role() = 'authenticated');

-- 3. Storage Bucket Configuration for 'books'
-- Run this in Supabase Storage SQL or create 'books' bucket in Supabase Dashboard -> Storage
INSERT INTO storage.buckets (id, name, public) 
VALUES ('books', 'books', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for Storage Bucket 'books'
CREATE POLICY "Public Storage Read Access" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'books');

CREATE POLICY "Admin Storage Insert Access" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'books' AND auth.role() = 'authenticated');

CREATE POLICY "Admin Storage Update Access" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'books' AND auth.role() = 'authenticated');

CREATE POLICY "Admin Storage Delete Access" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'books' AND auth.role() = 'authenticated');
