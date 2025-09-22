/*
  # Create coffee items table

  1. New Tables
    - `coffee_items`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text)
      - `price` (decimal, not null)
      - `image_url` (text)
      - `category` (text, not null)
      - `available` (boolean, default true)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `coffee_items` table
    - Add policy for everyone to read available items
    - Add policy for admins to manage items
*/

CREATE TABLE IF NOT EXISTS coffee_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  image_url text,
  category text NOT NULL CHECK (category IN ('espresso', 'latte', 'cappuccino', 'americano', 'special')),
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coffee_items ENABLE ROW LEVEL SECURITY;

-- Everyone can read available coffee items
CREATE POLICY "Anyone can read available coffee items"
  ON coffee_items
  FOR SELECT
  TO authenticated, anon
  USING (available = true);

-- Admins can manage all coffee items
CREATE POLICY "Admins can manage coffee items"
  ON coffee_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );