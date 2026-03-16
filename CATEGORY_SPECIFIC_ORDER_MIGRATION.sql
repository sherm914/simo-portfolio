-- Replace global display_order with per-category ordering
-- Step 1: Drop the old display_order column and index
DROP INDEX IF EXISTS idx_display_order;
ALTER TABLE portfolio_items DROP COLUMN IF EXISTS display_order;

-- Step 2: Add category_orders JSONB column
ALTER TABLE portfolio_items
ADD COLUMN category_orders JSONB DEFAULT '{
  "Directing": null,
  "Editorial": null,
  "VFX": null,
  "Production": null
}'::jsonb;

-- Initialize ordering for existing items based on when they were created
-- For each category a project belongs to, assign it an incrementing order
DO $$ 
DECLARE
  item RECORD;
  cat TEXT;
  cat_count INTEGER;
  new_orders JSONB;
BEGIN
  FOR item IN SELECT id, categories FROM portfolio_items ORDER BY created_at ASC LOOP
    new_orders := '{
      "Directing": null,
      "Editorial": null,
      "VFX": null,
      "Production": null
    }'::jsonb;
    
    FOR cat IN SELECT jsonb_array_elements_text(item.categories) LOOP
      cat_count := (
        SELECT COUNT(*) FROM portfolio_items p2 
        WHERE p2.id <= item.id 
        AND p2.categories @> jsonb_build_array(cat)
      ) - 1;
      
      new_orders := jsonb_set(new_orders, ARRAY[cat], to_jsonb(cat_count));
    END LOOP;
    
    UPDATE portfolio_items SET category_orders = new_orders WHERE id = item.id;
  END LOOP;
END $$;

-- Create index for faster queries
CREATE INDEX idx_category_orders ON portfolio_items USING gin(category_orders);
