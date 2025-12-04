import { ProductWithUI } from '../models/product';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: ProductWithUI[];
  getRemainingStock: (product: ProductWithUI) => number;
  formatPrice: (price: number, productId?: string) => string;
  onAddToCart: (product: ProductWithUI) => void;
}

export function ProductList({
  products,
  getRemainingStock,
  formatPrice,
  onAddToCart,
}: ProductListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          remainingStock={getRemainingStock(product)}
          formatPrice={formatPrice}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
