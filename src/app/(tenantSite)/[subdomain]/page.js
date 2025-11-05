import { Suspense } from 'react';
import ProductGrid from '@/components/public/ProductGrid';
import TenantHero from '@/components/public/TenantHero';

async function getTenantData(subdomain) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/public/${subdomain}/products`,
      { next: { revalidate: 60 } }
    );
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching tenant data:', error);
    return null;
  }
}

async function TenantContent({ subdomain }) {
  const tenantData = await getTenantData(subdomain);

  if (!tenantData || !tenantData.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Business Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The business <strong>{subdomain}.karkhana.shop</strong> doesn't exist or is no longer active.
            </p>
            <a
              href="https://karkhana.shop"
              className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors inline-block font-semibold"
            >
              Visit Karkhana.shop
            </a>
          </div>
        </div>
      </div>
    );
  }

  const { products, tenant } = tenantData;

  return (
    <div className="min-h-screen bg-gray-50">
      <TenantHero tenant={tenant} />
      
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our collection of quality products and services
            </p>
          </div>
          
          <Suspense fallback={<ProductsLoading />}>
            <ProductGrid products={products} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
          <div className="bg-gray-300 h-4 rounded w-3/4 mb-2"></div>
          <div className="bg-gray-300 h-4 rounded w-1/2 mb-4"></div>
          <div className="bg-gray-300 h-6 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );
}

export default async function TenantHomepage({ params }) {
  const { subdomain } = await params; // Await the params

  return <TenantContent subdomain={subdomain} />;
}