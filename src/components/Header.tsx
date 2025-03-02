import { useState } from 'react';
import { Music2, LogOut, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { auth } from '../services/firebaseService';
import CartDrawer from './CartDrawer';

export default function Header() {
  const { currentUser } = useAuth();
  const { items } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const itemCount = items.length;

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-navy-900/95 backdrop-blur-sm text-white py-4 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          <Music2 className="w-8 h-8 text-blue-400" />
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Ateker Music
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/music" className="hover:text-blue-400 transition">Music</Link>
          <Link to="/artists" className="hover:text-blue-400 transition">Artists</Link>
          <Link to="/news" className="hover:text-blue-400 transition">News</Link>
          <Link to="/events" className="hover:text-blue-400 transition">Events</Link>
        </nav>

        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-gray-400 hover:text-blue-400 transition"
              >
                <ShoppingCart className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
              {currentUser.role === 'artist' && (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-blue-400 hover:text-blue-300 transition"
                >
                  Dashboard
                </Link>
              )}
              {currentUser.role === 'admin' && (
                <Link
                  to="/admin"
                  className="px-4 py-2 text-blue-400 hover:text-blue-300 transition"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <>
              <Link 
                to="/signin" 
                className="px-4 py-2 text-blue-400 hover:text-blue-300 transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}