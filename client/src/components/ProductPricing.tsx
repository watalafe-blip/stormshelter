import { getUrlParams, getDiscount } from '@/lib/urlParams';
import { Badge } from '@/components/ui/badge';

interface ProductPricingProps {
  basePrice?: number;
  className?: string;
}

export default function ProductPricing({ basePrice = 4250, className = '' }: ProductPricingProps) {
  const { price, isGoogleVisitor } = getUrlParams();
  
  if (!isGoogleVisitor || price === null) {
    return (
      <div className={`space-y-2 ${className}`} data-testid="standard-pricing">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-black text-[#3E2723]" data-testid="product-price">
            ${basePrice.toLocaleString()}
          </span>
          <span className="text-lg text-stone-400 line-through">$5,499</span>
        </div>
      </div>
    );
  }

  const discount = getDiscount();
  const originalPrice = price + discount;
  
  return (
    <div className={`space-y-3 ${className}`} data-testid="dynamic-pricing">
      <div className="flex items-center gap-2">
        <Badge className="bg-green-600 text-white font-bold px-3 py-1">
          SPECIAL OFFER - ${discount} OFF
        </Badge>
      </div>
      
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-black text-[#3E2723]" data-testid="dynamic-price">
          ${price.toLocaleString()}
        </span>
        <span className="text-lg text-stone-400 line-through" data-testid="original-price">
          ${originalPrice.toLocaleString()}
        </span>
      </div>
      
      <p className="text-green-600 font-bold text-sm" data-testid="savings-message">
        You save ${discount} with this exclusive offer!
      </p>
    </div>
  );
}
