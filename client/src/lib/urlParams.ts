const OFFER_STORAGE_KEY = 'google_shopping_offer';
const OFFER_TTL_MINUTES = 30;

export interface GoogleShoppingOffer {
  state: string;
  price: number;
  discount: number;
  finalPrice: number;
  expiresAt: number;
}

export interface GoogleShoppingParams {
  state: string | null;
  price: number | null;
  isGoogleVisitor: boolean;
}

function getStoredOffer(): GoogleShoppingOffer | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(OFFER_STORAGE_KEY);
    if (!stored) return null;
    
    const offer: GoogleShoppingOffer = JSON.parse(stored);
    if (Date.now() > offer.expiresAt) {
      localStorage.removeItem(OFFER_STORAGE_KEY);
      return null;
    }
    return offer;
  } catch {
    return null;
  }
}

function saveOffer(state: string, price: number): GoogleShoppingOffer {
  const discount = 900;
  const offer: GoogleShoppingOffer = {
    state,
    price,
    discount,
    finalPrice: price - discount,
    expiresAt: Date.now() + OFFER_TTL_MINUTES * 60 * 1000,
  };
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(OFFER_STORAGE_KEY, JSON.stringify(offer));
  }
  
  return offer;
}

export function getActiveOffer(): GoogleShoppingOffer | null {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  const stateParam = params.get('state');
  const priceParam = params.get('price');

  const state = stateParam && /^[A-Z]{2}$/i.test(stateParam) 
    ? stateParam.toUpperCase() 
    : null;
  
  const price = priceParam && /^\d+$/.test(priceParam) 
    ? parseInt(priceParam, 10) 
    : null;

  if (state && price) {
    return saveOffer(state, price);
  }

  return getStoredOffer();
}

export function getUrlParams(): GoogleShoppingParams {
  const offer = getActiveOffer();
  
  if (offer) {
    return {
      state: offer.state,
      price: offer.price,
      isGoogleVisitor: true,
    };
  }

  return { state: null, price: null, isGoogleVisitor: false };
}

export function getDynamicPrice(originalPrice: number): number {
  const offer = getActiveOffer();
  
  if (offer) {
    return offer.finalPrice;
  }
  
  return originalPrice;
}

export function getOriginalUrlPrice(): number | null {
  const offer = getActiveOffer();
  return offer?.price ?? null;
}

export function getDiscount(): number {
  return 900;
}

export function isGoogleShoppingVisitor(): boolean {
  return getActiveOffer() !== null;
}

export function getVisitorState(): string | null {
  const offer = getActiveOffer();
  return offer?.state ?? null;
}

export function getOfferParams(): string {
  const offer = getActiveOffer();
  if (offer) {
    return `?state=${offer.state}&price=${offer.price}`;
  }
  return '';
}

export function clearOffer(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(OFFER_STORAGE_KEY);
  }
}
