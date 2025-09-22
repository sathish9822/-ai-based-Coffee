import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { CreditCard, MapPin, Clock, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/UI/Button';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

interface CheckoutFormData {
  pickupTime: string;
  notes?: string;
  paymentMethod: 'card' | 'cash';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
}

export function CheckoutPage() {
  const [processing, setProcessing] = useState(false);
  const { state: cartState, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutFormData>({
    defaultValues: {
      paymentMethod: 'card'
    }
  });

  const paymentMethod = watch('paymentMethod');

  // Redirect if cart is empty
  React.useEffect(() => {
    if (cartState.items.length === 0) {
      navigate('/menu');
      toast.error('Your cart is empty');
    }
  }, [cartState.items.length, navigate]);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
      toast.error('Please sign in to continue');
    }
  }, [user, navigate]);

  const onSubmit = async (data: CheckoutFormData) => {
    setProcessing(true);
    
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: cartState.total,
          status: 'confirmed',
          payment_status: data.paymentMethod === 'card' ? 'paid' : 'pending',
          pickup_time: data.pickupTime,
          notes: data.notes
        })
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // Create order items
      const orderItems = cartState.items.map(item => ({
        order_id: order.id,
        coffee_item_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw itemsError;
      }
      
      // Clear cart and show success
      clearCart();
      toast.success('Order placed successfully!');
      
      // Navigate to orders page
      navigate('/orders');
      
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error('Failed to process order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (cartState.items.length === 0) {
    return <LoadingSpinner className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6">
            <h1 className="text-2xl font-bold">Complete Your Order</h1>
            <p className="text-amber-100 mt-2">Review your items and provide pickup details</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Order Summary
                </h2>
                
                <div className="space-y-3 mb-6">
                  {cartState.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-amber-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-amber-600">${cartState.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Form */}
              <div className="space-y-6">
                {/* Pickup Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline mr-1 h-4 w-4" />
                    Pickup Time
                  </label>
                  <input
                    {...register('pickupTime', { required: 'Pickup time is required' })}
                    type="datetime-local"
                    min={new Date(Date.now() + 30 * 60000).toISOString().slice(0, 16)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  />
                  {errors.pickupTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.pickupTime.message}</p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Any special requests or notes for your order..."
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <CreditCard className="inline mr-1 h-4 w-4" />
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        {...register('paymentMethod')}
                        type="radio"
                        value="card"
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span className="ml-2">Credit/Debit Card</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        {...register('paymentMethod')}
                        type="radio"
                        value="cash"
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span className="ml-2">Pay at Pickup</span>
                    </label>
                  </div>
                </div>

                {/* Card Details */}
                {paymentMethod === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        {...register('cardNumber', {
                          required: paymentMethod === 'card' ? 'Card number is required' : false
                        })}
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                      />
                      {errors.cardNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          {...register('expiryDate', {
                            required: paymentMethod === 'card' ? 'Expiry date is required' : false
                          })}
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                        />
                        {errors.expiryDate && (
                          <p className="mt-1 text-sm text-red-600">{errors.expiryDate.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          {...register('cvv', {
                            required: paymentMethod === 'card' ? 'CVV is required' : false
                          })}
                          type="text"
                          placeholder="123"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                        />
                        {errors.cvv && (
                          <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        {...register('cardholderName', {
                          required: paymentMethod === 'card' ? 'Cardholder name is required' : false
                        })}
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                      />
                      {errors.cardholderName && (
                        <p className="mt-1 text-sm text-red-600">{errors.cardholderName.message}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  loading={processing}
                  disabled={processing}
                >
                  {processing ? 'Processing...' : `Place Order - $${cartState.total.toFixed(2)}`}
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}