import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { AuthForm } from './components/Auth/AuthForm';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  style: {
                    background: '#10B981',
                  },
                },
                error: {
                  style: {
                    background: '#EF4444',
                  },
                },
              }}
            />
            
            <Routes>
              <Route 
                path="/*" 
                element={
                  <>
                    <Header />
                    <main>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/menu" element={<MenuPage />} />
                        <Route path="/auth" element={<AuthForm />} />
                        <Route 
                          path="/checkout" 
                          element={
                            <ProtectedRoute>
                              <CheckoutPage />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/orders" 
                          element={
                            <ProtectedRoute>
                              <OrdersPage />
                            </ProtectedRoute>
                          } 
                        />
                      </Routes>
                    </main>
                    <Footer />
                  </>
                }
              />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;