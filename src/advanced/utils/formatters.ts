/**
 * 가격을 한국 원화 형식으로 포맷
 * @param price - 가격 (숫자)
 * @param showCurrencySymbol - 통화 기호 표시 여부 (기본: true)
 * @returns 포맷된 가격 문자열
 */
export const formatPrice = (
  price: number,
  showCurrencySymbol: boolean = true
): string => {
  const formattedNumber = price.toLocaleString('ko-KR');
  if (showCurrencySymbol) {
    return formattedNumber + '원';
  }
  return formattedNumber;
};

/**
 * 가격을 원화 기호와 함께 표시
 * @param price - 가격 (숫자)
 * @returns 포맷된 가격 문자열 (예: ₩10,000)
 */
export const formatPriceWithSymbol = (price: number): string => {
  return '\u20A9' + price.toLocaleString('ko-KR');
};

/**
 * 소수를 퍼센트 문자열로 변환
 * @param rate - 소수 (예: 0.1)
 * @returns 퍼센트 문자열 (예: "10%")
 */
export const formatPercentage = (rate: number): string => {
  return Math.round(rate * 100) + '%';
};

/**
 * 할인 금액 또는 할인율 포맷
 * @param discountType - 할인 타입 ('amount' | 'percentage')
 * @param discountValue - 할인 값
 * @returns 포맷된 할인 문자열
 */
export const formatDiscount = (
  discountType: 'amount' | 'percentage',
  discountValue: number
): string => {
  if (discountType === 'amount') {
    return formatPrice(discountValue) + ' 할인';
  }
  return discountValue + '% 할인';
};

/**
 * 재고 상태 텍스트 반환
 * @param stock - 재고 수량
 * @returns 재고 상태 문자열
 */
export const formatStockStatus = (stock: number): string => {
  if (stock <= 0) {
    return '품절';
  }
  if (stock <= 5) {
    return '품절임박';
  }
  return stock + '개 남음';
};

/**
 * 주문 번호 생성
 * @returns 주문 번호 문자열
 */
export const generateOrderNumber = (): string => {
  return 'ORD-' + Date.now();
};
