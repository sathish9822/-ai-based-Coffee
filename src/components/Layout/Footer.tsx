import React from 'react';
import { Coffee, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Coffee className="h-8 w-8 text-amber-500" />
              <span className="text-2xl font-bold">BrewMaster</span>
            </div>
            <p className="text-gray-300 mb-6">
              Crafting exceptional coffee experiences one cup at a time. From artisanal 
              roasting to the perfect brew, we're passionate about delivering the finest 
              coffee to our community.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-amber-500 transition-colors">
                Facebook
              </a>
              <a href="#" className="text-gray-300 hover:text-amber-500 transition-colors">
                Instagram
              </a>
              <a href="#" className="text-gray-300 hover:text-amber-500 transition-colors">
                Twitter
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/menu" className="text-gray-300 hover:text-amber-500 transition-colors">
                  Our Menu
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-amber-500 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-amber-500 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/careers" className="text-gray-300 hover:text-amber-500 transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-amber-500" />
                <span className="text-gray-300">123 Coffee Street, Brew City</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-amber-500" />
                <span className="text-gray-300">(555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-amber-500" />
                <span className="text-gray-300">hello@brewmaster.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            &copy; 2025 BrewMaster Coffee Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}