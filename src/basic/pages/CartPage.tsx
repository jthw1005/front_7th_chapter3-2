import { useCallback } from 'react';
import { CartItem, Coupon } from '../../types';
import { ProductWithUI } from '../models/product';
import { useProducts } from '../hooks/useProducts';
import { useCoupons } from '../hooks/useCoupons';

import { ProductList } from '../components/product/ProductList';
import { EmptySearchResult } from '../components/product/EmptySearchResult';
import { filterProductsBySearchTerm } from '../models/product';
import {
  formatPriceWithSymbol,
  generateOrderNumber,
} from '../utils/formatters';
import { Cart } from '../components/cart/Cart';

interface CartPageProps {
  searchTerm: string;
  onNotification: (
    message: string,
    type: 'error' | 'success' | 'warning'
  ) => void;
  cart: CartItem[];
  selectedCoupon: Coupon | null;
  addToCart: (product: ProductWithUI) => { success: boolean; message?: string };
  removeFromCart: (productId: string) => void;
  updateQuantity: (
    productId: string,
    newQuantity: number
  ) => { success: boolean; message?: string };
  applyCoupon: (coupon: Coupon) => { success: boolean; message?: string };
  clearCoupon: () => void;
  clearCart: () => void;
  calculateItemTotal: (item: CartItem) => number;
  calculateCartTotal: () => {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  getRemainingStock: (product: ProductWithUI) => number;
}

export function CartPage({
  searchTerm,
  onNotification,
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
}: CartPageProps) {
  const { products } = useProducts();
  const { coupons } = useCoupons();

  const formatPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.find((p) => p.id === productId);
      if (product && getRemainingStock(product) <= 0) {
        return 'SOLD OUT';
      }
    }
    return formatPriceWithSymbol(price);
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
    const orderNumber = generateOrderNumber();
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
            <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
            <div className="text-sm text-gray-600">
              총 {products.length}개 상품
            </div>
          </div>
          {filteredProducts.length === 0 ? (
            <EmptySearchResult searchTerm={searchTerm} />
          ) : (
            <ProductList
              products={filteredProducts}
              getRemainingStock={getRemainingStock}
              formatPrice={formatPrice}
              onAddToCart={addToCart}
            />
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
