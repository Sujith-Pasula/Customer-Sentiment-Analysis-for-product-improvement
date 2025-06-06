import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { categories } from '../utils/dummyData';
import { useProductStore } from '../store/productStore';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, filteredProducts, filterProducts, searchProducts } = useProductStore();
  const [currentCategory, setCurrentCategory] = useState(categories.find(c => c.id === id));
  
  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentCategory(categories.find(c => c.id === id));
    
    if (id) {
      filterProducts({ categories: [id] });
    }
  }, [id, filterProducts]);
  
  useEffect(() => {
    return () => {
      // Reset filters when component unmounts
      searchProducts('');
    };
  }, [searchProducts]);
  
  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Category Not Found</h2>
          <p className="mt-2 text-gray-600">The category you are looking for does not exist.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-lg overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={currentCategory.imageUrl}
                alt={currentCategory.name}
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
            <div className="p-6 md:w-2/3 flex items-center">
              <div>
                <h1 className="text-3xl font-bold">{currentCategory.name}</h1>
                <p className="mt-2 text-white/80">
                  Browse our collection of {currentCategory.name.toLowerCase()} products with detailed sentiment analysis
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {currentCategory.subCategories.map(sub => (
                    <span key={sub.id} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                      {sub.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <FilterSidebar onFilter={filterProducts} currentCategory={id} />
          
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-10 text-center">
                <h2 className="text-2xl font-semibold text-gray-800">No Products Found</h2>
                <p className="mt-2 text-gray-600">Try adjusting your filters to see more products.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;