-- Add ordering support to portfolio_items
ALTER TABLE portfolio_items
ADD COLUMN display_order INTEGER DEFAULT 0;

-- Create index for faster sorting
CREATE INDEX idx_display_order ON portfolio_items(display_order);

-- Auto-assign ordering to existing items (by creation date)
UPDATE portfolio_items
SET display_order = (
  SELECT COUNT(*) FROM portfolio_items p2
  WHERE p2.created_at <= portfolio_items.created_at
) - 1;
