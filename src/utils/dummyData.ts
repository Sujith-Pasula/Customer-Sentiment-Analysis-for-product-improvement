import { Product, Category, Review, Suggestion } from '../types';

// Generate a random review date within the last 6 months
const getRandomDate = () => {
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);
  
  const randomTimestamp = sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime());
  const date = new Date(randomTimestamp);
  return date.toISOString().split('T')[0];
};

// Generate random reviews for products
const generateReviews = (count: number, productId: string): Review[] => {
  const reviews: Review[] = [];
  const sentimentOptions: Array<'positive' | 'neutral' | 'negative'> = ['positive', 'neutral', 'negative'];
  const usernames = ['Aarav', 'Diya', 'Vihaan', 'Isha', 'Advait', 'Ananya', 'Reyansh', 'Saanvi', 'Vivaan', 'Anika'];
  const positiveComments = [
    'Love this product! Works exactly as described.',
    'Amazing quality for the price. Highly recommend!',
    'Very satisfied with my purchase. Will buy again.',
    'This exceeded my expectations. Great value!',
    'Perfect for my needs. So happy with this purchase!'
  ];
  const neutralComments = [
    "It's okay. Does what it's supposed to do.",
    "Average product. Nothing special but works fine.",
    "Good enough for the price, but there are better options.",
    "Decent quality. Some minor issues but overall satisfactory.",
    "It serves its purpose, but I wouldn't call it exceptional."
  ];
  const negativeComments = [
    'Disappointed with the quality. Not worth the price.',
    'Broke within a week of use. Would not recommend.',
    "Doesn't work as advertised. Save your money.",
    'Poor build quality. Expected better for the price.',
    'Had issues from day one. Very frustrating experience.'
  ];

  for (let i = 0; i < count; i++) {
    const rating = Math.floor(Math.random() * 5) + 1;
    let sentiment: 'positive' | 'neutral' | 'negative';
    let comment = '';

    if (rating >= 4) {
      sentiment = 'positive';
      comment = positiveComments[Math.floor(Math.random() * positiveComments.length)];
    } else if (rating === 3) {
      sentiment = 'neutral';
      comment = neutralComments[Math.floor(Math.random() * neutralComments.length)];
    } else {
      sentiment = 'negative';
      comment = negativeComments[Math.floor(Math.random() * negativeComments.length)];
    }

    const positive = sentiment === 'positive' ? 0.7 + Math.random() * 0.3 : sentiment === 'neutral' ? 0.3 + Math.random() * 0.2 : Math.random() * 0.2;
    const negative = sentiment === 'negative' ? 0.7 + Math.random() * 0.3 : sentiment === 'neutral' ? 0.3 + Math.random() * 0.2 : Math.random() * 0.2;
    const neutral = 1 - positive - negative;

    reviews.push({
      id: `review-${productId}-${i}`,
      userId: `user-${i}`,
      username: usernames[Math.floor(Math.random() * usernames.length)],
      rating,
      comment,
      sentiment: {
        positive,
        neutral,
        negative,
        overall: sentiment
      },
      date: getRandomDate()
    });
  }

  return reviews;
};

// Generate suggestions for products
const generateSuggestions = (productId: string): Suggestion[] => {
  const aiSuggestions = [
    { content: 'Consider improving battery life based on user feedback', sentiment: 'negative' },
    { content: 'Users love the design, consider expanding color options', sentiment: 'positive' },
    { content: 'The interface could be more user-friendly', sentiment: 'neutral' },
    { content: 'Many users report connectivity issues', sentiment: 'negative' },
    { content: 'The durability is highly praised, maintain this quality', sentiment: 'positive' }
  ];
  const userSuggestions = [
    { content: 'Add a water-resistant feature', sentiment: 'neutral' },
    { content: "The size is perfect, don't change it", sentiment: 'positive' },
    { content: 'The buttons are hard to press', sentiment: 'negative' },
    { content: 'Would love to see more storage options', sentiment: 'neutral' },
    { content: 'The sound quality is amazing, keep it up!', sentiment: 'positive' }
  ];

  const suggestions: Suggestion[] = [];
  
  // Add 2-3 AI suggestions
  const numAiSuggestions = Math.floor(Math.random() * 2) + 2;
  for (let i = 0; i < numAiSuggestions; i++) {
    const suggestion = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
    suggestions.push({
      id: `ai-suggestion-${productId}-${i}`,
      productId,
      content: suggestion.content,
      source: 'ai',
      sentiment: suggestion.sentiment as 'positive' | 'neutral' | 'negative'
    });
  }
  
  // Add 1-2 user suggestions
  const numUserSuggestions = Math.floor(Math.random() * 2) + 1;
  for (let i = 0; i < numUserSuggestions; i++) {
    const suggestion = userSuggestions[Math.floor(Math.random() * userSuggestions.length)];
    suggestions.push({
      id: `user-suggestion-${productId}-${i}`,
      productId,
      content: suggestion.content,
      source: 'user',
      sentiment: suggestion.sentiment as 'positive' | 'neutral' | 'negative'
    });
  }
  
  return suggestions;
};

