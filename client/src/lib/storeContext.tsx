
import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts, categories as initialCategories } from './mockData';
import imgConstruction from '@assets/stock_images/underground_storm_sh_f71d64df.jpg';
import imgStorm from '@assets/stock_images/tornado_storm_clouds_e3501d57.jpg';
import imgFamily from '@assets/stock_images/happy_family_safe_at_5ec97324.jpg';

// Types
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
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  phone?: string;
  address?: string;
  date: string;
  status: 'pending' | 'processing' | 'fulfilled' | 'cancelled';
  paymentStatus: 'paid' | 'unpaid' | 'refunded';
  total: number;
  items: number;
  shippingCost?: number;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'published' | 'draft';
}

export interface MenuLink {
  id: string;
  label: string;
  url: string;
  type: 'page' | 'url';
}

export interface ShippingProfile {
  id: string;
  name: string;
  type: 'flat' | 'distance';
  rate: number;
  originState?: string; // e.g., 'MO' for Missouri
}

export interface HomePageSection {
  id: string;
  type: 'hero' | 'category-grid' | 'featured-products' | 'new-arrivals' | 'newsletter' | 'text-block' | 'image-text' | '3d-viewer' | 'parallax-scroll' | 'specs-detail' | 'xray-tech' | 'purchase-section' | 'testimonials' | 'how-it-works' | 'interactive-demo' | 'product-gallery';
  title?: string;
  content?: any;
  image?: string;
  imagePosition?: 'left' | 'right';
  bullets?: string[];
  specs?: { label: string; value: string; description?: string }[];
  enabled: boolean;
}

export interface ThemeSettings {
  storeName: string;
  logoUrl: string | null;
  primaryColor: string; // H S L format e.g. "240 5.9% 10%"
  announcementBar: string;
  typography: {
    heading: 'serif' | 'sans';
    body: 'serif' | 'sans';
  };
  headerMenu: MenuLink[];
  footerMenu: MenuLink[];
  homeLayout: HomePageSection[];
}

