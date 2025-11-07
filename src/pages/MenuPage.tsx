import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CoffeeItem } from '../types';
import { MenuCard } from '../components/Menu/MenuCard';
import { MenuFilter } from '../components/Menu/MenuFilter';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

export function MenuPage() {
  const [items, setItems] = useState<CoffeeItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<CoffeeItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['all', 'espresso', 'latte', 'cappuccino', 'americano', 'special'];

  // Sample data for demonstration
  const sampleItems: CoffeeItem[] = [
    {
      id: '1',
      name: 'Classic Espresso',
      description: 'Rich and bold espresso shot with perfect crema',
      price: 3.50,
      image_url: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg',
      category: 'espresso',
      available: true,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Caramel Macchiato',
      description: 'Smooth espresso with steamed milk and caramel drizzle',
      price: 5.25,
      image_url: 'https://images.pexels.com/photos/373639/pexels-photo-373639.jpeg',
      category: 'latte',
      available: true,
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Vanilla Latte',
      description: 'Creamy latte with vanilla syrup and perfect foam art',
      price: 4.95,
      image_url: 'https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg',
      category: 'latte',
      available: true,
      created_at: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Traditional Cappuccino',
      description: 'Equal parts espresso, steamed milk, and foam',
      price: 4.25,
      image_url: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
      category: 'cappuccino',
      available: true,
      created_at: new Date().toISOString()
    },
    {
      id: '5',
      name: 'House Americano',
      description: 'Double shot espresso with hot water',
      price: 3.75,
      image_url: 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg',
      category: 'americano',
      available: true,
      created_at: new Date().toISOString()
    },
    {
      id: '6',
      name: 'Mocha Delight',
      description: 'Espresso with chocolate syrup and whipped cream',
      price: 5.50,
      image_url: 'https://images.pexels.com/photos/414720/pexels-photo-414720.jpeg',
      category: 'special',
      available: true,
      created_at: new Date().toISOString()
    },
    {
      id: '7',
      name: 'Iced Coffee',
      description: 'Cold brew coffee served over ice',
      price: 4.00,
      image_url: 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg',
      category: 'americano',
      available: true,
      created_at: new Date().toISOString()
    },
    {
      id: '8',
      name: 'Hazelnut Latte',
      description: 'Smooth latte with hazelnut syrup',
      price: 5.00,
      image_url: 'https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg',
      category: 'latte',
      available: true,
      created_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, selectedCategory, searchTerm]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.warn('Supabase environment variables not configured, using sample data');
        setItems(sampleItems);
        toast.error('Using sample data - Supabase not configured');
        return;
      }

      const { data, error } = await supabase
        .from('coffee_items')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching menu items:', error);
        // Fallback to sample data if database is not set up
        setItems(sampleItems);
        toast.error('Using sample data - database not configured');
      } else {
        setItems(data || []);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      // Fallback to sample data
      setItems(sampleItems);
      toast.error('Using sample data - database error');
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading our delicious menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-amber-600 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold mb-4">Our Coffee Menu</h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              Discover our carefully crafted selection of premium coffee drinks, 
              each made with love and the finest ingredients
            </p>
          </motion.div>
        </div>
      </section>

      {/* Menu Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filter */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for coffee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <MenuFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          {/* Menu Items Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No items found matching your criteria.</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MenuCard item={item} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}