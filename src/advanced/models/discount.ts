import { Discount, CartItem, Product } from '../../types';

/**
 * 수량에 따른 적용 가능한 할인 찾기
 */
export const findApplicableDiscount = (
  discounts: Discount[],
  quantity: number
): Discount | null => {
  if (!discounts || discounts.length === 0) {
    return null;
  }

  const applicableDiscounts = discounts.filter((d) => quantity >= d.quantity);
  if (applicableDiscounts.length === 0) {
    return null;
  }

  return applicableDiscounts.reduce((maxDiscount, current) =>
    current.rate > maxDiscount.rate ? current : maxDiscount
  );
};

/**
 * 수량 기반 할인율 계산
 */
export const calculateQuantityDiscount = (
  discounts: Discount[],
  quantity: number
): number => {
  const discount = findApplicableDiscount(discounts, quantity);
  return discount?.rate || 0;
};

/**
 * 대량 구매 보너스 할인 (10개 이상 구매 시 5% 추가)
 */
export const BULK_PURCHASE_THRESHOLD = 10;
export const BULK_PURCHASE_BONUS_RATE = 0.05;
export const MAX_DISCOUNT_RATE = 0.5;

export const hasBulkPurchaseInCart = (cart: CartItem[]): boolean => {
  return cart.some((item) => item.quantity >= BULK_PURCHASE_THRESHOLD);
};

/**
 * 최종 할인율 계산 (기본 할인 + 대량 구매 보너스)
 */
export const calculateFinalDiscountRate = (
  baseDiscount: number,
  hasBulkPurchase: boolean
): number => {
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + BULK_PURCHASE_BONUS_RATE, MAX_DISCOUNT_RATE);
  }
  return baseDiscount;
};

/**
 * 할인율을 퍼센트 숫자로 변환
 */
export const discountRateToPercent = (rate: number): number => {
  return Math.round(rate * 100);
};

/**
 * 상품의 할인 정보 텍스트 생성
 */
export const getDiscountInfoText = (product: Product): string[] => {
  if (!product.discounts || product.discounts.length === 0) {
    return [];
  }

  return product.discounts.map(
    (d) => d.quantity + '개 이상: ' + discountRateToPercent(d.rate) + '%'
  );
};

/**
 * 새 할인 정책 기본값
 */
export const getDefaultDiscount = (): Discount => {
  return {
    quantity: 10,
    rate: 0.1,
  };
};

/**
 * 할인 정책 유효성 검사
 */
export const isValidDiscount = (discount: Discount): boolean => {
  return (
    discount.quantity > 0 &&
    discount.rate > 0 &&
    discount.rate <= 1
  );
};
