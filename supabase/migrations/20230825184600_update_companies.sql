-- Add Facebook page fields to companies table
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS facebook_page_id TEXT,
ADD COLUMN IF NOT EXISTS facebook_page_name TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS companies_facebook_page_id_idx ON companies(facebook_page_id);