export const categories: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    imageUrl: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg',
    subCategories: [
      { id: 'wearables', name: 'Wearables' },
      { id: 'audio', name: 'Audio' },
      { id: 'computers', name: 'Computers' },
      { id: 'gaming', name: 'Gaming' }
    ]
  },
  {
    id: 'fashion',
    name: 'Fashion',
    imageUrl: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg',
    subCategories: [
      { id: 'mens', name: "Men's Clothing" },
      { id: 'womens', name: "Women's Clothing" },
      { id: 'formal', name: 'Formal Wear' },
      { id: 'casual', name: 'Casual Wear' }
    ]
  },
  {
    id: 'home-kitchen',
    name: 'Home & Kitchen',
    imageUrl: 'https://images.pexels.com/photos/1358900/pexels-photo-1358900.jpeg',
    subCategories: [
      { id: 'cookware', name: 'Cookware' },
      { id: 'kitchenware', name: 'Kitchenware' },
      { id: 'containers', name: 'Containers' },
      { id: 'utensils', name: 'Utensils' }
    ]
  },
  {
    id: 'sports-fitness',
    name: 'Sports & Fitness',
    imageUrl: 'https://images.pexels.com/photos/1092878/pexels-photo-1092878.jpeg',
    subCategories: [
      { id: 'equipment', name: 'Equipment' },
      { id: 'clothing', name: 'Sports Clothing' },
      { id: 'accessories', name: 'Accessories' },
      { id: 'recovery', name: 'Recovery' }
    ]
  },
  {
    id: 'health-beauty',
    name: 'Health & Beauty',
    imageUrl: 'https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg',
    subCategories: [
      { id: 'skincare', name: 'Skincare' },
      { id: 'haircare', name: 'Haircare' },
      { id: 'oils', name: 'Essential Oils' },
      { id: 'tools', name: 'Beauty Tools' }
    ]
  },
  {
    id: 'books-media',
    name: 'Books & Media',
    imageUrl: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg',
    subCategories: [
      { id: 'fiction', name: 'Fiction' },
      { id: 'self-help', name: 'Self-Help' },
      { id: 'educational', name: 'Educational' },
      { id: 'planners', name: 'Planners' }
    ]
  },
  {
    id: 'automotive',
    name: 'Automotive',
    imageUrl: 'https://images.pexels.com/photos/248747/pexels-photo-248747.jpeg',
    subCategories: [
      { id: 'accessories', name: 'Accessories' },
      { id: 'cleaning', name: 'Cleaning' },
      { id: 'electronics', name: 'Car Electronics' },
      { id: 'safety', name: 'Safety' }
    ]
  },
  {
    id: 'baby-kids',
    name: 'Baby & Kids',
    imageUrl: 'https://images.pexels.com/photos/5691862/pexels-photo-5691862.jpeg',
    subCategories: [
      { id: 'care', name: 'Baby Care' },
      { id: 'feeding', name: 'Feeding' },
      { id: 'toys', name: 'Toys' },
      { id: 'education', name: 'Educational' }
    ]
  },
  {
    id: 'footwear',
    name: 'Footwear',
    imageUrl: 'https://images.pexels.com/photos/267294/pexels-photo-267294.jpeg',
    subCategories: [
      { id: 'sports', name: 'Sports Shoes' },
      { id: 'casual', name: 'Casual Shoes' },
      { id: 'formal', name: 'Formal Shoes' },
      { id: 'sandals', name: 'Sandals & Slippers' }
    ]
  },
  {
    id: 'toys',
    name: 'Toys & Games',
    imageUrl: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg',
    subCategories: [
      { id: 'remote', name: 'Remote Control' },
      { id: 'building', name: 'Building Toys' },
      { id: 'plush', name: 'Plush Toys' },
      { id: 'educational', name: 'Educational Toys' }
    ]
  }
];

