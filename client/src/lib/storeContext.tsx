
import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts, categories as initialCategories } from './mockData';

// Types
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  isTopPick?: boolean;
  isNew?: boolean;
  inventory: number;
  status: 'active' | 'draft' | 'archived';
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  status: 'pending' | 'processing' | 'fulfilled' | 'cancelled';
  paymentStatus: 'paid' | 'unpaid' | 'refunded';
  total: number;
  items: number;
}

export interface ThemeSettings {
  storeName: string;
  logoUrl: string | null;
  primaryColor: string; // H S L format e.g. "240 5.9% 10%"
  announcementBar: string;
}

export interface StoreContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  orders: Order[];
  updateOrder: (id: string, updates: Partial<Order>) => void;
  
  theme: ThemeSettings;
  updateTheme: (updates: Partial<ThemeSettings>) => void;
  
  pages: any[]; // keeping simple for now
  notifications: any[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Initialize with Mock Data but extended
  const [products, setProducts] = useState<Product[]>(initialProducts.map(p => ({
    ...p,
    inventory: Math.floor(Math.random() * 50) + 10,
    status: 'active'
  })));

  const [orders, setOrders] = useState<Order[]>([
    { id: "ORD-1001", customer: "Alice Freeman", email: "alice@example.com", date: "2023-10-21", status: "fulfilled", paymentStatus: "paid", total: 250.00, items: 3 },
    { id: "ORD-1002", customer: "Bob Smith", email: "bob@test.com", date: "2023-10-21", status: "pending", paymentStatus: "paid", total: 120.50, items: 1 },
    { id: "ORD-1003", customer: "Charlie Brown", email: "charlie@domain.com", date: "2023-10-20", status: "cancelled", paymentStatus: "refunded", total: 45.00, items: 1 },
    { id: "ORD-1004", customer: "Diana Prince", email: "diana@themyscira.net", date: "2023-10-19", status: "fulfilled", paymentStatus: "paid", total: 850.00, items: 5 },
  ]);

  const [theme, setTheme] = useState<ThemeSettings>({
    storeName: "LuxeStore",
    logoUrl: null,
    primaryColor: "240 5.9% 10%", // Default black/zinc
    announcementBar: "Free shipping on all orders over $100"
  });

  const [pages, setPages] = useState([
    { id: 'home', title: 'Home', status: 'published' },
    { id: 'about', title: 'About Us', status: 'published' },
    { id: 'contact', title: 'Contact', status: 'published' },
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

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(orders.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const updateTheme = (updates: Partial<ThemeSettings>) => {
    setTheme(prev => ({ ...prev, ...updates }));
  };

  // Apply theme to CSS variables
  useEffect(() => {
    // This is a simplified way to apply the primary color. 
    // In a real app, we might parse HSL properly.
    // Assuming the input is in "H S% L%" format or similar valid css var value
    if (theme.primaryColor) {
      document.documentElement.style.setProperty('--primary', theme.primaryColor);
      // Simple logic to determine foreground color based on lightness could go here
      // For now, assuming dark primary means light text
      document.documentElement.style.setProperty('--primary-foreground', '0 0% 100%'); 
    }
  }, [theme.primaryColor]);

  return (
    <StoreContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct,
      orders, updateOrder,
      theme, updateTheme,
      pages, notifications
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
