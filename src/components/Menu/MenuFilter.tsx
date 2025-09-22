import React from 'react';
import { motion } from 'framer-motion';

interface MenuFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function MenuFilter({ categories, selectedCategory, onCategoryChange }: MenuFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <motion.button
          key={category}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category
              ? 'bg-amber-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-amber-100 hover:text-amber-700'
          }`}
        >
          {category === 'all' ? 'All Items' : category.charAt(0).toUpperCase() + category.slice(1)}
        </motion.button>
      ))}
    </div>
  );
}