export const products: Product[] = [
  // Electronics
  {
    id: 'product-1',
    name: 'Digital Watch Pro',
    category: 'electronics',
    subCategory: 'wearables',
    price: 2499,
    rating: 4.2,
    description: 'Advanced digital watch with heart rate monitoring, step counting, and smartphone notifications. Water-resistant up to 50 meters.',
    imageUrl: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
    reviews: generateReviews(12, 'product-1'),
    features: ['Heart rate monitoring', 'Step counting', 'Smartphone notifications', 'Water-resistant (50m)', '5-day battery life']
  },
  {
    id: 'product-2',
    name: 'SmartWatch Elite',
    category: 'electronics',
    subCategory: 'wearables',
    price: 12999,
    rating: 4.7,
    description: 'Premium smartwatch with AMOLED display, blood oxygen monitoring, ECG, GPS, and 10-day battery life. Compatible with Android and iOS.',
    imageUrl: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg',
    reviews: generateReviews(15, 'product-2'),
    features: ['AMOLED display', 'Blood oxygen monitoring', 'ECG functionality', 'Built-in GPS', '10-day battery life']
  },
  {
    id: 'product-3',
    name: 'Bluetooth AirPods Pro',
    category: 'electronics',
    subCategory: 'audio',
    price: 9999,
    rating: 4.5,
    description: 'True wireless earbuds with active noise cancellation, transparency mode, and spatial audio. Includes wireless charging case.',
    imageUrl: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg',
    reviews: generateReviews(20, 'product-3'),
    features: ['Active noise cancellation', 'Transparency mode', 'Spatial audio', 'Water and sweat resistant', '24-hour total battery life']
  },
  {
    id: 'product-4',
    name: 'Bluetooth Neckband Elite',
    category: 'electronics',
    subCategory: 'audio',
    price: 1899,
    rating: 4.1,
    description: 'Comfortable neckband earphones with deep bass, 20-hour battery life, and IPX5 water resistance. Ideal for workouts and daily commute.',
    imageUrl: 'https://images.pexels.com/photos/2651794/pexels-photo-2651794.jpeg',
    reviews: generateReviews(18, 'product-4'),
    features: ['Deep bass technology', '20-hour battery life', 'IPX5 water resistance', 'Magnetic earbuds', 'Voice assistant support']
  },
  {
    id: 'product-5',
    name: 'UltraBook Pro 14"',
    category: 'electronics',
    subCategory: 'computers',
    price: 68999,
    rating: 4.8,
    description: 'Ultra-thin and light laptop with 14" IPS display, 16GB RAM, 512GB SSD, and all-day battery life. Perfect for professionals and students.',
    imageUrl: 'https://images.pexels.com/photos/18105/pexels-photo.jpg',
    reviews: generateReviews(10, 'product-5'),
    features: ['14" IPS display', '16GB RAM', '512GB SSD', 'Backlit keyboard', '12-hour battery life']
  },
  {
    id: 'product-6',
    name: 'PlayStation 5 Digital Edition',
    category: 'electronics',
    subCategory: 'gaming',
    price: 44999,
    rating: 4.9,
    description: 'Next-generation gaming console with lightning-fast loading, stunning 4K graphics, and immersive DualSense controller.',
    imageUrl: 'https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg',
    reviews: generateReviews(25, 'product-6'),
    features: ['4K gaming at up to 120fps', 'Ray tracing technology', '825GB SSD storage', 'Backward compatibility', '3D audio technology']
  },
  
  // Fashion
  {
    id: 'product-7',
    name: "Men's Cotton T-shirt (Pack of 3)",
    category: 'fashion',
    subCategory: 'mens',
    price: 999,
    rating: 4.3,
    description: 'Comfortable 100% cotton t-shirts perfect for daily wear. Available in multiple colors and sizes.',
    imageUrl: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg',
    reviews: generateReviews(30, 'product-7'),
    features: ['100% cotton', 'Regular fit', 'Crew neck', 'Short sleeves', 'Machine washable']
  },
  {
    id: 'product-8',
    name: "Women's Casual T-shirt",
    category: 'fashion',
    subCategory: 'womens',
    price: 799,
    rating: 4.4,
    description: 'Stylish and comfortable women\'s t-shirt made from premium cotton. Perfect for casual outings.',
    imageUrl: 'https://images.pexels.com/photos/6311387/pexels-photo-6311387.jpeg',
    reviews: generateReviews(22, 'product-8'),
    features: ['Premium cotton blend', 'Relaxed fit', 'V-neck', 'Short sleeves', 'Multiple color options']
  },
  {
    id: 'product-9',
    name: "Men's Slim Fit Jeans",
    category: 'fashion',
    subCategory: 'mens',
    price: 1499,
    rating: 4.2,
    description: 'Stylish slim fit jeans for men with stretchable denim for maximum comfort. Available in various washes.',
    imageUrl: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg',
    reviews: generateReviews(18, 'product-9'),
    features: ['Stretchable denim', 'Slim fit', '5-pocket design', 'Button closure', 'Machine washable']
  },
  {
    id: 'product-10',
    name: "Women's High-Rise Jeans",
    category: 'fashion',
    subCategory: 'womens',
    price: 1699,
    rating: 4.6,
    description: 'High-rise jeans with stretchable fabric for a flattering fit. Perfect for casual and semi-formal occasions.',
    imageUrl: 'https://images.pexels.com/photos/1346187/pexels-photo-1346187.jpeg',
    reviews: generateReviews(24, 'product-10'),
    features: ['High-rise fit', 'Stretchable fabric', 'Skinny leg', 'Button and zip closure', 'Available in multiple washes']
  },
  
  // Home & Kitchen
  {
    id: 'product-11',
    name: 'Non-stick Fry Pan',
    category: 'home-kitchen',
    subCategory: 'cookware',
    price: 899,
    rating: 4.5,
    description: 'Premium non-stick fry pan with durable coating and comfortable handle. Suitable for all cooktops including induction.',
    imageUrl: 'https://images.pexels.com/photos/6996091/pexels-photo-6996091.jpeg',
    reviews: generateReviews(35, 'product-11'),
    features: ['Non-stick coating', 'Induction compatible', 'Ergonomic handle', 'Dishwasher safe', '24cm diameter']
  },
  {
    id: 'product-12',
    name: 'Electric Kettle 1.8L',
    category: 'home-kitchen',
    subCategory: 'kitchenware',
    price: 999,
    rating: 4.7,
    description: 'Fast-boiling electric kettle with auto shut-off feature and boil-dry protection. Perfect for making tea, coffee, or instant meals.',
    imageUrl: 'https://images.pexels.com/photos/6210933/pexels-photo-6210933.jpeg',
    reviews: generateReviews(40, 'product-12'),
    features: ['1.8L capacity', 'Auto shut-off', 'Boil-dry protection', 'Concealed heating element', 'BPA-free']
  },
  
  // More products can be added...
  
  // Sports & Fitness
  {
    id: 'product-13',
    name: 'Adjustable Dumbbell Set (2-24kg)',
    category: 'sports-fitness',
    subCategory: 'equipment',
    price: 7999,
    rating: 4.8,
    description: 'Space-saving adjustable dumbbells that replace 8 pairs of weights. Easy weight selection with dial system.',
    imageUrl: 'https://images.pexels.com/photos/949131/pexels-photo-949131.jpeg',
    reviews: generateReviews(28, 'product-13'),
    features: ['Adjustable from 2kg to 24kg', 'Space-saving design', 'Easy dial adjustment', 'Durable construction', 'Includes storage tray']
  },
  {
    id: 'product-14',
    name: 'Premium Yoga Mat',
    category: 'sports-fitness',
    subCategory: 'equipment',
    price: 1299,
    rating: 4.6,
    description: 'Eco-friendly yoga mat with excellent grip and cushioning. Includes carrying strap for easy transport.',
    imageUrl: 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg',
    reviews: generateReviews(32, 'product-14'),
    features: ['6mm thickness', 'Non-slip texture', 'Eco-friendly TPE material', 'Carrying strap included', 'Moisture-resistant']
  },
  
  // Footwear
  {
    id: 'product-15',
    name: "Men's Running Sports Shoes",
    category: 'footwear',
    subCategory: 'sports',
    price: 2499,
    rating: 4.4,
    description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper. Provides excellent traction on various surfaces.',
    imageUrl: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
    reviews: generateReviews(38, 'product-15'),
    features: ['Breathable mesh upper', 'Responsive cushioning', 'Rubber outsole', 'Reflective details', 'Lace-up closure']
  },
  {
    id: 'product-16',
    name: "Women's Slip-on Sneakers",
    category: 'footwear',
    subCategory: 'casual',
    price: 1799,
    rating: 4.5,
    description: 'Comfortable slip-on sneakers with memory foam insole and flexible sole. Perfect for everyday wear.',
    imageUrl: 'https://images.pexels.com/photos/19090/pexels-photo.jpg',
    reviews: generateReviews(26, 'product-16'),
    features: ['Memory foam insole', 'Flexible sole', 'Breathable upper', 'Easy slip-on design', 'Lightweight construction']
  },
  
  // Toys
  {
    id: 'product-17',
    name: 'Remote Control Racing Car',
    category: 'toys',
    subCategory: 'remote',
    price: 1499,
    rating: 4.3,
    description: 'High-speed remote control car with rechargeable battery and durable construction. Can perform stunts and tricks.',
    imageUrl: 'https://images.pexels.com/photos/35619/capri-ford-oldtimer-automotive.jpg',
    reviews: generateReviews(22, 'product-17'),
    features: ['4-wheel drive', '20km/h top speed', 'Rechargeable battery', '2.4GHz remote control', 'Performs stunts and flips']
  },
  {
    id: 'product-18',
    name: 'Building Blocks Set (120pcs)',
    category: 'toys',
    subCategory: 'building',
    price: 899,
    rating: 4.7,
    description: 'Colorful building blocks set for children to develop creativity and motor skills. Compatible with major building block brands.',
    imageUrl: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg',
    reviews: generateReviews(30, 'product-18'),
    features: ['120 pieces', 'Compatible with major brands', 'Vibrant colors', 'Storage container included', 'Non-toxic materials']
  }
];

