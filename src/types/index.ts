export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  price: number;
  rating: number;
  description: string;
  imageUrl: string;
  reviews: Review[];
  features?: string[];
}

export interface Review {
  id: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  sentiment: SentimentScore;
  date: string;
}

export interface SentimentScore {
  positive: number;
  neutral: number;
  negative: number;
  overall: 'positive' | 'neutral' | 'negative';
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Suggestion {
  id: string;
  productId: string;
  content: string;
  source: 'ai' | 'user';
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
  imageUrl: string;
}

export interface SubCategory {
  id: string;
  name: string;
}

export interface Filter {
  price?: {
    min: number;
    max: number;
  };
  rating?: number;
  categories?: string[];
  subCategories?: string[];
}