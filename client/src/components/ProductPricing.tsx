// FILE LOCATION: client/src/components/ProductPricing.tsx
import { useState, useEffect } from 'react';
import { parseGoogleShoppingParams, storeGoogleParams } from '@/lib/urlParams';
import { Badge } from '@/components/ui/badge';
import { Check, AlertCircle } from 'lucide-react';
import UrgencyTimer from './UrgencyTimer';

interface ProductPricingProps {
  basePrice: number;
  productName: string;
}

export default function ProductPricing({ basePrice, productName }: ProductPricingProps) {
  const [googleParams, setGoogleParams] = useState(parseGoogleShoppingParams());
  
  useEffect(() => {
    const params = parseGoogleShoppingParams();
    storeGoogleParams(params);
    setGoogleParams(params);
  }, []);

  if (googleParams.fromGoogle) {
    // Google Shopping Visitor - Show Their Price with Discount
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 space-y-4">
          {/* Special Offer Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-red-600 text-white text-sm font-bold px-3 py-1 hover:bg-red-600">
              ⚡ SPECIAL GOOGLE OFFER
            </Badge>
            <Badge variant="outline" className="text-sm">
              {googleParams.state} Residents
            </Badge>
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl md:text-4xl font-bold text-green-600">
                ${googleParams.finalPrice.toLocaleString()}
              </span>
              <span className="text-xl md:text-2xl text-gray-400 line-through">
                ${googleParams.originalPrice.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
              <Check className="w-4 h-4 flex-shrink-0" />
              You Save ${googleParams.discount.toLocaleString()} Today!
            </div>
            
            <p className="text-sm text-gray-600">
              Price includes delivery to {googleParams.state}
            </p>
          </div>

          {/* What's Included */}
          <div className="space-y-2 pt-2 border-t border-green-200">
            <p className="font-semibold text-gray-900">Included in Your Price:</p>
            <ul className="space-y-1 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                Free delivery to {googleParams.state}
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                Professional installation guide
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                Lifetime warranty on concrete
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                FEMA-tested protection (P-361 & ICC 500)
              </li>
            </ul>
          </div>
        </div>

        {/* Urgency Timer */}
        <UrgencyTimer />

        {/* Trust Note */}
        <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-4 text-sm">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-yellow-800 mb-1">Limited Time Offer</p>
              <p className="text-yellow-700">
                This ${googleParams.discount.toLocaleString()} discount is exclusive to Google visitors 
                and expires when the timer reaches zero
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular Website Visitor - Show Base Price
  return (
    <div className="space-y-4">
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div className="space-y-2">
          <div className="text-3xl md:text-4xl font-bold text-gray-900">
            ${basePrice.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600">
            Base price • Delivery calculated at checkout
          </p>
        </div>

        {/* Standard Features */}
        <div className="space-y-2 pt-2 border-t">
          <p className="font-semibold text-gray-900">What's Included:</p>
          <ul className="space-y-1 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
              Professional installation guide
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
              Lifetime warranty on concrete
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
              FEMA-tested protection (P-361 & ICC 500)
            </li>
          </ul>
        </div>
      </div>

      {/* Note about shipping - Regular visitors will see calculator below */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-medium mb-1">📍 Delivery Pricing</p>
        <p>Use the calculator below to estimate your delivery cost ($5.20/mile from our facility)</p>
      </div>
    </div>
  );
}
