-- Create contact_page table for managing dynamic contact page content
CREATE TABLE IF NOT EXISTS contact_page (
  id SERIAL PRIMARY KEY,
  profile_image_url TEXT,
  about_text TEXT,
  skills TEXT[],
  contact_email TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a default row if the table is empty
INSERT INTO contact_page (id, profile_image_url, about_text, skills, contact_email, social_links)
VALUES (
  1,
  '',
  '',
  ARRAY[]::TEXT[],
  '',
  '{}'::jsonb
)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE contact_page ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read" ON contact_page;
DROP POLICY IF EXISTS "Allow public update" ON contact_page;

-- Create policies for public read access
CREATE POLICY "Allow public read" ON contact_page
  FOR SELECT USING (true);

-- Create policies for public update access (for admin dashboard)
-- This allows anyone to update for now - you can restrict further by checking JWT claims
CREATE POLICY "Allow public update" ON contact_page
  FOR UPDATE USING (true)
  WITH CHECK (true);
