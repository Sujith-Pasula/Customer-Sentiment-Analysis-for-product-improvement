import React from 'react';
import { Lightbulb, MessageSquare } from 'lucide-react';
import { Suggestion } from '../types';

interface SuggestionItemProps {
  suggestion: Suggestion;
}

const SuggestionItem: React.FC<SuggestionItemProps> = ({ suggestion }) => {
  const sentimentColor = 
    suggestion.sentiment === 'positive'
      ? 'border-green-200 bg-green-50'
      : suggestion.sentiment === 'negative'
        ? 'border-red-200 bg-red-50'
        : 'border-yellow-200 bg-yellow-50';
        
  const sourceIcon = suggestion.source === 'ai' 
    ? <Lightbulb className="w-5 h-5 text-primary-500" /> 
    : <MessageSquare className="w-5 h-5 text-accent-500" />;

  return (
    <div className={`p-3 rounded-md border ${sentimentColor} mb-3`}>
      <div className="flex items-start">
        <div className="mr-2 mt-1">
          {sourceIcon}
        </div>
        <div>
          <div className="flex items-center">
            <span className="text-sm font-medium">
              {suggestion.source === 'ai' ? 'AI Suggestion' : 'User Suggestion'}
            </span>
          </div>
          <p className="mt-1 text-sm">{suggestion.content}</p>
        </div>
      </div>
    </div>
  );
};

export default SuggestionItem;