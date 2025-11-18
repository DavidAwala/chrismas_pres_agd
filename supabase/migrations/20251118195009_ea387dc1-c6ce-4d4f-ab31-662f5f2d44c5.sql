-- Create table for personalized gift messages
CREATE TABLE IF NOT EXISTS public.gift_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  recipient_name TEXT NOT NULL,
  sender_name TEXT,
  relation TEXT,
  message TEXT NOT NULL,
  image_url TEXT,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gift_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read gift messages (public feature)
CREATE POLICY "Anyone can view gift messages"
  ON public.gift_messages
  FOR SELECT
  USING (true);

-- Allow anyone to insert gift messages
CREATE POLICY "Anyone can create gift messages"
  ON public.gift_messages
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update likes
CREATE POLICY "Anyone can update gift messages"
  ON public.gift_messages
  FOR UPDATE
  USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_gift_messages_updated_at
  BEFORE UPDATE ON public.gift_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create storage bucket for gift images
INSERT INTO storage.buckets (id, name, public)
VALUES ('gift-images', 'gift-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for gift images
CREATE POLICY "Anyone can view gift images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'gift-images');

CREATE POLICY "Anyone can upload gift images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'gift-images');

-- Create index for faster slug lookups
CREATE INDEX idx_gift_messages_slug ON public.gift_messages(slug);