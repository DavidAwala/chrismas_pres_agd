-- Add view tracking to gift_messages table
ALTER TABLE public.gift_messages 
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS sender_email TEXT;

-- Create gift templates table
CREATE TABLE IF NOT EXISTS public.gift_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  message_template TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on templates
ALTER TABLE public.gift_templates ENABLE ROW LEVEL SECURITY;

-- Anyone can view templates
CREATE POLICY "Anyone can view gift templates"
  ON public.gift_templates
  FOR SELECT
  USING (true);

-- Insert some default templates
INSERT INTO public.gift_templates (title, category, message_template, image_url) VALUES
('Warm Wishes', 'Family', 'Dear {name},

Wishing you a Christmas filled with warmth, love, and cherished moments. May this festive season bring you joy and beautiful memories to treasure.

With love and warm wishes,
{sender}', NULL),

('Joyful Season', 'Friends', 'Hey {name}!

Merry Christmas! Hope your holidays are as amazing as you are. Looking forward to making more memories together in the new year!

Cheers,
{sender}', NULL),

('Gratitude & Love', 'Family', 'Dearest {name},

This Christmas, I want you to know how grateful I am to have you in my life. Your love, support, and kindness mean the world to me. Wishing you all the happiness this season brings.

Love always,
{sender}', NULL),

('Festive Cheer', 'General', 'To {name},

May your days be merry and bright! Sending you festive cheer and warm wishes for a wonderful Christmas and a happy, healthy New Year.

Best wishes,
{sender}', NULL),

('Special Blessing', 'Religious', 'Dear {name},

May the miracle of Christmas fill your heart with joy and peace. May God bless you abundantly this season and always.

Merry Christmas,
{sender}', NULL);

-- Create function to increment views
CREATE OR REPLACE FUNCTION public.increment_gift_views(gift_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.gift_messages
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = gift_id;
END;
$$;