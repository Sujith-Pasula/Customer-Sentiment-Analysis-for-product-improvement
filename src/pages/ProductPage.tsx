import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, MessageSquare, Lightbulb } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import ReviewItem from '../components/ReviewItem';
import SentimentChart from '../components/SentimentChart';
import SuggestionItem from '../components/SuggestionItem';
import { suggestions } from '../utils/dummyData';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentProduct, fetchProductById, addReview, loading, error } = useProductStore();
  const addToCart = useCartStore(state => state.addToCart);
  const { user, isAuthenticated } = useAuthStore();
  
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [suggestionText, setSuggestionText] = useState<string>('');
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [showSuggestionForm, setShowSuggestionForm] = useState<boolean>(false);
  
  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);
  
  const handleAddToCart = () => {
    if (currentProduct) {
      addToCart(currentProduct.id);
    }
  };
  
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAuthenticated && user && currentProduct && reviewComment) {
      addReview(
        currentProduct.id,
        user.id,
        user.username,
        reviewRating,
        reviewComment
      );
      
      setReviewComment('');
      setReviewRating(5);
      setShowReviewForm(false);
    }
  };
  
  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentProduct && suggestionText) {
      // Add the suggestion (in real app, this would use the store's addSuggestion method)
      suggestions[currentProduct.id].unshift({
        id: `suggestion-${Date.now()}`,
        productId: currentProduct.id,
        content: suggestionText,
        source: 'user',
        sentiment: 'neutral' // In a real app, this would be determined by AI
      });
      
      setSuggestionText('');
      setShowSuggestionForm(false);
    }
  };
  
  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error || !currentProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold text-gray-800">Product Not Found</h2>
        <p className="mt-2 text-gray-600">The product you are looking for does not exist.</p>
      </div>
    );
  }
  
  // Calculate overall sentiment from all reviews
  const overallSentiment = {
    positive: currentProduct.reviews.reduce((sum, review) => sum + review.sentiment.positive, 0) / currentProduct.reviews.length,
    negative: currentProduct.reviews.reduce((sum, review) => sum + review.sentiment.negative, 0) / currentProduct.reviews.length,
    neutral: currentProduct.reviews.reduce((sum, review) => sum + review.sentiment.neutral, 0) / currentProduct.reviews.length,
    overall: 'neutral' as 'positive' | 'neutral' | 'negative'
  };
  
  // Determine overall sentiment
  if (overallSentiment.positive > overallSentiment.negative && overallSentiment.positive > overallSentiment.neutral) {
    overallSentiment.overall = 'positive';
  } else if (overallSentiment.negative > overallSentiment.positive && overallSentiment.negative > overallSentiment.neutral) {
    overallSentiment.overall = 'negative';
  }
  
  // Get product suggestions
  const productSuggestions = suggestions[currentProduct.id] || [];
  
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:grid md:grid-cols-2 md:gap-10 p-6">
            {/* Product Image */}
            <div className="mb-6 md:mb-0">
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={currentProduct.imageUrl}
                  alt={currentProduct.name}
                  className="w-full h-96 object-contain"
                />
              </div>
            </div>
            
            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-gray-900">{currentProduct.name}</h1>
              
              <div className="flex items-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < Math.floor(currentProduct.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
                <span className="ml-2 text-gray-600">
                  {currentProduct.rating.toFixed(1)} ({currentProduct.reviews.length} reviews)
                </span>
              </div>
              
              <div className="mt-4">
                <span className="text-3xl font-bold text-primary-600">
                  {formatPrice(currentProduct.price)}
                </span>
              </div>
              
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900">Description</h3>
                <p className="mt-2 text-gray-600">{currentProduct.description}</p>
              </div>
              
              {currentProduct.features && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900">Features</h3>
                  <ul className="mt-2 pl-5 list-disc text-gray-600">
                    {currentProduct.features.map((feature, index) => (
                      <li key={index} className="mt-1">{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-8 space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors">
                    <Heart className="w-5 h-5 mr-2" />
                    Wishlist
                  </button>
                  <button className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors">
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sentiment Analysis and Reviews */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
              {isAuthenticated ? (
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Write a Review
                </button>
              ) : (
                <button
                  onClick={() => window.location.href = '/login'}
                  className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors"
                >
                  Login to Review
                </button>
              )}
            </div>
            
            {/* Review Form */}
            {showReviewForm && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-3">Write Your Review</h3>
                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= reviewRating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review
                    </label>
                    <textarea
                      rows={4}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Share your experience with this product..."
                      required
                    ></textarea>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Reviews List */}
            <div>
              {currentProduct.reviews.length > 0 ? (
                <div className="space-y-0">
                  {currentProduct.reviews.map((review) => (
                    <ReviewItem key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Sentiment Analysis and Suggestions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sentiment Analysis</h2>
              {currentProduct.reviews.length > 0 ? (
                <>
                  <SentimentChart sentiment={overallSentiment} />
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Overall Sentiment</h3>
                    <div className={`px-4 py-3 rounded-md ${
                      overallSentiment.overall === 'positive' 
                        ? 'bg-green-100 text-green-800' 
                        : overallSentiment.overall === 'negative'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      <p className="font-medium">
                        {overallSentiment.overall === 'positive' 
                          ? 'Customers generally love this product' 
                          : overallSentiment.overall === 'negative'
                            ? 'Customers have concerns about this product'
                            : 'Customers have mixed feelings about this product'}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No data available yet</p>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Product Suggestions</h2>
                {isAuthenticated && (
                  <button
                    onClick={() => setShowSuggestionForm(!showSuggestionForm)}
                    className="flex items-center text-primary-600 hover:text-primary-700"
                  >
                    <Lightbulb className="w-5 h-5 mr-1" />
                    Add Suggestion
                  </button>
                )}
              </div>
              
              {/* Suggestion Form */}
              {showSuggestionForm && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <form onSubmit={handleSuggestionSubmit}>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Suggestion for Improvement
                      </label>
                      <textarea
                        rows={3}
                        value={suggestionText}
                        onChange={(e) => setSuggestionText(e.target.value)}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Share your ideas to improve this product..."
                        required
                      ></textarea>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowSuggestionForm(false)}
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Suggestions List */}
              <div>
                {productSuggestions.length > 0 ? (
                  <div className="space-y-0">
                    {productSuggestions.map((suggestion) => (
                      <SuggestionItem key={suggestion.id} suggestion={suggestion} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No suggestions yet. Be the first to suggest an improvement!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;