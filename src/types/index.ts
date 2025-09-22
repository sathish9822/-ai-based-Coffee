export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: 'customer' | 'admin';
  created_at: string;
}

export interface CoffeeItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: 'espresso' | 'latte' | 'cappuccino' | 'americano' | 'special';
  available: boolean;
  created_at: string;
}

export interface CartItem extends CoffeeItem {
  quantity: number;
  customizations?: string[];
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  order_date: string;
  pickup_time?: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  coffee_item_id: string;
  coffee_item: CoffeeItem;
  quantity: number;
  price: number;
  customizations?: string[];
}

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  payment_method: 'card' | 'cash';
  transaction_id?: string;
  created_at: string;
}