import { Coupon } from '../../types';
import { ProductWithUI } from '../models/product';

// ==================== 비즈니스 상수 ====================

/** 대량 구매 기준 수량 */
export const BULK_PURCHASE_THRESHOLD = 10;

/** 대량 구매 보너스 할인율 */
export const BULK_PURCHASE_BONUS_RATE = 0.05;

/** 최대 할인율 */
export const MAX_DISCOUNT_RATE = 0.5;

/** 품절 임박 기준 재고 수량 */
export const LOW_STOCK_THRESHOLD = 5;

/** 정률 할인 쿠폰 최소 구매 금액 */
export const MIN_AMOUNT_FOR_PERCENTAGE_COUPON = 10000;

/** 최대 재고 수량 */
export const MAX_STOCK_LIMIT = 9999;

/** 최대 할인 금액 */
export const MAX_DISCOUNT_AMOUNT = 100000;

// ==================== UI 상수 ====================

/** 알림 자동 제거 시간 (ms) */
export const NOTIFICATION_DURATION = 3000;

/** 검색 디바운스 시간 (ms) */
export const SEARCH_DEBOUNCE_DELAY = 500;

// ==================== localStorage 키 ====================

export const STORAGE_KEYS = {
  CART: 'cart',
  PRODUCTS: 'products',
  COUPONS: 'coupons',
} as const;

// ==================== 초기 데이터 ====================

/** 초기 상품 목록 */
export const initialProducts: ProductWithUI[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 },
    ],
    description: '최고급 품질의 프리미엄 상품입니다.',
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
    description: '다양한 기능을 갖춘 실용적인 상품입니다.',
    isRecommended: true,
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.2 },
      { quantity: 30, rate: 0.25 },
    ],
    description: '대용량과 고성능을 자랑하는 상품입니다.',
  },
];

/** 초기 쿠폰 목록 */
export const initialCoupons: Coupon[] = [
  {
    name: '5000원 할인',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
];

// ==================== 폼 기본값 ====================

/** 상품 폼 기본값 */
export const DEFAULT_PRODUCT_FORM = {
  name: '',
  price: 0,
  stock: 0,
  description: '',
  discounts: [] as Array<{ quantity: number; rate: number }>,
};

/** 쿠폰 폼 기본값 */
export const DEFAULT_COUPON_FORM: {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
} = {
  name: '',
  code: '',
  discountType: 'amount',
  discountValue: 0,
};

/** 할인 정책 기본값 */
export const DEFAULT_DISCOUNT = {
  quantity: 10,
  rate: 0.1,
};

// ==================== 메시지 상수 ====================

export const MESSAGES = {
  // 성공 메시지
  PRODUCT_ADDED: '상품이 추가되었습니다.',
  PRODUCT_UPDATED: '상품이 수정되었습니다.',
  PRODUCT_DELETED: '상품이 삭제되었습니다.',
  COUPON_ADDED: '쿠폰이 추가되었습니다.',
  COUPON_DELETED: '쿠폰이 삭제되었습니다.',
  CART_ITEM_ADDED: '장바구니에 추가되었습니다.',

  // 에러 메시지
  DUPLICATE_COUPON_CODE: '이미 존재하는 쿠폰 코드입니다.',
  INSUFFICIENT_STOCK: '재고가 부족합니다.',
  PRICE_MUST_BE_POSITIVE: '가격은 0보다 커야 합니다',
  STOCK_MUST_BE_POSITIVE: '재고는 0보다 커야 합니다',
  STOCK_EXCEEDS_MAX: '재고는 9999개를 초과할 수 없습니다',
  DISCOUNT_RATE_EXCEEDS_MAX: '할인율은 100%를 초과할 수 없습니다',
  DISCOUNT_AMOUNT_EXCEEDS_MAX: '할인 금액은 100,000원을 초과할 수 없습니다',
  MIN_AMOUNT_FOR_PERCENTAGE:
    '정률 할인 쿠폰은 10,000원 이상 구매 시에만 적용 가능합니다.',
} as const;
