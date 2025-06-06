import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '../types';

interface ReviewItemProps {
  review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const sentimentColor = 
    review.sentiment.overall === 'positive'
      ? 'bg-green-100 text-green-800'
      : review.sentiment.overall === 'negative'
        ? 'bg-red-100 text-red-800'
        : 'bg-yellow-100 text-yellow-800';

  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-primary-100 rounded-full p-2 mr-3">
            <span className="text-lg font-medium text-primary-700">
              {review.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h4 className="font-medium">{review.username}</h4>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">{review.date}</span>
            </div>
          </div>
        </div>
        
        <span className={`text-xs px-2 py-1 rounded-full ${sentimentColor}`}>
          {review.sentiment.overall.charAt(0).toUpperCase() + review.sentiment.overall.slice(1)}
        </span>
      </div>
      
      <p className="mt-3 text-gray-700">{review.comment}</p>
    </div>
  );
};

export default ReviewItem;