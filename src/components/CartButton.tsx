import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export default function CartButton() {
  const { items } = useCart();
  const itemCount = items.length;

  return (
    <button className="relative p-2 text-gray-400 hover:text-blue-400 transition">
      <ShoppingCart className="w-6 h-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
}