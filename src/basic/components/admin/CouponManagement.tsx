import { Coupon } from '../../../types';
import { DEFAULT_COUPON_FORM } from '../../constants';
import { PlusIcon } from '../icons';
import { CouponCard } from './CouponCard';
import { CouponForm } from './CouponForm';

interface CouponManagementProps {
  coupons: Coupon[];
  showCouponForm: boolean;
  couponForm: typeof DEFAULT_COUPON_FORM;
  onToggleForm: () => void;
  onDelete: (couponCode: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onNameChange: (value: string) => void;
  onCodeChange: (value: string) => void;
  onTypeChange: (value: 'amount' | 'percentage') => void;
  onValueChange: (value: string) => void;
  onValueBlur: () => void;
}

export function CouponManagement({
  coupons,
  showCouponForm,
  couponForm,
  onToggleForm,
  onDelete,
  onSubmit,
  onCancel,
  onNameChange,
  onCodeChange,
  onTypeChange,
  onValueChange,
  onValueBlur,
}: CouponManagementProps) {
  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <CouponCard key={coupon.code} coupon={coupon} onDelete={onDelete} />
          ))}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
            <button
              onClick={onToggleForm}
              className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
            >
              <PlusIcon />
              <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
            </button>
          </div>
        </div>

        {showCouponForm && (
          <CouponForm
            couponForm={couponForm}
            onSubmit={onSubmit}
            onCancel={onCancel}
            onNameChange={onNameChange}
            onCodeChange={onCodeChange}
            onTypeChange={onTypeChange}
            onValueChange={onValueChange}
            onValueBlur={onValueBlur}
          />
        )}
      </div>
    </section>
  );
}
