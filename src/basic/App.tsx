import { useState, useCallback } from 'react';
import { useDebounce } from './utils/hooks/useDebounce';
import { useCart } from './hooks/useCart';
import { useProducts } from './hooks/useProducts';
import { CartPage } from './components/CartPage';
import { AdminPage } from './components/AdminPage';
import { Header } from './components/Header';
import { UIToast } from './components/ui/UIToast';
import { NOTIFICATION_DURATION, SEARCH_DEBOUNCE_DELAY } from './constants';

interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

const App = () => {
  const { products } = useProducts();
  const {
    cart,
    totalItemCount,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    clearCoupon,
    clearCart,
    calculateItemTotal,
    calculateCartTotal,
    getRemainingStock,
  } = useCart(products);

  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_DELAY);

  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, NOTIFICATION_DURATION);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <UIToast notifications={notifications} onRemove={removeNotification} />

      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        cartLength={cart.length}
        totalItemCount={totalItemCount}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
        onSearchChange={setSearchTerm}
      />

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage onNotification={addNotification} />
        ) : (
          <CartPage
            searchTerm={debouncedSearchTerm}
            onNotification={addNotification}
            cart={cart}
            selectedCoupon={selectedCoupon}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            applyCoupon={applyCoupon}
            clearCoupon={clearCoupon}
            clearCart={clearCart}
            calculateItemTotal={calculateItemTotal}
            calculateCartTotal={calculateCartTotal}
            getRemainingStock={getRemainingStock}
          />
        )}
      </main>
    </div>
  );
};

export default App;
