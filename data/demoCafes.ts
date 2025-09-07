import { Cafe } from '../services/CafeService';

export const demoCafes: Cafe[] = [
  {
    id: 'demo_cafe_001',
    name: 'AKAFE',
    location: 'Moscow, Arbat St. 1',
    description: 'Cozy cafe in the center of Moscow with excellent coffee and desserts',
    logoUrl: 'https://example.com/akafe-logo.png',
    apiEndpoint: 'http://localhost:3000/api',
    isActive: true,
    categories: ['for-you', 'new', 'milk-coffee', 'iced-drinks', 'hot-drinks'],
    videoConfig: {
      localVideoPath: 'coffee_video.mp4', // Original coffee video
      fallbackColors: ['#E8F4FD', '#D1E7DD', '#C3E9C0'],
      videoPosition: 'center',
    },
  },
  {
    id: 'demo_cafe_002',
    name: 'Coffee House',
    location: 'St. Petersburg, Nevsky Prospect 50',
    description: 'Modern coffee space with signature drinks',
    logoUrl: 'https://example.com/coffee-house-logo.png',
    apiEndpoint: 'http://localhost:3001/api',
    isActive: true,
    categories: ['for-you', 'new', 'hot-drinks', 'iced-drinks'],
    videoConfig: {
      localVideoPath: 'coffee_house_video.mp4', // Coffee House specific video
      fallbackColors: ['#FEF3C7', '#FDE68A', '#F59E0B'], // Warm coffee colors
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

// Demo QR codes for testing
export const demoQRCodes = {
  akafe: {
    cafeId: 'demo_cafe_001',
    cafeName: 'AKAFE',
    location: 'Moscow, Arbat St. 1',
    apiEndpoint: 'http://localhost:3000/api'
  },
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
  }
};
