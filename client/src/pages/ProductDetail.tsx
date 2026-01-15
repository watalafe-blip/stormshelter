// FILE LOCATION: client/src/pages/ProductDetail.tsx
// THIS IS A TEMPLATE - Adapt to your existing ProductDetail.tsx structure

import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

// NEW IMPORTS - Add these to your existing imports
import ProductPricing from '@/components/ProductPricing';
import { parseGoogleShoppingParams } from '@/lib/urlParams';

// Your existing imports...
import Layout from '@/components/layout/Layout';
// ... other imports

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  
  // Your existing product query
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`);
      return response.json();
    }
  });

  // NEW: Track Google Shopping visitors
  useEffect(() => {
    const googleParams = parseGoogleShoppingParams();
    
    if (googleParams.fromGoogle) {
      console.log('🎯 Google Shopping visitor detected:', {
        state: googleParams.state,
        price: googleParams.originalPrice,
        discount: googleParams.discount,
        finalPrice: googleParams.finalPrice,
        product: product?.name
      });
      
      // Optional: Send to Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'google_shopping_visit', {
          state: googleParams.state,
          price: googleParams.originalPrice,
          product_name: product?.name || 'Unknown Product'
        });
      }
    }
  }, [product]);

  // NEW: Get Google params for conditional rendering
  const googleParams = parseGoogleShoppingParams();

  if (isLoading) {
    return <Layout><div>Loading...</div></Layout>;
  }

  if (!product) {
    return <Layout><div>Product not found</div></Layout>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images - Your existing code */}
          <div>
            {/* Your image gallery component */}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Title */}
            <h1 className="text-3xl font-bold">{product.name}</h1>

            {/* Product Description */}
            <p className="text-gray-600">{product.description}</p>

            {/* ============================================ */}
            {/* PRICING SECTION - REPLACE YOUR OLD PRICING */}
            {/* ============================================ */}
            
            {/* OLD CODE - Remove this section:
            <div className="text-3xl font-bold">
              ${product.price}
            </div>
            */}

            {/* NEW CODE - Use this instead: */}
            <ProductPricing 
              basePrice={product.price || 4599} 
              productName={product.name || 'Storm Shelter'}
            />

            {/* ============================================ */}
            {/* SHIPPING CALCULATOR - CONDITIONALLY SHOWN */}
            {/* ============================================ */}
            
            {/* Only show for NON-Google visitors */}
            {!googleParams.fromGoogle && (
              <div className="bg-gray-50 border rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-lg">Calculate Delivery Cost</h3>
                
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter ZIP Code"
                      className="flex-1 px-4 py-2 border rounded-lg"
                      maxLength={5}
                    />
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      Calculate
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    Shipping rate: $5.20 per mile from our Oklahoma facility
                  </p>
                </div>
              </div>
            )}

            {/* Add to Cart Button - Your existing code */}
            <button className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
              Add to Cart
            </button>

            {/* Product Features - Your existing code */}
            <div className="space-y-2">
              <h3 className="font-semibold">Features:</h3>
              <ul className="space-y-1 text-gray-700">
                {/* Your features list */}
              </ul>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* FAQ SECTION - ADD AFTER MAIN PRODUCT DETAILS */}
        {/* ============================================ */}
        
        <div className="mt-12 border-t pt-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <details className="bg-gray-50 p-4 rounded-lg group hover:bg-gray-100 transition-colors">
              <summary className="font-semibold cursor-pointer flex items-center justify-between">
                <span>How long does installation take?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-gray-700 leading-relaxed">
                Professional installation typically takes 2-3 days. We coordinate with 
                local contractors in your area and provide detailed installation guidelines. 
                Most installations are completed within one week from delivery.
              </p>
            </details>

            <details className="bg-gray-50 p-4 rounded-lg group hover:bg-gray-100 transition-colors">
              <summary className="font-semibold cursor-pointer flex items-center justify-between">
                <span>Is delivery included in my Google Shopping price?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-gray-700 leading-relaxed">
                Yes! If you arrived from a Google Shopping ad, your price already 
                includes delivery to your state. No hidden fees, no surprises.
              </p>
            </details>

            <details className="bg-gray-50 p-4 rounded-lg group hover:bg-gray-100 transition-colors">
              <summary className="font-semibold cursor-pointer flex items-center justify-between">
                <span>What's the $900 discount about?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-gray-700 leading-relaxed">
                We're running a special promotion exclusively for Google Shopping visitors. 
                This limited-time offer gives you $900 off the total price (including delivery). 
                The discount expires 48 hours after you first clicked our ad.
              </p>
            </details>

            <details className="bg-gray-50 p-4 rounded-lg group hover:bg-gray-100 transition-colors">
              <summary className="font-semibold cursor-pointer flex items-center justify-between">
                <span>Is this FEMA approved?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-gray-700 leading-relaxed">
                Yes! All our shelters meet or exceed FEMA P-361 and ICC 500 standards 
                for tornado protection. They're tested to withstand EF5 tornadoes with 
                250+ mph winds.
              </p>
            </details>

            <details className="bg-gray-50 p-4 rounded-lg group hover:bg-gray-100 transition-colors">
              <summary className="font-semibold cursor-pointer flex items-center justify-between">
                <span>What about warranty?</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-gray-700 leading-relaxed">
                We offer a lifetime warranty on the concrete structure and a 5-year 
                warranty on all doors and hardware. We stand behind our products 100%.
              </p>
            </details>
          </div>

          {/* Contact CTA */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="font-semibold text-lg mb-2">Still have questions?</p>
            <p className="text-gray-600 mb-4">Our team is here to help you make the right decision</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="tel:1-800-555-0123" 
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                📞 Call: 1-800-555-0123
              </a>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                ✉️ Send a Message
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
