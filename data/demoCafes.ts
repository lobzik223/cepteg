import { Cafe } from '../services/CafeService';

export const demoCafes: Cafe[] = [
  // Coffee House Network
  {
    id: 'demo_cafe_002',
    name: 'Coffee House - Nevsky',
    location: 'St. Petersburg, Nevsky Prospect 50',
    description: 'Modern coffee space with signature drinks',
    logoUrl: 'https://example.com/coffee-house-logo.png',
    apiEndpoint: 'http://localhost:3001/api',
    isActive: true,
    categories: ['for-you', 'new', 'hot-drinks', 'iced-drinks'],
    videoConfig: {
      localVideoPath: 'coffee_house_video.mp4',
      fallbackColors: ['#FEF3C7', '#FDE68A', '#F59E0B'],
      videoPosition: 'left',
    },
  },
  {
    id: 'demo_cafe_005',
    name: 'Coffee House - Moscow',
    location: 'Moscow, Red Square 1',
    description: 'Historic location with premium coffee experience',
    logoUrl: 'https://example.com/coffee-house-logo.png',
    apiEndpoint: 'http://localhost:3001/api',
    isActive: true,
    categories: ['for-you', 'new', 'hot-drinks', 'iced-drinks'],
    videoConfig: {
      localVideoPath: 'coffee_house_video.mp4',
      fallbackColors: ['#FEF3C7', '#FDE68A', '#F59E0B'],
      videoPosition: 'left',
    },
  },
  {
    id: 'demo_cafe_006',
    name: 'Coffee House - Kazan',
    location: 'Kazan, Kremlin St. 10',
    description: 'Cultural hub with artisanal coffee blends',
    logoUrl: 'https://example.com/coffee-house-logo.png',
    apiEndpoint: 'http://localhost:3001/api',
    isActive: true,
    categories: ['for-you', 'new', 'hot-drinks', 'iced-drinks'],
    videoConfig: {
      localVideoPath: 'coffee_house_video.mp4',
      fallbackColors: ['#FEF3C7', '#FDE68A', '#F59E0B'],
      videoPosition: 'left',
    },
  },
  {
    id: 'demo_cafe_003',
    name: 'Brew & Bean',
    location: 'Kazan, Bauman St. 15',
    description: 'Specialized coffee shop with own bean roasting',
    logoUrl: 'https://example.com/brew-bean-logo.png',
    apiEndpoint: 'http://localhost:3002/api',
    isActive: true,
    categories: ['for-you', 'new', 'hot-drinks', 'desserts'],
    videoConfig: {
      localVideoPath: 'brew_bean_video.mp4', // Brew & Bean specific video
      fallbackColors: ['#ECFDF5', '#D1FAE5', '#10B981'], // Green brew colors
      videoPosition: 'right',
    },
  },
];

// Network definitions
export const cafeNetworks = {
  'Coffee House': {
    name: 'Coffee House',
    description: 'Premium coffee chain with locations across Russia',
    cafes: ['demo_cafe_002', 'demo_cafe_005', 'demo_cafe_006'],
    logoUrl: 'https://example.com/coffee-house-network-logo.png',
  },
  'Brew & Bean': {
    name: 'Brew & Bean',
    description: 'Artisanal coffee roasters with unique blends',
    cafes: ['demo_cafe_003'],
    logoUrl: 'https://example.com/brew-bean-network-logo.png',
  },
};

// Helper function to get cafes by network name
export const getCafesByNetwork = (networkName: string): Cafe[] => {
  const network = cafeNetworks[networkName as keyof typeof cafeNetworks];
  if (!network) return [];
  
  return demoCafes.filter(cafe => network.cafes.includes(cafe.id));
};

// Demo QR codes for testing
export const demoQRCodes = {
  coffeeHouse: {
    cafeId: 'demo_cafe_002',
    cafeName: 'Coffee House',
    location: 'St. Petersburg, Nevsky Prospect 50',
    apiEndpoint: 'http://localhost:3001/api'
  },
  brewBean: {
    cafeId: 'demo_cafe_003',
    cafeName: 'Brew & Bean',
    location: 'Kazan, Bauman St. 15',
    apiEndpoint: 'http://localhost:3002/api'
  },
};
