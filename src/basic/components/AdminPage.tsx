import { useState, useCallback } from 'react';
import { Coupon } from '../../types';
import { ProductWithUI } from '../models/product';
import { useProducts } from '../hooks/useProducts';
import { useCoupons } from '../hooks/useCoupons';
import {
  DEFAULT_PRODUCT_FORM,
  DEFAULT_COUPON_FORM,
  DEFAULT_DISCOUNT,
  MESSAGES,
  MAX_STOCK_LIMIT,
  MAX_DISCOUNT_AMOUNT,
} from '../constants';
import { isNumericInput, parseNumberInput } from '../utils/validators';

interface AdminPageProps {
  onNotification: (message: string, type: 'error' | 'success' | 'warning') => void;
}

export function AdminPage({ onNotification }: AdminPageProps) {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { coupons, addCoupon, removeCoupon } = useCoupons();

  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');
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
          onNameChange={(value) => setProductForm({ ...productForm, name: value })}
          onDescriptionChange={(value) => setProductForm({ ...productForm, description: value })}
          onPriceChange={handlePriceChange}
          onPriceBlur={handlePriceBlur}
          onStockChange={handleStockChange}
          onStockBlur={handleStockBlur}
          onDiscountsChange={(discounts) => setProductForm({ ...productForm, discounts })}
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
          onNameChange={(value) => setCouponForm({ ...couponForm, name: value })}
          onCodeChange={(value) => setCouponForm({ ...couponForm, code: value.toUpperCase() })}
          onTypeChange={(value) => setCouponForm({ ...couponForm, discountType: value })}
          onValueChange={handleDiscountValueChange}
          onValueBlur={handleDiscountValueBlur}
        />
      )}
    </div>
  );
}

