import { useCallback } from 'react';
import { Product, Discount } from '../../types';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';
import { initialProducts } from '../constants';

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export function useProducts() {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    'products',
    initialProducts
  );

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
    },
    [setProducts]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
    },
    [setProducts]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    },
    [setProducts]
  );

  const updateProductStock = useCallback(
    (productId: string, stock: number) => {
      updateProduct(productId, { stock });
    },
    [updateProduct]
  );

  const addProductDiscount = useCallback(
    (productId: string, discount: Discount) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId
            ? { ...product, discounts: [...product.discounts, discount] }
            : product
        )
      );
    },
    [setProducts]
  );

  const removeProductDiscount = useCallback(
    (productId: string, discountIndex: number) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId
            ? {
                ...product,
                discounts: product.discounts.filter(
                  (_, index) => index !== discountIndex
                ),
              }
            : product
        )
      );
    },
    [setProducts]
  );

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    addProductDiscount,
    removeProductDiscount,
  };
}
