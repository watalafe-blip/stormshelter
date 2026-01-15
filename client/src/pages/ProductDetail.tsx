// FILE LOCATION: client/src/pages/ProductDetail.tsx
// COMPLETE FILE - Replace entire file with this

import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import ProductPricing from '@/components/ProductPricing';
import { parseGoogleShoppingParams } from '@/lib/urlParams';
import { 
  Shield, 
  Truck, 
  Award, 
  CheckCircle2, 
  Clock,
  Users,
  Home
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  features?: string[];
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [quantity, setQuantity] = useState(1);

  // Fetch product data
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['/api/products', id],
    enabled: !!id,
  });

  // Detect Google Shopping visitors
  const googleParams = parseGoogleShoppingParams();
  
  useEffect(() => {
    if (googleParams.fromGoogle && product) {
      console.log('🎯 Google Shopping visitor from', googleParams.state);
    }
  }, [product, googleParams.fromGoogle, googleParams.state]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => setLocation('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    console.log('Adding to cart:', { product, quantity, googleParams });
    setLocation('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-b from-blue-600 to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => setLocation('/')}
            className="flex items-center text-blue-100 hover:text-white mb-6"
          >
            ← Back to Products
          </button>
          <h1 className="text-4xl font-bold">{product.name}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <Home className="w-24 h-24 text-gray-400" />
                </div>
              )}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-semibold">FEMA Certified</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-semibold">Lifetime Warranty</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-semibold">500+ Installed</p>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <ProductPricing 
                basePrice={product.price} 
                productName={product.name}
              />

              <div className="mt-6 pb-6 border-b">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-20 px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full mt-6 bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors"
              >
                Add to Cart - {googleParams.fromGoogle ? 'Pay $500 Deposit' : 'Get Quote'}
              </button>

              <p className="text-center text-sm text-gray-600 mt-3">
                {googleParams.fromGoogle 
                  ? '✓ Price locked in for 48 hours'
                  : '✓ Free consultation included'
                }
              </p>
            </div>

            {!googleParams.fromGoogle && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-blue-900 mb-3 flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Calculate Shipping
                </h3>
                <p className="text-sm text-blue-700 mb-3">
                  Enter your ZIP code to calculate delivery cost
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    className="flex-1 px-4 py-2 border border-blue-300 rounded-lg"
                  />
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Calculate
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Shelter</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {product.description || 'Premium underground storm shelter designed to protect your family during severe weather events. FEMA P-361 and ICC 500 certified for maximum safety.'}
              </p>

              <h3 className="font-bold text-gray-900 mb-3">What's Included:</h3>
              <ul className="space-y-2">
                {(product.features || [
                  'FEMA P-361 & ICC 500 Certified',
                  'Lifetime warranty on concrete structure',
                  '5-year warranty on doors and hardware',
                  'Professional installation guidance',
                  'Free delivery (conditions apply)',
                  'EF5 tornado protection',
                  'Holds 8-12 people comfortably',
                  'Emergency ventilation system'
                ]).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Installation Timeline
              </h3>
              <ol className="space-y-4">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">1</span>
                  <div>
                    <p className="font-semibold">Order Placement</p>
                    <p className="text-sm text-gray-600">Pay deposit and schedule installation</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">2</span>
                  <div>
                    <p className="font-semibold">Site Preparation (2-4 weeks)</p>
                    <p className="text-sm text-gray-600">We coordinate delivery and prep your site</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">3</span>
                  <div>
                    <p className="font-semibold">Installation (2-3 days)</p>
                    <p className="text-sm text-gray-600">Professional team completes installation</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">4</span>
                  <div>
                    <p className="font-semibold">Final Inspection</p>
                    <p className="text-sm text-gray-600">Quality check and walkthrough</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            <details className="bg-white rounded-lg shadow p-6">
              <summary className="font-semibold text-lg cursor-pointer text-gray-900">
                How long does installation take?
              </summary>
              <p className="mt-3 text-gray-700">
                Professional installation typically takes 2-3 days from start to finish.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow p-6">
              <summary className="font-semibold text-lg cursor-pointer text-gray-900">
                Is delivery included in my price?
              </summary>
              <p className="mt-3 text-gray-700">
                {googleParams.fromGoogle 
                  ? `Yes! Delivery to ${googleParams.state} is included in your special price.`
                  : 'Delivery costs vary by location. Enter your ZIP code to calculate shipping.'
                }
              </p>
            </details>

            <details className="bg-white rounded-lg shadow p-6">
              <summary className="font-semibold text-lg cursor-pointer text-gray-900">
                Is this FEMA approved?
              </summary>
              <p className="mt-3 text-gray-700">
                Yes! All shelters meet FEMA P-361 and ICC 500 standards. EF5 tornado rated.
              </p>
            </details>

            {googleParams.fromGoogle && (
              <details className="bg-white rounded-lg shadow p-6 border-2 border-green-500">
                <summary className="font-semibold text-lg cursor-pointer text-green-900">
                  How long is my special Google offer valid?
                </summary>
                <p className="mt-3 text-green-800">
                  Your special pricing is locked in for 48 hours. After that, regular pricing applies.
                </p>
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
