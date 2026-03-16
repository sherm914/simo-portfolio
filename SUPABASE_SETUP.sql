-- SUPABASE DATABASE SETUP
-- Copy and paste the SQL below into your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard → Your Project → SQL Editor → New Query

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create portfolio_items table
CREATE TABLE portfolio_items (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('Directing', 'Editorial', 'VFX', 'Production')),
  type TEXT NOT NULL CHECK (type IN ('MUSIC VIDEO', 'COMMERCIAL', 'NARRATIVE')),
  featured BOOLEAN DEFAULT false,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  video_url TEXT
);

-- 3. Create indexes for faster queries
CREATE INDEX idx_portfolio_category ON portfolio_items(category);
CREATE INDEX idx_portfolio_featured ON portfolio_items(featured);
CREATE INDEX idx_portfolio_slug ON portfolio_items(slug);

-- 4. Enable RLS (Row Level Security)
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- 5. Create policies for public read access
CREATE POLICY "Allow public read access" ON portfolio_items
  FOR SELECT USING (true);

-- 6. Allow all inserts/updates/deletes for now (we'll add auth later)
CREATE POLICY "Allow all inserts" ON portfolio_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all updates" ON portfolio_items
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow all deletes" ON portfolio_items
  FOR DELETE USING (true);

-- 7. Create storage bucket for media files
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

-- 8. Set storage policies
CREATE POLICY "Public access to portfolio-media" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-media');

CREATE POLICY "Allow uploads to portfolio-media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'portfolio-media');

CREATE POLICY "Allow updates to portfolio-media" ON storage.objects
  FOR UPDATE USING (bucket_id = 'portfolio-media') WITH CHECK (bucket_id = 'portfolio-media');

CREATE POLICY "Allow deletes from portfolio-media" ON storage.objects
  FOR DELETE USING (bucket_id = 'portfolio-media');

-- 9. Insert sample data (optional - you can delete this and add your own)
INSERT INTO portfolio_items (title, description, category, type, featured, slug)
VALUES
  ('Project Title 1', 'Brief description of your project', 'Directing', 'MUSIC VIDEO', true, 'project-title-1'),
  ('Project Title 2', 'Brief description of your project', 'VFX', 'COMMERCIAL', true, 'project-title-2'),
  ('Project Title 3', 'Brief description of your project', 'Production', 'NARRATIVE', true, 'project-title-3')
ON CONFLICT DO NOTHING;

-- Done! Your database is ready.
-- You can now use the Supabase client to fetch and manage data.
