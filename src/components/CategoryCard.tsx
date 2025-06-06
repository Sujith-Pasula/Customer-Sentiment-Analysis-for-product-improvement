import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link 
      to={`/category/${category.id}`} 
      className="group relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl"
    >
      <div className="h-40 overflow-hidden">
        <img 
          src={category.imageUrl} 
          alt={category.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
        <div className="p-4 w-full">
          <h3 className="text-white text-xl font-bold">{category.name}</h3>
          <p className="text-white/80 text-sm mt-1">
            {category.subCategories.slice(0, 3).map(sub => sub.name).join(', ')}
            {category.subCategories.length > 3 ? '...' : ''}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;