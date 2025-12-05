import { Coupon } from '../../types';

/**
 * 쿠폰 코드로 쿠폰 찾기
 */
export const findCouponByCode = (
  coupons: Coupon[],
  code: string
): Coupon | undefined => {
  return coupons.find((c) => c.code === code);
};

/**
 * 쿠폰 코드 중복 확인
 */
export const isCouponCodeDuplicate = (
  coupons: Coupon[],
  code: string
): boolean => {
  return coupons.some((c) => c.code === code);
};

/**
 * 쿠폰 적용 가능 여부 확인
 * - percentage 쿠폰은 10,000원 이상 구매 시에만 적용 가능
 */
export const canApplyCoupon = (
  coupon: Coupon,
  totalAmount: number
): { canApply: boolean; reason?: string } => {
  if (coupon.discountType === 'percentage' && totalAmount < 10000) {
    return {
      canApply: false,
      reason: '정률 할인 쿠폰은 10,000원 이상 구매 시에만 적용 가능합니다.',
    };
  }

  return { canApply: true };
};

/**
 * 쿠폰 할인 금액 계산
 */
export const calculateCouponDiscount = (
  coupon: Coupon,
  amount: number
): number => {
  if (coupon.discountType === 'amount') {
    return Math.min(coupon.discountValue, amount);
  }

  return Math.round(amount * (coupon.discountValue / 100));
};

/**
 * 쿠폰 적용 후 금액 계산
 */
export const applyCouponToAmount = (
  coupon: Coupon | null,
  amount: number
): number => {
  if (!coupon) {
    return amount;
  }

  const discount = calculateCouponDiscount(coupon, amount);
  return Math.max(0, amount - discount);
};

/**
 * 쿠폰 할인 표시 텍스트
 */
export const getCouponDiscountText = (coupon: Coupon): string => {
  if (coupon.discountType === 'amount') {
    return coupon.discountValue.toLocaleString() + '원 할인';
  }
  return coupon.discountValue + '% 할인';
};

/**
 * 새 쿠폰 생성을 위한 기본값
 */
export const getDefaultCouponForm = (): Coupon => {
  return {
    name: '',
    code: '',
    discountType: 'amount',
    discountValue: 0,
  };
};
