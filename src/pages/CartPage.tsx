import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useProductStore } from '../store/productStore';
import { Product } from '../types';

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const { products, fetchProducts } = useProductStore();
  const [cartProducts, setCartProducts] = useState<Array<Product & { quantity: number }>>([]);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  useEffect(() => {
    if (products.length > 0 && items.length > 0) {
      const productsWithQuantity = items
        .map(item => {
          const product = products.find(p => p.id === item.productId);
          return product ? { ...product, quantity: item.quantity } : null;
        })
        .filter((item): item is Product & { quantity: number } => item !== null);
      
      setCartProducts(productsWithQuantity);
    } else {
      setCartProducts([]);
    }
  }, [products, items]);
  
  // Calculate total price
  const totalPrice = cartProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>
        
        {cartProducts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flow-root">
                    <ul className="-my-6 divide-y divide-gray-200">
                      {cartProducts.map((product) => (
                        <li key={product.id} className="py-6 flex">
                          <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between">
                                <h3 className="text-lg font-medium text-gray-900">
                                  <Link to={`/product/${product.id}`} className="hover:text-primary-600">
                                    {product.name}
                                  </Link>
                                </h3>
                                <p className="ml-4 text-lg font-medium text-gray-900">
                                  {formatPrice(product.price)}
                                </p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500 line-clamp-1">{product.description}</p>
                            </div>
                            
                            <div className="flex-1 flex items-end justify-between">
                              <div className="flex items-center">
                                <label htmlFor={`quantity-${product.id}`} className="sr-only">
                                  Quantity
                                </label>
                                <select
                                  id={`quantity-${product.id}`}
                                  name={`quantity-${product.id}`}
                                  value={product.quantity}
                                  onChange={(e) => updateQuantity(product.id, parseInt(e.target.value, 10))}
                                  className="rounded-md border border-gray-300 text-base font-medium text-gray-700 text-left focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                >
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                    <option key={num} value={num}>
                                      {num}
                                    </option>
                                  ))}
                                </select>
                                
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(product.id)}
                                  className="ml-4 text-red-500 hover:text-red-600"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                              
                              <p className="text-lg font-medium text-gray-900">
                                {formatPrice(product.price * product.quantity)}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => clearCart()}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Clear cart
                    </button>
                    <Link
                      to="/"
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
                
                <div className="flow-root">
                  <dl className="-my-4 divide-y divide-gray-200">
                    <div className="py-4 flex items-center justify-between">
                      <dt className="text-gray-600">Subtotal</dt>
                      <dd className="font-medium text-gray-900">{formatPrice(totalPrice)}</dd>
                    </div>
                    
                    <div className="py-4 flex items-center justify-between">
                      <dt className="text-gray-600">Shipping</dt>
                      <dd className="font-medium text-gray-900">{totalPrice >= 500 ? 'Free' : formatPrice(99)}</dd>
                    </div>
                    
                    <div className="py-4 flex items-center justify-between">
                      <dt className="text-gray-600">Tax</dt>
                      <dd className="font-medium text-gray-900">{formatPrice(totalPrice * 0.18)}</dd>
                    </div>
                    
                    <div className="py-4 flex items-center justify-between">
                      <dt className="text-base font-medium text-gray-900">Total</dt>
                      <dd className="text-xl font-semibold text-primary-600">
                        {formatPrice(totalPrice + (totalPrice >= 500 ? 0 : 99) + (totalPrice * 0.18))}
                      </dd>
                    </div>
                  </dl>
                </div>
                
                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Proceed to Checkout
                  </button>
                </div>
                
                <div className="mt-6 text-center text-sm text-gray-500">
                  <p>Free shipping on orders over ₹500</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-10 text-center">
            <div className="flex flex-col items-center">
              <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added any products to your cart yet.
              </p>
              <Link
                to="/"
                className="px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;