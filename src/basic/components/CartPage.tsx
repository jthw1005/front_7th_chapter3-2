import { useCallback } from 'react';
import { Coupon } from '../../types';
import { ProductWithUI } from '../models/product';
import { useProducts } from '../hooks/useProducts';
import { useCoupons } from '../hooks/useCoupons';
import { useCart } from '../hooks/useCart';
import { ProductCard } from './ProductCard';
import { Cart } from './Cart';
import { filterProductsBySearchTerm } from '../models/product';

interface CartPageProps {
  searchTerm: string;
  onNotification: (message: string, type: 'error' | 'success' | 'warning') => void;
}

export function CartPage({ searchTerm, onNotification }: CartPageProps) {
  const { products } = useProducts();
  const { coupons } = useCoupons();
  const {
    cart,
    selectedCoupon,
    addToCart: addToCartHook,
    removeFromCart: removeFromCartHook,
    updateQuantity: updateQuantityHook,
    applyCoupon: applyCouponHook,
    clearCoupon,
    clearCart,
    calculateItemTotal,
    calculateCartTotal,
    getRemainingStock,
  } = useCart(products);

  const formatPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.find((p) => p.id === productId);
      if (product && getRemainingStock(product) <= 0) {
        return 'SOLD OUT';
      }
    }
    return '\u20A9' + price.toLocaleString();
  };

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const result = addToCartHook(product);
      if (result.message) {
        onNotification(result.message, result.success ? 'success' : 'error');
      }
    },
    [addToCartHook, onNotification]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      removeFromCartHook(productId);
    },
    [removeFromCartHook]
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      const result = updateQuantityHook(productId, newQuantity);
      if (!result.success && result.message) {
        onNotification(result.message, 'error');
      }
    },
    [updateQuantityHook, onNotification]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const result = applyCouponHook(coupon);
      if (result.message) {
        onNotification(result.message, result.success ? 'success' : 'error');
      }
    },
    [applyCouponHook, onNotification]
  );

  const completeOrder = useCallback(() => {
    const orderNumber = 'ORD-' + Date.now();
    onNotification(
      '주문이 완료되었습니다. 주문번호: ' + orderNumber,
      'success'
    );
    clearCart();
  }, [onNotification, clearCart]);

  const totals = calculateCartTotal();
  const filteredProducts = filterProductsBySearchTerm(products, searchTerm);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <section>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              전체 상품
            </h2>
            <div className="text-sm text-gray-600">
              총 {products.length}개 상품
            </div>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                "{searchTerm}"에 대한 검색 결과가 없습니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  remainingStock={getRemainingStock(product)}
                  formatPrice={formatPrice}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="lg:col-span-1">
        <Cart
          cart={cart}
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          totals={totals}
          calculateItemTotal={calculateItemTotal}
          onRemoveFromCart={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onApplyCoupon={applyCoupon}
          onClearCoupon={clearCoupon}
          onCompleteOrder={completeOrder}
        />
      </div>
    </div>
  );
}

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  return (
    <div className="ml-8 flex-1 max-w-md">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="상품 검색..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
      />
    </div>
  );
}
