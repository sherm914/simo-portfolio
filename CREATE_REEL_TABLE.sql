-- Create reel table for storing the landing page reel video
CREATE TABLE IF NOT EXISTS site_reel (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_url TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by TEXT
);

-- Enable RLS
ALTER TABLE site_reel ENABLE ROW LEVEL SECURITY;

-- Policy: Public read
CREATE POLICY "Allow public read"
  ON site_reel FOR SELECT
  USING (true);

-- Policy: Allow authenticated updates
CREATE POLICY "Allow authenticated update"
  ON site_reel FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Insert initial empty row if doesn't exist
INSERT INTO site_reel (video_url) VALUES ('') 
ON CONFLICT DO NOTHING;
