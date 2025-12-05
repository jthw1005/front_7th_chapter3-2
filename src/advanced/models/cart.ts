import { CartItem, Coupon, Product } from '../../types';

/**
 * 적용 가능한 최대 할인율 계산
 * - 상품별 수량 기반 할인 + 대량 구매 보너스(5%) 적용
 */
export const getMaxApplicableDiscount = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5);
  }

  return baseDiscount;
};

/**
 * 개별 아이템의 할인 적용 후 총액 계산
 */
export const calculateItemTotal = (item: CartItem, cart: CartItem[]): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discount));
};

/**
 * 장바구니 총액 계산 (할인 전/후, 쿠폰 적용)
 */
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item, cart);
  });

  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - selectedCoupon.discountValue
      );
    } else {
      totalAfterDiscount = Math.round(
        totalAfterDiscount * (1 - selectedCoupon.discountValue / 100)
      );
    }
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
  };
};

/**
 * 장바구니 아이템 수량 변경
 * - 수량이 0 이하면 해당 아이템 제거
 */
export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  if (newQuantity <= 0) {
    return cart.filter((item) => item.product.id !== productId);
  }

  return cart.map((item) =>
    item.product.id === productId ? { ...item, quantity: newQuantity } : item
  );
};

/**
 * 장바구니에 상품 추가
 * - 이미 존재하는 상품이면 수량 증가
 */
export const addItemToCart = (cart: CartItem[], product: Product): CartItem[] => {
  const existingItem = cart.find((item) => item.product.id === product.id);

  if (existingItem) {
    return cart.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }

  return [...cart, { product, quantity: 1 }];
};

/**
 * 장바구니에서 상품 제거
 */
export const removeItemFromCart = (
  cart: CartItem[],
  productId: string
): CartItem[] => {
  return cart.filter((item) => item.product.id !== productId);
};

/**
 * 남은 재고 계산
 */
export const getRemainingStock = (product: Product, cart: CartItem[]): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};
