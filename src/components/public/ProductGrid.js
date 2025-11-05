import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📦</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Yet</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          This business hasn't added any products to their catalog yet.
          Check back later or contact them for more information.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}