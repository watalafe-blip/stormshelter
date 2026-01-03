
import prodShelter from '@assets/image_1766611001581.png';

export interface Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  image: string;
  description: string;
  isTopPick?: boolean;
  isNew?: boolean;
  inventory: number;
  status: 'active' | 'draft' | 'archived';
  shippingProfileId?: string;
  deposit?: number; // Added for the deposit feature
}

export const categories = [
  { id: 'shelters', name: 'Storm Shelters', image: prodShelter },
];

export const products: Product[] = [
  {
    id: 'shelter-001',
    name: 'Slope Top Underground Concrete Storm Shelter',
    price: 4599.00,
    compareAtPrice: 5499.00,
    deposit: 500.00,
    category: 'shelters',
    image: prodShelter,
    description: 'The ultimate protection for your family. This slope-top underground concrete storm shelter is engineered to withstand EF5 tornadoes. Features a heavy-duty steel door with 3-point locking system, ventilation, and non-slip steps. \n\nIMPORTANT: Price includes unit cost. Shipping is calculated from Missouri. Customer is responsible for unloading and installation.',
    isTopPick: true,
    isNew: true,
    inventory: 5,
    status: 'active'
  }
];

// Helper to keep the slider working without errors, though we might not use it or will update it
export const heroSlides = [
  {
    id: 1,
    image: prodShelter,
    title: "When the Storm Comes, Will You Be Ready?",
    subtitle: "Protecting families one shelter at a time. FEMA-rated underground concrete storm shelters built to save lives.",
    cta: "Protect Your Family Now"
  }
];
