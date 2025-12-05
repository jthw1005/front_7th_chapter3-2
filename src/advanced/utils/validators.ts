/**
 * 쿠폰 코드 형식 검증
 * - 4~12자의 영문 대문자와 숫자 조합
 * @param code - 쿠폰 코드
 * @returns 유효 여부
 */
export const isValidCouponCode = (code: string): boolean => {
  if (!code || code.length < 4 || code.length > 12) {
    return false;
  }
  const pattern = /^[A-Z0-9]+$/;
  return pattern.test(code);
};

/**
 * 재고 수량 검증
 * - 0 이상의 정수
 * @param stock - 재고 수량
 * @returns 유효 여부
 */
export const isValidStock = (stock: number): boolean => {
  return Number.isInteger(stock) && stock >= 0;
};

/**
 * 가격 검증
 * - 0 이상의 숫자
 * @param price - 가격
 * @returns 유효 여부
 */
export const isValidPrice = (price: number): boolean => {
  return typeof price === 'number' && !isNaN(price) && price >= 0;
};

/**
 * 문자열에서 숫자만 추출
 * @param value - 입력 문자열
 * @returns 숫자만 포함된 문자열
 */
export const extractNumbers = (value: string): string => {
  return value.replace(/[^0-9]/g, '');
};

/**
 * 할인율 검증
 * - 0 이상 100 이하
 * @param rate - 할인율 (퍼센트)
 * @returns 유효 여부
 */
export const isValidDiscountRate = (rate: number): boolean => {
  return typeof rate === 'number' && !isNaN(rate) && rate >= 0 && rate <= 100;
};

/**
 * 할인 금액 검증
 * - 0 이상 100,000 이하
 * @param amount - 할인 금액
 * @returns 유효 여부
 */
export const isValidDiscountAmount = (amount: number): boolean => {
  return typeof amount === 'number' && !isNaN(amount) && amount >= 0 && amount <= 100000;
};

/**
 * 상품명 검증
 * - 1자 이상
 * @param name - 상품명
 * @returns 유효 여부
 */
export const isValidProductName = (name: string): boolean => {
  return typeof name === 'string' && name.trim().length > 0;
};

/**
 * 수량 검증
 * - 1 이상의 정수
 * @param quantity - 수량
 * @returns 유효 여부
 */
export const isValidQuantity = (quantity: number): boolean => {
  return Number.isInteger(quantity) && quantity >= 1;
};

/**
 * 최대 재고 검증
 * - 9999 이하
 * @param stock - 재고 수량
 * @returns 유효 여부
 */
export const isWithinMaxStock = (stock: number): boolean => {
  return stock <= 9999;
};

/**
 * 숫자 입력값 파싱
 * - 빈 문자열이면 0 반환
 * - 숫자가 아니면 0 반환
 * @param value - 입력값
 * @returns 파싱된 숫자
 */
export const parseNumberInput = (value: string): number => {
  if (value === '') {
    return 0;
  }
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * 숫자만 입력 가능한지 검증
 * @param value - 입력값
 * @returns 숫자만 포함 여부
 */
export const isNumericInput = (value: string): boolean => {
  return value === '' || /^\d+$/.test(value);
};