export interface StoreContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  
  theme: ThemeSettings;
  updateTheme: (updates: Partial<ThemeSettings>) => void;
  
  pages: Page[];
  addPage: (page: Page) => void;
  updatePage: (id: string, updates: Partial<Page>) => void;
  deletePage: (id: string) => void;
  
  shippingProfiles: ShippingProfile[];
  addShippingProfile: (profile: ShippingProfile) => void;
  updateShippingProfile: (id: string, updates: Partial<ShippingProfile>) => void;
  
  notifications: any[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Initialize with Mock Data but extended
  const [products, setProducts] = useState<Product[]>(initialProducts.map(p => ({
    ...p,
    inventory: Math.floor(Math.random() * 50) + 10,
    status: 'active',
    compareAtPrice: p.price * 1.2
  })));

  const [orders, setOrders] = useState<Order[]>([
    { id: "ORD-1001", customer: "Alice Freeman", email: "alice@example.com", phone: "555-0101", address: "123 Main St, Springfield, MO 65804", date: "2023-10-21", status: "fulfilled", paymentStatus: "paid", total: 250.00, items: 3, shippingCost: 15.00 },
    { id: "ORD-1002", customer: "Bob Smith", email: "bob@test.com", phone: "555-0102", address: "456 Oak Ave, Metropolis, NY 10012", date: "2023-10-21", status: "pending", paymentStatus: "paid", total: 120.50, items: 1, shippingCost: 12.00 },
    { id: "ORD-1003", customer: "Charlie Brown", email: "charlie@domain.com", phone: "555-0103", address: "789 Pine Ln, Gotham, NJ 07001", date: "2023-10-20", status: "cancelled", paymentStatus: "refunded", total: 45.00, items: 1, shippingCost: 8.00 },
    { id: "ORD-1004", customer: "Diana Prince", email: "diana@themyscira.net", phone: "555-0104", address: "101 Island Dr, Paradise, CA 90210", date: "2023-10-19", status: "fulfilled", paymentStatus: "paid", total: 850.00, items: 5, shippingCost: 0.00 },
  ]);

  const [theme, setTheme] = useState<ThemeSettings>({
    storeName: "Home Defend",
    logoUrl: null,
    primaryColor: "30 25% 20%", // Dark Brown (HSL approx for #4E342E)
    announcementBar: "Now Taking Orders - Secure Your Spot with $500 Deposit",
    typography: {
      heading: 'sans', // Strong, trustworthy sans-serif
      body: 'sans'
    },
    headerMenu: [
      { id: '1', label: 'Slope Storm Shelter', url: '/', type: 'url' },
      { id: '2', label: 'About Us', url: '/about', type: 'page' },
      { id: '3', label: 'Contact Us', url: '/contact', type: 'page' },
    ],
    footerMenu: [
      { id: '1', label: 'Shipping Policy', url: '/shipping', type: 'page' },
      { id: '2', label: 'Installation Guide', url: '/installation', type: 'page' },
      { id: '3', label: 'Contact Us', url: '/contact', type: 'page' },
    ],
    homeLayout: [
      { id: 'hero', type: 'hero', enabled: true },
      { id: 'product-gallery', type: 'product-gallery', enabled: true },
      {
        id: 'xray-tech-demo',
        type: 'xray-tech',
        enabled: true
      },
      {
        id: 'interactive-fun',
        type: 'interactive-demo',
        title: 'Experience The Safety',
        enabled: true
      },
      {
        id: 'how-it-works',
        type: 'how-it-works',
        enabled: true
      },
      {
        id: 'specs-section',
        type: 'specs-detail',
        title: 'Engineered Specifications',
        content: 'Built with the highest grade materials to ensure survival in the most extreme conditions.',
        specs: [
          { label: 'Concrete Strength', value: '5,000 PSI Cured', description: 'Twice as strong as a normal driveway or sidewalk.' },
          { label: 'Wall Thickness', value: '4 Inches Reinforced', description: 'Solid walls that stop flying debris instantly.' },
          { label: 'Floor Thickness', value: '4 Inches Poured', description: 'A solid foundation that will never crack or shift.' },
          { label: 'Roof Thickness', value: '5 Inches Sloped', description: 'Extra thick and angled so heavy debris slides right off.' },
          { label: 'Rebar Reinforcement', value: '1/2” Rebar @ 12” Centers', description: 'A steel skeleton inside the walls specifically for tornadoes.' },
          { label: 'Door Construction', value: '12 Gauge Steel / 3-Point Lock', description: 'Like a bank vault door for your family.' },
          { label: 'Dimensions (Outer)', value: '80" W x 104" L x 85" H', description: 'Spacious interior with 6\'4" headroom.' },
          { label: 'Weight', value: 'Approx. 15,000 lbs', description: 'So heavy that even a massive tornado cannot lift it.' }
        ],
        enabled: true
      },
      {
         id: 'buy-now',
         type: 'purchase-section',
         enabled: true
      },
      {
         id: 'testimonials',
         type: 'testimonials',
         enabled: true
      },
      { id: 'text-install', type: 'text-block', title: 'Installation & Delivery', content: 'Shipped directly from Missouri. Delivery is $6 per mile for locations outside of Missouri. You are responsible for unloading and installation at your site.', enabled: true },
      { id: 'news', type: 'newsletter', enabled: false },
    ]
  });

  const [pages, setPages] = useState<Page[]>([
    { id: 'home', title: 'Home', slug: '/', content: 'Home page content...', status: 'published' },
    { id: 'about', title: 'About Us', slug: '/about', content: 'About us content...', status: 'published' },
    { id: 'contact', title: 'Contact', slug: '/contact', content: 'Contact form...', status: 'published' },
    { id: 'shipping', title: 'Shipping Info', slug: '/shipping', content: 'Shipping policies...', status: 'published' },
    { id: 'returns', title: 'Return Policy', slug: '/returns', content: 'Return policies...', status: 'published' },
  ]);
  
  const [shippingProfiles, setShippingProfiles] = useState<ShippingProfile[]>([
    { id: 'flat-std', name: 'Standard Shipping', type: 'flat', rate: 15.00 },
    { id: 'flat-exp', name: 'Express Shipping', type: 'flat', rate: 35.00 },
    { id: 'dist-mo', name: 'Midwest Delivery', type: 'distance', rate: 4.00, originState: 'MO' },
  ]);

  const [notifications] = useState([
    { id: 'order_conf', name: 'Order Confirmation', subject: 'Order #{{number}} confirmed' },
    { id: 'ship_update', name: 'Shipping Update', subject: 'Your shipment is on the way' },
  ]);

  // Actions
  const addProduct = (product: Product) => setProducts([...products, product]);
  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
  };
  const deleteProduct = (id: string) => setProducts(products.filter(p => p.id !== id));
  
  const addOrder = (order: Order) => setOrders([order, ...orders]);
  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(orders.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const updateTheme = (updates: Partial<ThemeSettings>) => {
    setTheme(prev => ({ ...prev, ...updates }));
  };
  
  const addPage = (page: Page) => setPages([...pages, page]);
  const updatePage = (id: string, updates: Partial<Page>) => setPages(pages.map(p => p.id === id ? { ...p, ...updates } : p));
  const deletePage = (id: string) => setPages(pages.filter(p => p.id !== id));
  
  const addShippingProfile = (profile: ShippingProfile) => setShippingProfiles([...shippingProfiles, profile]);
  const updateShippingProfile = (id: string, updates: Partial<ShippingProfile>) => setShippingProfiles(shippingProfiles.map(p => p.id === id ? { ...p, ...updates } : p));

  // Apply theme to CSS variables
  useEffect(() => {
    if (theme.primaryColor) {
      document.documentElement.style.setProperty('--primary', theme.primaryColor);
      document.documentElement.style.setProperty('--primary-foreground', '0 0% 100%'); 
    }
  }, [theme.primaryColor]);

  return (
    <StoreContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct,
      orders, addOrder, updateOrder,
      theme, updateTheme,
      pages, addPage, updatePage, deletePage,
      shippingProfiles, addShippingProfile, updateShippingProfile,
      notifications
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
