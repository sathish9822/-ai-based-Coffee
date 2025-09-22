import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Star } from 'lucide-react';
import { CoffeeItem } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { Button } from '../UI/Button';
import toast from 'react-hot-toast';

interface MenuCardProps {
  item: CoffeeItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  const categoryColors = {
    espresso: 'bg-red-100 text-red-800',
    latte: 'bg-orange-100 text-orange-800',
    cappuccino: 'bg-yellow-100 text-yellow-800',
    americano: 'bg-blue-100 text-blue-800',
    special: 'bg-purple-100 text-purple-800',
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[item.category]}`}>
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </span>
        </div>
        {!item.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">4.8</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-amber-600">
            ${item.price.toFixed(2)}
          </span>
          
          <Button
            onClick={handleAddToCart}
            disabled={!item.available}
            size="sm"
            className="flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add to Cart</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}