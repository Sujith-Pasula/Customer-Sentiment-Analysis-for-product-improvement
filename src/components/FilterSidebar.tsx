import React, { useState } from 'react';
import { Filter } from '../types';
import { categories } from '../utils/dummyData';

interface FilterSidebarProps {
  onFilter: (filter: Filter) => void;
  currentCategory?: string;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilter, currentCategory }) => {
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 100000 });
  const [selectedRating, setSelectedRating] = useState<number | undefined>(undefined);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    currentCategory ? [currentCategory] : []
  );
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };
  
  const handleSubCategoryChange = (subCategoryId: string) => {
    setSelectedSubCategories(prev => {
      if (prev.includes(subCategoryId)) {
        return prev.filter(id => id !== subCategoryId);
      } else {
        return [...prev, subCategoryId];
      }
    });
  };
  
  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  const applyFilters = () => {
    onFilter({
      price: priceRange,
      rating: selectedRating,
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      subCategories: selectedSubCategories.length > 0 ? selectedSubCategories : undefined
    });
  };
  
  const clearFilters = () => {
    setPriceRange({ min: 0, max: 100000 });
    setSelectedRating(undefined);
    setSelectedCategories(currentCategory ? [currentCategory] : []);
    setSelectedSubCategories([]);
    
    onFilter({});
  };

  // Get relevant subcategories based on selected categories
  const relevantSubCategories = categories
    .filter(category => selectedCategories.includes(category.id))
    .flatMap(category => category.subCategories);
  
  return (
    <aside className="w-full md:w-64 bg-white rounded-lg shadow-md p-5">
      <h2 className="text-lg font-semibold mb-4">Filter Products</h2>
      
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={priceRange.min}
            onChange={(e) => handlePriceChange('min', Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            min="0"
            placeholder="Min"
          />
          <span className="text-gray-500">to</span>
          <input
            type="number"
            value={priceRange.max}
            onChange={(e) => handlePriceChange('max', Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            min={priceRange.min}
            placeholder="Max"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center">
              <input
                type="radio"
                name="rating"
                checked={selectedRating === rating}
                onChange={() => setSelectedRating(rating)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{rating}+ stars</span>
            </label>
          ))}
        </div>
      </div>
      
      {!currentCategory && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{category.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      
      {relevantSubCategories.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Sub-Categories</h3>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {relevantSubCategories.map((subCategory) => (
              <label key={subCategory.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedSubCategories.includes(subCategory.id)}
                  onChange={() => handleSubCategoryChange(subCategory.id)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{subCategory.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex flex-col space-y-2">
        <button
          onClick={applyFilters}
          className="w-full py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Apply Filters
        </button>
        <button
          onClick={clearFilters}
          className="w-full py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;