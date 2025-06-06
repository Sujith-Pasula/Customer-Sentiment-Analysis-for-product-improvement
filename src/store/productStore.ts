import { create } from 'zustand';
import { Product, Review, Filter, Suggestion } from '../types';
import { products, suggestions, analyzeReviewSentiment } from '../utils/dummyData';

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  fetchProducts: () => void;
  fetchProductById: (id: string) => void;
  searchProducts: (query: string) => void;
  filterProducts: (filter: Filter) => void;
  addReview: (productId: string, userId: string, username: string, rating: number, comment: string) => void;
  addSuggestion: (productId: string, content: string) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  filteredProducts: [],
  currentProduct: null,
  loading: false,
  error: null,
  
  fetchProducts: () => {
    set({ loading: true });
    
    // Simulate API call delay
    setTimeout(() => {
      set({ 
        products, 
        filteredProducts: products,
        loading: false 
      });
    }, 500);
  },
  
  fetchProductById: (id) => {
    set({ loading: true, currentProduct: null });
    
    // Simulate API call delay
    setTimeout(() => {
      const product = products.find(p => p.id === id);
      
      if (product) {
        set({ 
          currentProduct: {
            ...product
          }, 
          loading: false 
        });
      } else {
        set({ 
          error: 'Product not found', 
          loading: false 
        });
      }
    }, 300);
  },
  
  searchProducts: (query) => {
    set({ loading: true });
    
    // Simulate API call delay
    setTimeout(() => {
      if (!query.trim()) {
        set({ 
          filteredProducts: products, 
          loading: false 
        });
        return;
      }
      
      const searchQuery = query.toLowerCase().trim();
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery) ||
        product.category.toLowerCase().includes(searchQuery) ||
        (product.subCategory && product.subCategory.toLowerCase().includes(searchQuery))
      );
      
      set({ 
        filteredProducts: filtered, 
        loading: false 
      });
    }, 300);
  },
  
  filterProducts: (filter) => {
    set({ loading: true });
    
    // Simulate API call delay
    setTimeout(() => {
      let filtered = [...products];
      
      // Filter by category
      if (filter.categories && filter.categories.length > 0) {
        filtered = filtered.filter(product => 
          filter.categories!.includes(product.category)
        );
      }
      
      // Filter by subcategory
      if (filter.subCategories && filter.subCategories.length > 0) {
        filtered = filtered.filter(product => 
          product.subCategory && filter.subCategories!.includes(product.subCategory)
        );
      }
      
      // Filter by price range
      if (filter.price) {
        filtered = filtered.filter(product => 
          product.price >= filter.price!.min && product.price <= filter.price!.max
        );
      }
      
      // Filter by minimum rating
      if (filter.rating) {
        filtered = filtered.filter(product => 
          product.rating >= filter.rating!
        );
      }
      
      set({ 
        filteredProducts: filtered, 
        loading: false 
      });
    }, 300);
  },
  
  addReview: (productId, userId, username, rating, comment) => {
    // Analyze sentiment
    const sentiment = analyzeReviewSentiment(comment);
    
    const review: Review = {
      id: `review-${Date.now()}`,
      userId,
      username,
      rating,
      comment,
      sentiment,
      date: new Date().toISOString().split('T')[0]
    };
    
    set(state => {
      const updatedProducts = state.products.map(product => 
        product.id === productId
          ? { ...product, reviews: [review, ...product.reviews] }
          : product
      );
      
      const updatedCurrentProduct = state.currentProduct && state.currentProduct.id === productId
        ? { ...state.currentProduct, reviews: [review, ...state.currentProduct.reviews] }
        : state.currentProduct;
        
      return {
        products: updatedProducts,
        filteredProducts: updatedProducts,
        currentProduct: updatedCurrentProduct
      };
    });
  },
  
  addSuggestion: (productId, content) => {
    // Simple mock sentiment analysis for the suggestion
    const sentiment = content.toLowerCase().includes('improve') || content.toLowerCase().includes('issue')
      ? 'negative'
      : content.toLowerCase().includes('love') || content.toLowerCase().includes('great')
        ? 'positive'
        : 'neutral';
    
    const newSuggestion: Suggestion = {
      id: `user-suggestion-${Date.now()}`,
      productId,
      content,
      source: 'user',
      sentiment: sentiment as 'positive' | 'neutral' | 'negative'
    };
    
    // Update the suggestions object
    suggestions[productId] = [newSuggestion, ...suggestions[productId]];
  }
}));