// Generate suggestions for all products
export const suggestions: { [key: string]: Suggestion[] } = {};
products.forEach(product => {
  suggestions[product.id] = generateSuggestions(product.id);
});

export const analyzeReviewSentiment = (review: string): SentimentScore => {
  // This is a mock sentiment analysis function
  // In a real application, this would call an AI/ML service
  
  const positiveWords = ['love', 'great', 'excellent', 'best', 'perfect', 'amazing', 'fantastic', 'happy', 'satisfied', 'recommend'];
  const negativeWords = ['bad', 'poor', 'terrible', 'worst', 'hate', 'disappointed', 'broken', 'issue', 'problem', 'refund'];
  
  const lowercaseReview = review.toLowerCase();
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    if (lowercaseReview.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (lowercaseReview.includes(word)) negativeCount++;
  });
  
  const total = positiveCount + negativeCount || 1; // Avoid division by zero
  const positive = positiveCount / total;
  const negative = negativeCount / total;
  const neutral = 1 - positive - negative;
  
  let overall: 'positive' | 'neutral' | 'negative';
  
  if (positive > negative && positive > neutral) {
    overall = 'positive';
  } else if (negative > positive && negative > neutral) {
    overall = 'negative';
  } else {
    overall = 'neutral';
  }
  
  return {
    positive,
    negative,
    neutral,
    overall
  };
};