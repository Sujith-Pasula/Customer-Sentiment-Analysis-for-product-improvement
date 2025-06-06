import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  const { searchProducts, filteredProducts, filterProducts, loading } = useProductStore();
  const [appliedQuery, setAppliedQuery] = useState(query);
  
  useEffect(() => {
    setAppliedQuery(query);
    
    if (query) {
      searchProducts(query);
    }
  }, [query, searchProducts]);
  
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
          <p className="mt-2 text-gray-600">
            {filteredProducts.length} results for "{appliedQuery}"
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <FilterSidebar onFilter={filterProducts} />
          
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-10 text-center">
                <h2 className="text-2xl font-semibold text-gray-800">No Products Found</h2>
                <p className="mt-2 text-gray-600">
                  We couldn't find any products matching "{appliedQuery}". Try a different search term or browse our categories.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;