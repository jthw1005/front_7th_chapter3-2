import { Product, CartItem } from '../../types';

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

/**
 * 상품 검색 필터링
 * - 상품명 또는 설명에서 검색어를 포함하는 상품 반환
 */
export const filterProductsBySearchTerm = (
  products: ProductWithUI[],
  searchTerm: string
): ProductWithUI[] => {
  if (!searchTerm.trim()) {
    return products;
  }

  const lowerSearchTerm = searchTerm.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerSearchTerm) ||
      (product.description &&
        product.description.toLowerCase().includes(lowerSearchTerm))
  );
};

/**
 * 상품의 최대 할인율 조회
 */
export const getMaxDiscountRate = (product: Product): number => {
  if (!product.discounts || product.discounts.length === 0) {
    return 0;
  }

  return Math.max(...product.discounts.map((d) => d.rate));
};

/**
 * 상품이 품절인지 확인
 */
export const isProductSoldOut = (
  product: Product,
  cart: CartItem[]
): boolean => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const inCartQuantity = cartItem?.quantity || 0;
  return product.stock - inCartQuantity <= 0;
};

/**
 * 상품이 품절 임박인지 확인 (재고 5개 이하)
 */
export const isLowStock = (product: Product, cart: CartItem[]): boolean => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const inCartQuantity = cartItem?.quantity || 0;
  const remainingStock = product.stock - inCartQuantity;
  return remainingStock > 0 && remainingStock <= 5;
};

/**
 * 상품 ID로 상품 찾기
 */
export const findProductById = (
  products: Product[],
  productId: string
): Product | undefined => {
  return products.find((p) => p.id === productId);
};

/**
 * 새 상품 ID 생성
 */
export const generateProductId = (): string => {
  return 'p' + Date.now();
};
