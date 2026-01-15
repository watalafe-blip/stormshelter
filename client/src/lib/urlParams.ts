// FILE LOCATION: client/src/lib/urlParams.ts
// Utility to detect and parse Google Shopping traffic

export interface GoogleShoppingParams {
  fromGoogle: boolean;
  state: string | null;
  price: number | null;
  originalPrice: number;
  discount: number;
  finalPrice: number;
}

/**
 * Parses URL parameters to detect Google Shopping visitors
 * Example URL: /product/1?state=CT&price=10839
 */
export function parseGoogleShoppingParams(): GoogleShoppingParams {
  if (typeof window === 'undefined') {
    // Server-side rendering fallback
    return {
      fromGoogle: false,
      state: null,
      price: null,
      originalPrice: 4599,
      discount: 900,
      finalPrice: 4599
    };
  }

  const params = new URLSearchParams(window.location.search);
  
  const state = params.get('state');
  const priceParam = params.get('price');
  const fromGoogle = !!(state && priceParam);
  
  const originalPrice = priceParam ? parseFloat(priceParam) : 4599;
  const discount = 900;
  const finalPrice = originalPrice - discount;
  
  return {
    fromGoogle,
    state,
    price: priceParam ? parseFloat(priceParam) : null,
    originalPrice,
    discount,
    finalPrice
  };
}

/**
 * Store Google Shopping params in sessionStorage for persistence
 */
export function storeGoogleParams(params: GoogleShoppingParams): void {
  if (typeof window === 'undefined') return;
  
  if (params.fromGoogle) {
    sessionStorage.setItem('googleShoppingParams', JSON.stringify(params));
    
    // Set expiry time (48 hours from now)
    if (!sessionStorage.getItem('offerExpiry')) {
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 48);
      sessionStorage.setItem('offerExpiry', expiry.toISOString());
    }
  }
}
