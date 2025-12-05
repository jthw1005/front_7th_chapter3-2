import { Coupon } from '../../../types';
import { TrashIcon } from '../ui/icons';
import { formatDiscount } from '../../utils/formatters';

interface CouponCardProps {
  coupon: Coupon;
  onDelete: (couponCode: string) => void;
}

export function CouponCard({ coupon, onDelete }: CouponCardProps) {
  return (
    <div className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
          <p className="text-sm text-gray-600 mt-1 font-mono">{coupon.code}</p>
          <div className="mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
              {formatDiscount(coupon.discountType, coupon.discountValue)}
            </span>
          </div>
        </div>
        <button
          onClick={() => onDelete(coupon.code)}
          className="text-gray-400 hover:text-red-600 transition-colors"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}
