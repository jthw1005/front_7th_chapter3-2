import { useState, useCallback } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';
import {
  calculateItemTotal as calcItemTotal,
  calculateCartTotal as calcCartTotal,
  getRemainingStock as getRemStock,
} from '../models/cart';

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export function useCart(products: ProductWithUI[]) {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const getRemainingStock = useCallback(
    (product: Product): number => {
      return getRemStock(product, cart);
    },
    [cart]
  );

  const calculateItemTotal = useCallback(
    (item: CartItem): number => {
      return calcItemTotal(item, cart);
    },
    [cart]
  );

  const calculateCartTotal = useCallback(() => {
    return calcCartTotal(cart, selectedCoupon);
  }, [cart, selectedCoupon]);

  const addToCart = useCallback(
    (product: ProductWithUI): { success: boolean; message?: string } => {
      const remainingStock = getRemainingStock(product);
      if (remainingStock <= 0) {
        return { success: false, message: '재고가 부족합니다!' };
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            return prevCart;
          }

          return prevCart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        }

        return [...prevCart, { product, quantity: 1 }];
      });

      return { success: true, message: '장바구니에 담았습니다' };
    },
    [getRemainingStock, setCart]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prevCart) =>
        prevCart.filter((item) => item.product.id !== productId)
      );
    },
    [setCart]
  );

  const updateQuantity = useCallback(
    (
      productId: string,
      newQuantity: number
    ): { success: boolean; message?: string } => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return { success: true };
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return { success: false };

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        return {
          success: false,
          message: `재고는 ${maxStock}개까지만 있습니다.`,
        };
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );

      return { success: true };
    },
    [products, removeFromCart, setCart]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon): { success: boolean; message?: string } => {
      const currentTotal = calcCartTotal(cart, null).totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === 'percentage') {
        return {
          success: false,
          message: 'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.',
        };
      }

      setSelectedCoupon(coupon);
      return { success: true, message: '쿠폰이 적용되었습니다.' };
    },
    [cart]
  );

  const clearCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedCoupon(null);
  }, [setCart]);

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    selectedCoupon,
    totalItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    clearCoupon,
    clearCart,
    calculateItemTotal,
    calculateCartTotal,
    getRemainingStock,
  };
}
