/**
 * QR Code Generator for Cafe Network
 * Generates QR codes that can be scanned to open specific cafes in the app
 */

export interface CafeQRData {
  cafeId: string;
  cafeName: string;
  location: string;
  apiEndpoint: string;
}

/**
 * Generate QR code data for a cafe
 */
export const generateCafeQRData = (cafe: CafeQRData): string => {
  return JSON.stringify(cafe);
};

/**
 * Generate deep link URL for a cafe
 */
export const generateCafeDeepLink = (cafe: CafeQRData): string => {
  const baseUrl = 'cafeapp://';
  const params = new URLSearchParams({
    cafeId: cafe.cafeId,
    cafeName: cafe.cafeName,
    location: cafe.location,
    apiEndpoint: cafe.apiEndpoint,
  });
  
  return `${baseUrl}?${params.toString()}`;
};

/**
 * Generate web URL for a cafe (alternative to deep link)
 */
export const generateCafeWebLink = (cafe: CafeQRData): string => {
  const baseUrl = 'https://cafe-network.com/cafe';
  const params = new URLSearchParams({
    cafeId: cafe.cafeId,
    cafeName: cafe.cafeName,
    location: cafe.location,
    apiEndpoint: cafe.apiEndpoint,
  });
  
  return `${baseUrl}?${params.toString()}`;
};

/**
 * Demo QR codes for testing
 */
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

/**
 * Generate QR code URLs for demo cafes
 */
export const generateDemoQRCodes = () => {
  return {
    akafe: {
      json: generateCafeQRData(demoQRCodes.akafe),
      deepLink: generateCafeDeepLink(demoQRCodes.akafe),
      webLink: generateCafeWebLink(demoQRCodes.akafe),
    },
    coffeeHouse: {
      json: generateCafeQRData(demoQRCodes.coffeeHouse),
      deepLink: generateCafeDeepLink(demoQRCodes.coffeeHouse),
      webLink: generateCafeWebLink(demoQRCodes.coffeeHouse),
    },
    brewBean: {
      json: generateCafeQRData(demoQRCodes.brewBean),
      deepLink: generateCafeDeepLink(demoQRCodes.brewBean),
      webLink: generateCafeWebLink(demoQRCodes.brewBean),
    },
  };
};
