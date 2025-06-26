import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { Toaster } from '@/components/ui/toaster';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import SearchPage from './pages/SearchPage';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Router>
              <ScrollToTop />
              <div className="min-h-screen bg-gray-50">
                <Routes>
                  {/* Admin route without navbar/footer */}
                  <Route path="/admin" element={<AdminPanel />} />
                  
                  {/* Regular routes with navbar/footer */}
                  <Route path="/*" element={
                    <>
                      <Navbar />
                      <main className="flex-1">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/product/:id" element={<ProductPage />} />
                          <Route path="/category/:category" element={<CategoryPage />} />
                          <Route path="/cart" element={<CartPage />} />
                          <Route path="/checkout" element={<CheckoutPage />} />
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/register" element={<RegisterPage />} />
                          <Route path="/account" element={<AccountPage />} />
                          <Route path="/search" element={<SearchPage />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                      <Footer />
                    </>
                  } />
                </Routes>
              </div>
              <Toaster />
            </Router>
          </CartProvider>
        </WishlistProvider>
      </AdminAuthProvider>
    </AuthProvider>
  );
};

export default App;