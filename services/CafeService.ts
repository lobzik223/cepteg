import Constants from 'expo-constants';
import { demoCafes } from '../data/demoCafes';
import { Product } from '../types/Product';

export interface Cafe {
  id: string;
  name: string;
  location: string;
  description?: string;
  logoUrl?: string;
  apiEndpoint: string;
  isActive: boolean;
  menu?: Product[];
  categories?: string[];
  // Video configuration for main screen
  videoConfig?: {
    videoUrl?: string; // URL to video file (for server cafes)
    localVideoPath?: string; // Local video path (for demo cafes)
    fallbackColors?: string[]; // Fallback gradient colors if video fails
    videoPosition?: 'center' | 'left' | 'right'; // Video positioning
  };
}

export interface CafeValidationResponse {
  cafe: Cafe;
  isValid: boolean;
  message?: string;
}

export class CafeService {
  private static instance: CafeService;
  private static readonly GLOBAL_API_URL = (() => {
    const config = Constants.expoConfig?.extra || {};
    return config.API_BASE || process.env.EXPO_PUBLIC_GLOBAL_API_URL || 'https://api.cafe-network.com';
  })();

  public static getInstance(): CafeService {
    if (!CafeService.instance) {
      CafeService.instance = new CafeService();
    }
    return CafeService.instance;
  }

  /**
   * Validate if cafe exists in our global network
   */
  async validateCafe(cafeId: string): Promise<CafeValidationResponse> {
    try {
      // For demo purposes, check local demo cafes first
      const demoCafe = demoCafes.find(cafe => cafe.id === cafeId);
      if (demoCafe) {
        return {
          cafe: demoCafe,
          isValid: true,
          message: 'Cafe found in demo database'
        };
      }

      // Try to fetch from global API
      const response = await fetch(`${CafeService.GLOBAL_API_URL}/cafes/${cafeId}/validate`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error validating cafe:', error);
      throw new Error('Failed to validate cafe. Check your internet connection.');
    }
  }

  /**
   * Get cafe menu from their local API
   */
  async getCafeMenu(cafe: Cafe): Promise<Product[]> {
    try {
      const response = await fetch(`${cafe.apiEndpoint}/api/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.products || data;
    } catch (error) {
      console.error('Error fetching cafe menu:', error);
      throw new Error('Failed to load cafe menu. Please try again later.');
    }
  }

  /**
   * Get cafe configuration
   */
  async getCafeConfig(cafeId: string): Promise<any> {
    try {
      const response = await fetch(`${CafeService.GLOBAL_API_URL}/cafes/${cafeId}/config`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching cafe config:', error);
      throw new Error('Failed to load cafe configuration.');
    }
  }

  /**
   * Register new cafe in the network
   */
  async registerCafe(cafeData: Partial<Cafe>): Promise<Cafe> {
    try {
      const response = await fetch(`${CafeService.GLOBAL_API_URL}/cafes/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cafeData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error registering cafe:', error);
      throw new Error('Failed to register cafe in the network.');
    }
  }

  /**
   * Get list of nearby cafes
   */
  async getNearbyCafes(latitude: number, longitude: number, radius: number = 5000): Promise<Cafe[]> {
    try {
      const response = await fetch(
        `${CafeService.GLOBAL_API_URL}/cafes/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.cafes || [];
    } catch (error) {
      console.error('Error fetching nearby cafes:', error);
      throw new Error('Failed to find nearby cafes.');
    }
  }
}

// Export singleton instance
export const cafeService = CafeService.getInstance();
