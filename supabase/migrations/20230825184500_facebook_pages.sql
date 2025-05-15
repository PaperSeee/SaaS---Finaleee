-- Create facebook_pages table
CREATE TABLE IF NOT EXISTS facebook_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  fb_page_id TEXT NOT NULL,
  fb_page_name TEXT NOT NULL,
  fb_page_access_token TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create an RLS policy to allow users to see only their own pages
ALTER TABLE facebook_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own facebook pages" 
  ON facebook_pages FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own facebook pages" 
  ON facebook_pages FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own facebook pages" 
  ON facebook_pages FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own facebook pages" 
  ON facebook_pages FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX facebook_pages_user_id_idx ON facebook_pages(user_id);
CREATE INDEX facebook_pages_company_id_idx ON facebook_pages(company_id);
