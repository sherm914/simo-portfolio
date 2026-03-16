-- Add new columns to portfolio_items table for roles, about, and BTS content
-- Run this SQL in your Supabase dashboard: SQL Editor > New Query > Paste this > Run

ALTER TABLE portfolio_items
ADD COLUMN roles TEXT,
ADD COLUMN about TEXT,
ADD COLUMN bts_image_1 TEXT,
ADD COLUMN bts_image_2 TEXT,
ADD COLUMN bts_image_3 TEXT,
ADD COLUMN bts_video_url TEXT;
