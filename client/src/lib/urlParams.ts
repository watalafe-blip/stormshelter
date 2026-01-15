export interface GoogleShoppingParams {
  state: string | null;
  price: number | null;
  isGoogleVisitor: boolean;
}

export function getUrlParams(): GoogleShoppingParams {
  if (typeof window === 'undefined') {
    return { state: null, price: null, isGoogleVisitor: false };
  }

  const params = new URLSearchParams(window.location.search);
  const stateParam = params.get('state');
  const priceParam = params.get('price');

  const state = stateParam && /^[A-Z]{2}$/i.test(stateParam) 
    ? stateParam.toUpperCase() 
    : null;
  
  const price = priceParam && /^\d+$/.test(priceParam) 
    ? parseInt(priceParam, 10) 
    : null;

  const isGoogleVisitor = state !== null && price !== null;

  return { state, price, isGoogleVisitor };
}

export function getDynamicPrice(originalPrice: number): number {
  const { price, isGoogleVisitor } = getUrlParams();
  
  if (isGoogleVisitor && price !== null) {
    return price - 900;
  }
  
  return originalPrice;
}

export function getOriginalUrlPrice(): number | null {
  const { price } = getUrlParams();
  return price;
}

export function getDiscount(): number {
  return 900;
}

export function isGoogleShoppingVisitor(): boolean {
  return getUrlParams().isGoogleVisitor;
}

export function getVisitorState(): string | null {
  return getUrlParams().state;
}
