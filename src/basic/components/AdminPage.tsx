import { useState, useCallback } from 'react';
import { Coupon } from '../../types';
import { ProductWithUI } from '../models/product';
import { useProducts } from '../hooks/useProducts';
import { useCoupons } from '../hooks/useCoupons';
import {
  DEFAULT_PRODUCT_FORM,
  DEFAULT_COUPON_FORM,
  MESSAGES,
  MAX_STOCK_LIMIT,
  MAX_DISCOUNT_AMOUNT,
} from '../constants';
import { isNumericInput, parseNumberInput } from '../utils/validators';
import { ProductManagement } from './admin/ProductManagement';
import { CouponManagement } from './admin/CouponManagement';

interface AdminPageProps {
  onNotification: (
    message: string,
    type: 'error' | 'success' | 'warning'
  ) => void;
}

export function AdminPage({ onNotification }: AdminPageProps) {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { coupons, addCoupon, removeCoupon } = useCoupons();

  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>(
    'products'
  );
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState(DEFAULT_PRODUCT_FORM);
  const [couponForm, setCouponForm] = useState(DEFAULT_COUPON_FORM);

  const formatPrice = (price: number): string => {
    return price.toLocaleString() + '원';
  };

  const handleAddProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      addProduct(newProduct);
      onNotification(MESSAGES.PRODUCT_ADDED, 'success');
    },
    [addProduct, onNotification]
  );

  const handleUpdateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      updateProduct(productId, updates);
      onNotification(MESSAGES.PRODUCT_UPDATED, 'success');
    },
    [updateProduct, onNotification]
  );

  const handleDeleteProduct = useCallback(
    (productId: string) => {
      deleteProduct(productId);
      onNotification(MESSAGES.PRODUCT_DELETED, 'success');
    },
    [deleteProduct, onNotification]
  );

  const handleAddCoupon = useCallback(
    (newCoupon: Coupon) => {
      const success = addCoupon(newCoupon);
      if (success) {
        onNotification(MESSAGES.COUPON_ADDED, 'success');
      } else {
        onNotification(MESSAGES.DUPLICATE_COUPON_CODE, 'error');
      }
    },
    [addCoupon, onNotification]
  );

  const handleDeleteCoupon = useCallback(
    (couponCode: string) => {
      removeCoupon(couponCode);
      onNotification(MESSAGES.COUPON_DELETED, 'success');
    },
    [removeCoupon, onNotification]
  );

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      handleUpdateProduct(editingProduct, productForm);
    } else {
      handleAddProduct({
        ...productForm,
        discounts: productForm.discounts,
      });
    }
    setProductForm({ ...DEFAULT_PRODUCT_FORM, discounts: [] });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddCoupon(couponForm);
    setCouponForm(DEFAULT_COUPON_FORM);
    setShowCouponForm(false);
  };

  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductForm({ ...DEFAULT_PRODUCT_FORM, discounts: [] });
    setShowProductForm(false);
  };

  const handlePriceChange = (value: string) => {
    if (isNumericInput(value)) {
      setProductForm({
        ...productForm,
        price: value === '' ? 0 : parseNumberInput(value),
      });
    }
  };

  const handlePriceBlur = (value: string) => {
    if (value === '') {
      setProductForm({ ...productForm, price: 0 });
    } else if (parseNumberInput(value) < 0) {
      onNotification(MESSAGES.PRICE_MUST_BE_POSITIVE, 'error');
      setProductForm({ ...productForm, price: 0 });
    }
  };

  const handleStockChange = (value: string) => {
    if (isNumericInput(value)) {
      setProductForm({
        ...productForm,
        stock: value === '' ? 0 : parseNumberInput(value),
      });
    }
  };

  const handleStockBlur = (value: string) => {
    const numValue = parseNumberInput(value);
    if (value === '') {
      setProductForm({ ...productForm, stock: 0 });
    } else if (numValue < 0) {
      onNotification(MESSAGES.STOCK_MUST_BE_POSITIVE, 'error');
      setProductForm({ ...productForm, stock: 0 });
    } else if (numValue > MAX_STOCK_LIMIT) {
      onNotification(MESSAGES.STOCK_EXCEEDS_MAX, 'error');
      setProductForm({ ...productForm, stock: MAX_STOCK_LIMIT });
    }
  };

  const handleDiscountValueChange = (value: string) => {
    if (isNumericInput(value)) {
      setCouponForm({
        ...couponForm,
        discountValue: value === '' ? 0 : parseNumberInput(value),
      });
    }
  };

  const handleDiscountValueBlur = () => {
    const value = couponForm.discountValue;
    if (couponForm.discountType === 'percentage') {
      if (value > 100) {
        onNotification(MESSAGES.DISCOUNT_RATE_EXCEEDS_MAX, 'error');
        setCouponForm({ ...couponForm, discountValue: 100 });
      } else if (value < 0) {
        setCouponForm({ ...couponForm, discountValue: 0 });
      }
    } else {
      if (value > MAX_DISCOUNT_AMOUNT) {
        onNotification(MESSAGES.DISCOUNT_AMOUNT_EXCEEDS_MAX, 'error');
        setCouponForm({ ...couponForm, discountValue: MAX_DISCOUNT_AMOUNT });
      } else if (value < 0) {
        setCouponForm({ ...couponForm, discountValue: 0 });
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('products')}
            className={
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors ' +
              (activeTab === 'products'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')
            }
          >
            상품 관리
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors ' +
              (activeTab === 'coupons'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')
            }
          >
            쿠폰 관리
          </button>
        </nav>
      </div>

      {activeTab === 'products' ? (
        <ProductManagement
          products={products}
          showProductForm={showProductForm}
          editingProduct={editingProduct}
          productForm={productForm}
          formatPrice={formatPrice}
          onStartAdd={() => {
            setEditingProduct('new');
            setProductForm({ ...DEFAULT_PRODUCT_FORM, discounts: [] });
            setShowProductForm(true);
          }}
          onStartEdit={startEditProduct}
          onDelete={handleDeleteProduct}
          onSubmit={handleProductSubmit}
          onCancel={resetProductForm}
          onNameChange={(value) =>
            setProductForm({ ...productForm, name: value })
          }
          onDescriptionChange={(value) =>
            setProductForm({ ...productForm, description: value })
          }
          onPriceChange={handlePriceChange}
          onPriceBlur={handlePriceBlur}
          onStockChange={handleStockChange}
          onStockBlur={handleStockBlur}
          onDiscountsChange={(discounts) =>
            setProductForm({ ...productForm, discounts })
          }
        />
      ) : (
        <CouponManagement
          coupons={coupons}
          showCouponForm={showCouponForm}
          couponForm={couponForm}
          onToggleForm={() => setShowCouponForm(!showCouponForm)}
          onDelete={handleDeleteCoupon}
          onSubmit={handleCouponSubmit}
          onCancel={() => setShowCouponForm(false)}
          onNameChange={(value) =>
            setCouponForm({ ...couponForm, name: value })
          }
          onCodeChange={(value) =>
            setCouponForm({ ...couponForm, code: value.toUpperCase() })
          }
          onTypeChange={(value) =>
            setCouponForm({ ...couponForm, discountType: value })
          }
          onValueChange={handleDiscountValueChange}
          onValueBlur={handleDiscountValueBlur}
        />
      )}
    </div>
  );
}