// 상품 관리 섹션 컴포넌트
interface ProductManagementProps {
  products: ProductWithUI[];
  showProductForm: boolean;
  editingProduct: string | null;
  productForm: typeof DEFAULT_PRODUCT_FORM;
  formatPrice: (price: number) => string;
  onStartAdd: () => void;
  onStartEdit: (product: ProductWithUI) => void;
  onDelete: (productId: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onPriceBlur: (value: string) => void;
  onStockChange: (value: string) => void;
  onStockBlur: (value: string) => void;
  onDiscountsChange: (discounts: Array<{ quantity: number; rate: number }>) => void;
}

function ProductManagement({
  products,
  showProductForm,
  editingProduct,
  productForm,
  formatPrice,
  onStartAdd,
  onStartEdit,
  onDelete,
  onSubmit,
  onCancel,
  onNameChange,
  onDescriptionChange,
  onPriceChange,
  onPriceBlur,
  onStockChange,
  onStockBlur,
  onDiscountsChange,
}: ProductManagementProps) {
  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button
            onClick={onStartAdd}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            새 상품 추가
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상품명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                가격
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                재고
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                설명
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatPrice(product.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ' +
                      (product.stock > 10
                        ? 'bg-green-100 text-green-800'
                        : product.stock > 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800')
                    }
                  >
                    {product.stock}개
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {product.description || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onStartEdit(product)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showProductForm && (
        <ProductForm
          editingProduct={editingProduct}
          productForm={productForm}
          onSubmit={onSubmit}
          onCancel={onCancel}
          onNameChange={onNameChange}
          onDescriptionChange={onDescriptionChange}
          onPriceChange={onPriceChange}
          onPriceBlur={onPriceBlur}
          onStockChange={onStockChange}
          onStockBlur={onStockBlur}
          onDiscountsChange={onDiscountsChange}
        />
      )}
    </section>
  );
}

// 상품 폼 컴포넌트
interface ProductFormProps {
  editingProduct: string | null;
  productForm: typeof DEFAULT_PRODUCT_FORM;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onPriceBlur: (value: string) => void;
  onStockChange: (value: string) => void;
  onStockBlur: (value: string) => void;
  onDiscountsChange: (discounts: Array<{ quantity: number; rate: number }>) => void;
}

function ProductForm({
  editingProduct,
  productForm,
  onSubmit,
  onCancel,
  onNameChange,
  onDescriptionChange,
  onPriceChange,
  onPriceBlur,
  onStockChange,
  onStockBlur,
  onDiscountsChange,
}: ProductFormProps) {
  const handleDiscountChange = (index: number, field: 'quantity' | 'rate', value: number) => {
    const newDiscounts = [...productForm.discounts];
    newDiscounts[index] = { ...newDiscounts[index], [field]: value };
    onDiscountsChange(newDiscounts);
  };

  const handleAddDiscount = () => {
    onDiscountsChange([...productForm.discounts, DEFAULT_DISCOUNT]);
  };

  const handleRemoveDiscount = (index: number) => {
    onDiscountsChange(productForm.discounts.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={onSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {editingProduct === 'new' ? '새 상품 추가' : '상품 수정'}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상품명</label>
            <input
              type="text"
              value={productForm.name}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
            <input
              type="text"
              value={productForm.description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">가격</label>
            <input
              type="text"
              value={productForm.price === 0 ? '' : productForm.price}
              onChange={(e) => onPriceChange(e.target.value)}
              onBlur={(e) => onPriceBlur(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              placeholder="숫자만 입력"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">재고</label>
            <input
              type="text"
              value={productForm.stock === 0 ? '' : productForm.stock}
              onChange={(e) => onStockChange(e.target.value)}
              onBlur={(e) => onStockBlur(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              placeholder="숫자만 입력"
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">할인 정책</label>
          <div className="space-y-2">
            {productForm.discounts.map((discount, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                <input
                  type="number"
                  value={discount.quantity}
                  onChange={(e) => handleDiscountChange(index, 'quantity', parseInt(e.target.value) || 0)}
                  className="w-20 px-2 py-1 border rounded"
                  min="1"
                  placeholder="수량"
                />
                <span className="text-sm">개 이상 구매 시</span>
                <input
                  type="number"
                  value={discount.rate * 100}
                  onChange={(e) => handleDiscountChange(index, 'rate', (parseInt(e.target.value) || 0) / 100)}
                  className="w-16 px-2 py-1 border rounded"
                  min="0"
                  max="100"
                  placeholder="%"
                />
                <span className="text-sm">% 할인</span>
                <button
                  type="button"
                  onClick={() => handleRemoveDiscount(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddDiscount}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              + 할인 추가
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            {editingProduct === 'new' ? '추가' : '수정'}
          </button>
        </div>
      </form>
    </div>
  );
}

// 쿠폰 관리 섹션 컴포넌트
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

function CouponManagement({
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
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
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

// 쿠폰 카드 컴포넌트
interface CouponCardProps {
  coupon: Coupon;
  onDelete: (couponCode: string) => void;
}

function CouponCard({ coupon, onDelete }: CouponCardProps) {
  return (
    <div className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
          <p className="text-sm text-gray-600 mt-1 font-mono">{coupon.code}</p>
          <div className="mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
              {coupon.discountType === 'amount'
                ? coupon.discountValue.toLocaleString() + '원 할인'
                : coupon.discountValue + '% 할인'}
            </span>
          </div>
        </div>
        <button
          onClick={() => onDelete(coupon.code)}
          className="text-gray-400 hover:text-red-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

// 쿠폰 폼 컴포넌트
interface CouponFormProps {
  couponForm: typeof DEFAULT_COUPON_FORM;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onNameChange: (value: string) => void;
  onCodeChange: (value: string) => void;
  onTypeChange: (value: 'amount' | 'percentage') => void;
  onValueChange: (value: string) => void;
  onValueBlur: () => void;
}

function CouponForm({
  couponForm,
  onSubmit,
  onCancel,
  onNameChange,
  onCodeChange,
  onTypeChange,
  onValueChange,
  onValueBlur,
}: CouponFormProps) {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={onSubmit} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">쿠폰명</label>
            <input
              type="text"
              value={couponForm.name}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
              placeholder="신규 가입 쿠폰"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">쿠폰 코드</label>
            <input
              type="text"
              value={couponForm.code}
              onChange={(e) => onCodeChange(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm font-mono"
              placeholder="WELCOME2024"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">할인 타입</label>
            <select
              value={couponForm.discountType}
              onChange={(e) => onTypeChange(e.target.value as 'amount' | 'percentage')}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
            >
              <option value="amount">정액 할인</option>
              <option value="percentage">정률 할인</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {couponForm.discountType === 'amount' ? '할인 금액' : '할인율(%)'}
            </label>
            <input
              type="text"
              value={couponForm.discountValue === 0 ? '' : couponForm.discountValue}
              onChange={(e) => onValueChange(e.target.value)}
              onBlur={onValueBlur}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
              placeholder={couponForm.discountType === 'amount' ? '5000' : '10'}
              required
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            쿠폰 생성
          </button>
        </div>
      </form>
    </div>
  );
}
