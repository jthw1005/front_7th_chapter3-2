import { useCallback } from 'react';
import { Coupon } from '../../types';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';
import { initialCoupons } from '../constants';

export function useCoupons() {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    'coupons',
    initialCoupons
  );

  const addCoupon = useCallback(
    (newCoupon: Coupon): boolean => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        return false;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      return true;
    },
    [coupons, setCoupons]
  );

  const removeCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
    },
    [setCoupons]
  );

  return {
    coupons,
    addCoupon,
    removeCoupon,
  };
}
