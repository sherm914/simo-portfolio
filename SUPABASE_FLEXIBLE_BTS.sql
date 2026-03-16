-- Replace fixed BTS columns with flexible array columns
-- This allows unlimited BTS images and videos per project
-- Run this SQL in your Supabase dashboard: SQL Editor > New Query > Paste this > Run

-- Remove old fixed columns
ALTER TABLE portfolio_items DROP COLUMN IF EXISTS bts_image_1;
ALTER TABLE portfolio_items DROP COLUMN IF EXISTS bts_image_2;
ALTER TABLE portfolio_items DROP COLUMN IF EXISTS bts_image_3;
ALTER TABLE portfolio_items DROP COLUMN IF EXISTS bts_video_url;

-- Add flexible array columns with defaults
ALTER TABLE portfolio_items
ADD COLUMN bts_images TEXT[] DEFAULT '{}',
ADD COLUMN bts_videos TEXT[] DEFAULT '{}';
