-- Google OAuth Tokens & PO History Schema
-- This extends the existing schema to support custom Google OAuth flow

-- Drop existing user_integrations if needed and recreate with OAuth token fields
DROP TABLE IF EXISTS public.google_integrations CASCADE;

-- Create google_integrations table for storing OAuth tokens
CREATE TABLE public.google_integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expiry TIMESTAMP WITH TIME ZONE,
  scopes TEXT[] DEFAULT ARRAY['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/spreadsheets'],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create po_history table as specified
CREATE TABLE public.po_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  po_number TEXT NOT NULL,
  description TEXT,
  amount NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.google_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.po_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for google_integrations
CREATE POLICY "Users can view own Google integrations" 
  ON public.google_integrations FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own Google integrations" 
  ON public.google_integrations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own Google integrations" 
  ON public.google_integrations FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own Google integrations" 
  ON public.google_integrations FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for po_history
CREATE POLICY "Users can view own PO history" 
  ON public.po_history FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own PO history" 
  ON public.po_history FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own PO history" 
  ON public.po_history FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own PO history" 
  ON public.po_history FOR DELETE 
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_google_integrations_user_id ON public.google_integrations(user_id);
CREATE INDEX idx_google_integrations_active ON public.google_integrations(user_id, is_active);
CREATE INDEX idx_po_history_user_id ON public.po_history(user_id);
CREATE INDEX idx_po_history_created_at ON public.po_history(created_at DESC);
CREATE INDEX idx_po_history_po_number ON public.po_history(po_number);

-- Enable Realtime for po_history table
ALTER PUBLICATION supabase_realtime ADD TABLE public.po_history;

-- Function to update google_integrations timestamp
CREATE OR REPLACE FUNCTION update_google_integrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
CREATE TRIGGER google_integrations_updated_at
  BEFORE UPDATE ON public.google_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_google_integrations_updated_at();

-- Sample data for testing (optional)
-- Insert sample PO history entries for existing test users
INSERT INTO public.po_history (user_id, po_number, description, amount, created_at)
SELECT 
  id,
  'PO-2024-TEST-001',
  'Office Equipment Purchase',
  25000.00,
  NOW() - INTERVAL '2 days'
FROM auth.users
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.po_history (user_id, po_number, description, amount, created_at)
SELECT 
  id,
  'PO-2024-TEST-002',
  'Software Licenses Renewal',
  45000.50,
  NOW() - INTERVAL '1 day'
FROM auth.users
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.po_history (user_id, po_number, description, amount, created_at)
SELECT 
  id,
  'PO-2024-TEST-003',
  'Marketing Materials',
  12500.75,
  NOW()
FROM auth.users
LIMIT 1
ON CONFLICT DO NOTHING;