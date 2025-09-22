/*
  # Insert sample coffee items

  1. Sample Data
    - Insert popular coffee items with realistic prices and descriptions
    - Include various categories: espresso, latte, cappuccino, americano, special
*/

INSERT INTO coffee_items (name, description, price, image_url, category, available) VALUES
  ('Classic Espresso', 'Rich and bold espresso shot with perfect crema', 3.50, 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg', 'espresso', true),
  ('Double Espresso', 'Double shot of our signature espresso blend', 4.25, 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg', 'espresso', true),
  ('Caramel Macchiato', 'Smooth espresso with steamed milk and caramel drizzle', 5.25, 'https://images.pexels.com/photos/373639/pexels-photo-373639.jpeg', 'latte', true),
  ('Vanilla Latte', 'Creamy latte with vanilla syrup and perfect foam art', 4.95, 'https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg', 'latte', true),
  ('Hazelnut Latte', 'Smooth latte with hazelnut syrup and steamed milk', 5.00, 'https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg', 'latte', true),
  ('Traditional Cappuccino', 'Equal parts espresso, steamed milk, and foam', 4.25, 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg', 'cappuccino', true),
  ('Cinnamon Cappuccino', 'Classic cappuccino with a dash of cinnamon', 4.50, 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg', 'cappuccino', true),
  ('House Americano', 'Double shot espresso with hot water', 3.75, 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg', 'americano', true),
  ('Iced Americano', 'Cold americano served over ice', 4.00, 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg', 'americano', true),
  ('Mocha Delight', 'Espresso with chocolate syrup and whipped cream', 5.50, 'https://images.pexels.com/photos/414720/pexels-photo-414720.jpeg', 'special', true),
  ('White Chocolate Mocha', 'Rich espresso with white chocolate and steamed milk', 5.75, 'https://images.pexels.com/photos/414720/pexels-photo-414720.jpeg', 'special', true),
  ('Seasonal Pumpkin Spice', 'Limited edition pumpkin spice latte with whipped cream', 5.95, 'https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg', 'special', true);