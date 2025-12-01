
import hero1 from '@assets/generated_images/hero_image_of_a_modern_bright_living_room.png';
import hero2 from '@assets/generated_images/hero_image_of_fashion_lifestyle.png';
import catTech from '@assets/generated_images/tech_category_image.png';
import catHome from '@assets/generated_images/home_category_image.png';
import catBeauty from '@assets/generated_images/beauty_category_image.png';
import prodFashion from '@assets/generated_images/fashion_product_shot.png';
import prodSneaker from '@assets/generated_images/sneaker_product_shot.png';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  isTopPick?: boolean;
  isNew?: boolean;
}

export const categories = [
  { id: 'tech', name: 'Electronics', image: catTech },
  { id: 'home', name: 'Home & Living', image: catHome },
  { id: 'beauty', name: 'Beauty', image: catBeauty },
  { id: 'fashion', name: 'Fashion', image: prodFashion }, // Using product shot as category placeholder
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Luxe Chronograph Watch',
    price: 299.00,
    category: 'fashion',
    image: prodFashion,
    description: 'Elegant timepiece with precision movement and premium leather strap.',
    isTopPick: true,
  },
  {
    id: '2',
    name: 'Urban Runner Sneakers',
    price: 129.50,
    category: 'fashion',
    image: prodSneaker,
    description: 'Lightweight and durable sneakers designed for the modern urban lifestyle.',
    isTopPick: true,
    isNew: true,
  },
  {
    id: '3',
    name: 'Noise-Cancelling Pro Headphones',
    price: 349.00,
    category: 'tech',
    image: catTech, // Reusing for demo
    description: 'Immersive sound experience with active noise cancellation.',
    isTopPick: true,
  },
  {
    id: '4',
    name: 'Minimalist Coffee Maker',
    price: 89.99,
    category: 'home',
    image: catHome, // Reusing for demo
    description: 'Brew the perfect cup with this sleek and modern coffee maker.',
  },
  {
    id: '5',
    name: 'Rejuvenating Face Serum',
    price: 55.00,
    category: 'beauty',
    image: catBeauty, // Reusing for demo
    description: 'Advanced formula for glowing and youthful skin.',
    isNew: true,
  },
  {
    id: '6',
    name: 'Designer Sunglasses',
    price: 180.00,
    category: 'fashion',
    image: hero2, // Reusing for demo
    description: 'Protect your eyes in style with these premium frames.',
  }
];

export const heroSlides = [
  {
    id: 1,
    image: hero1,
    title: "Elevate Your Living Space",
    subtitle: "Discover our new Home & Living collection.",
    cta: "Shop Home"
  },
  {
    id: 2,
    image: hero2,
    title: "Urban Fashion Essentials",
    subtitle: "Timeless pieces for the modern wardrobe.",
    cta: "Shop Fashion"
  }
];
