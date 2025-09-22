import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, Coffee, Package, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Order } from '../types';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Sample orders data for demonstration
  const sampleOrders: Order[] = [
    {
      id: '1',
      user_id: user?.id || '',
      items: [
        {
          id: '1',
          coffee_item_id: '1',
          coffee_item: {
            id: '1',
            name: 'Caramel Macchiato',
            description: 'Rich espresso with caramel',
            price: 5.25,
            image_url: 'https://images.pexels.com/photos/373639/pexels-photo-373639.jpeg',
            category: 'latte',
            available: true,
            created_at: new Date().toISOString()
          },
          quantity: 2,
          price: 5.25
        }
      ],
      total_amount: 10.50,
      status: 'preparing',
      payment_status: 'paid',
      order_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      pickup_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
    },
    {
      id: '2',
      user_id: user?.id || '',
      items: [
        {
          id: '2',
          coffee_item_id: '2',
          coffee_item: {
            id: '2',
            name: 'Vanilla Latte',
            description: 'Smooth vanilla latte',
            price: 4.95,
            image_url: 'https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg',
            category: 'latte',
            available: true,
            created_at: new Date().toISOString()
          },
          quantity: 1,
          price: 4.95
        }
      ],
      total_amount: 4.95,
      status: 'completed',
      payment_status: 'paid',
      order_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      pickup_time: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(), // 23 hours ago
    }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            coffee_item:coffee_items (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        // Fallback to sample data
        setOrders(sampleOrders);
        toast.error('Using sample data - database not configured');
      } else {
        // Transform the data to match our Order type
        const transformedOrders = data.map(order => ({
          ...order,
          items: order.order_items.map(item => ({
            id: item.id,
            coffee_item_id: item.coffee_item_id,
            coffee_item: item.coffee_item,
            quantity: item.quantity,
            price: item.price,
            customizations: item.customizations
          }))
        }));
        setOrders(transformedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Fallback to sample data
      setOrders(sampleOrders);
      toast.error('Using sample data - database error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'preparing':
        return <Coffee className="h-5 w-5 text-blue-500" />;
      case 'ready':
        return <Package className="h-5 w-5 text-purple-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>

          {orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Coffee className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
              <p className="text-gray-600 mb-6">
                Start your coffee journey by placing your first order!
              </p>
              <a
                href="/menu"
                className="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
              >
                Browse Menu
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                        <p className="text-amber-100 text-sm">
                          {new Date(order.order_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                        {getStatusIcon(order.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="p-6">
                    {/* Items */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Items Ordered</h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3">
                            <img
                              src={item.coffee_item.image_url}
                              alt={item.coffee_item.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">
                                {item.coffee_item.name}
                              </h5>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity} × ${item.price.toFixed(2)}
                              </p>
                            </div>
                            <span className="font-semibold text-amber-600">
                              ${(item.quantity * item.price).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Pickup Time:</span>{' '}
                          {order.pickup_time ? new Date(order.pickup_time).toLocaleString() : 'Not specified'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Payment:</span>{' '}
                          <span className={order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}>
                            {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-amber-600">
                          ${order.total_amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">Total</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}