-- Migration: Add support for multiple categories per project
-- This safely migrates existing single-category data to multi-category format

-- Step 1: Rename the old column
ALTER TABLE portfolio_items 
RENAME COLUMN category TO category_old;

-- Step 2: Create new categories column as JSONB array
ALTER TABLE portfolio_items 
ADD COLUMN categories JSONB DEFAULT '[]'::jsonb;

-- Step 3: Migrate existing data (convert single category to array)
UPDATE portfolio_items 
SET categories = CASE 
  WHEN category_old IS NOT NULL THEN jsonb_build_array(category_old)
  ELSE '[]'::jsonb
END;

-- Step 4: Drop the old column
ALTER TABLE portfolio_items 
DROP COLUMN category_old;

-- Verify the migration
-- SELECT id, title, categories FROM portfolio_items LIMIT 5;
