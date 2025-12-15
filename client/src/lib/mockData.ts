
import hero1 from '@assets/stock_images/serene_wellness_room_5ec781cc.jpg';
import hero2 from '@assets/stock_images/luxury_indoor_infrar_c095670a.jpg';

import catRecovery from '@assets/stock_images/modern_luxury_cold_p_bded910e.jpg';
import catWellness from '@assets/stock_images/modern_hyperbaric_ox_2d4084bb.jpg';
import catEnvironment from '@assets/stock_images/premium_stainless_st_38c58dd9.jpg';

import prodSauna from '@assets/stock_images/luxury_indoor_infrar_c095670a.jpg';
import prodChamber from '@assets/stock_images/modern_hyperbaric_ox_2d4084bb.jpg';
import prodFilter from '@assets/stock_images/premium_stainless_st_38c58dd9.jpg';
import prodPlunge from '@assets/stock_images/modern_luxury_cold_p_bded910e.jpg';
import prodRedLight from '@assets/stock_images/red_light_therapy_pa_41aed9ca.jpg';
import prodAir from '@assets/stock_images/modern_home_air_puri_4e626dfd.jpg';

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
}

export const categories = [
  { id: 'recovery', name: 'Recovery', image: catRecovery },
  { id: 'wellness', name: 'Wellness Tech', image: catWellness },
  { id: 'environment', name: 'Home Environment', image: catEnvironment },
  { id: 'all', name: 'Shop All', image: hero1 },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Zenith Infrared Sauna',
    price: 4500.00,
    category: 'recovery',
    image: prodSauna,
    description: 'Full-spectrum infrared sauna for deep tissue relaxation and detoxification.',
    isTopPick: true,
  },
  {
    id: '2',
    name: 'OxyFlow Hyperbaric Chamber',
    price: 12500.00,
    category: 'wellness',
    image: prodChamber,
    description: 'Professional grade mild hyperbaric oxygen chamber for accelerated healing.',
    isTopPick: true,
    isNew: true,
  },
  {
    id: '3',
    name: 'AquaPure Whole House System',
    price: 2800.00,
    category: 'environment',
    image: prodFilter,
    description: 'Advanced 7-stage filtration system for pure, mineral-rich water from every tap.',
    isTopPick: true,
  },
  {
    id: '4',
    name: 'Nordic Ice Plunge',
    price: 3200.00,
    category: 'recovery',
    image: prodPlunge,
    description: 'Maintain 39°F water temperatures effortlessly for your daily cold therapy.',
    isNew: true,
  },
  {
    id: '5',
    name: 'Lumina Red Light Panel',
    price: 850.00,
    category: 'wellness',
    image: prodRedLight,
    description: 'High-power red and near-infrared light therapy for skin health and recovery.',
    isTopPick: true,
  },
  {
    id: '6',
    name: 'AeroGuard Air Purifier',
    price: 650.00,
    category: 'environment',
    image: prodAir,
    description: 'Medical-grade HEPA filtration removes 99.9% of airborne particles and VOCs.',
  }
];

export const heroSlides = [
  {
    id: 1,
    image: hero1,
    title: "Invest in Your Vitality",
    subtitle: "Premium wellness technology for the modern home.",
    cta: "Shop Collection"
  },
  {
    id: 2,
    image: hero2,
    title: "Deep Recovery at Home",
    subtitle: "Experience the healing power of infrared heat.",
    cta: "Shop Saunas"
  }
];
