import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cafe } from './CafeService';

const CAFE_STORAGE_KEY = 'selected_cafe';
const TENANT_STORAGE_KEY = 'current_tenant';

export interface TenantData {
  id: string;
  name: string;
  logo?: string;
  apiEndpoint: string;
}

export class CafeStorageService {
  private static instance: CafeStorageService;

  public static getInstance(): CafeStorageService {
    if (!CafeStorageService.instance) {
      CafeStorageService.instance = new CafeStorageService();
    }
    return CafeStorageService.instance;
  }

  /**
   * Save selected cafe to storage
   */
  async saveSelectedCafe(cafe: Cafe): Promise<void> {
    try {
      await AsyncStorage.setItem(CAFE_STORAGE_KEY, JSON.stringify(cafe));
    } catch (error) {
      console.error('Error saving cafe:', error);
    }
  }

  /**
   * Get selected cafe from storage
   */
  async getSelectedCafe(): Promise<Cafe | null> {
    try {
      const cafeData = await AsyncStorage.getItem(CAFE_STORAGE_KEY);
      return cafeData ? JSON.parse(cafeData) : null;
    } catch (error) {
      console.error('Error getting cafe:', error);
      return null;
    }
  }

  /**
   * Clear selected cafe from storage
   */
  async clearSelectedCafe(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CAFE_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing cafe:', error);
    }
  }

  /**
   * Save current tenant to storage
   */
  async saveCurrentTenant(tenant: TenantData): Promise<void> {
    try {
      await AsyncStorage.setItem(TENANT_STORAGE_KEY, JSON.stringify(tenant));
    } catch (error) {
      console.error('Error saving tenant:', error);
    }
  }

  /**
   * Get current tenant from storage
   */
  async getCurrentTenant(): Promise<TenantData | null> {
    try {
      const tenantData = await AsyncStorage.getItem(TENANT_STORAGE_KEY);
      return tenantData ? JSON.parse(tenantData) : null;
    } catch (error) {
      console.error('Error getting tenant:', error);
      return null;
    }
  }

  /**
   * Clear current tenant from storage
   */
  async clearCurrentTenant(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TENANT_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing tenant:', error);
    }
  }

  /**
   * Check if we have a saved tenant
   */
  async hasSavedTenant(): Promise<boolean> {
    const tenant = await this.getCurrentTenant();
    return tenant !== null;
  }

  /**
   * Create default tenant from config
   */
  createDefaultTenantFromConfig(config: any): TenantData {
    // Map config IDs to actual demo cafe IDs
    const configToDemoId: Record<string, string> = {
      'akafe-demo': 'demo_cafe_001',
      'coffee-house-demo': 'demo_cafe_002',
      'brew-bean-demo': 'demo_cafe_003'
    };
    
    const configId = config.DEFAULT_TENANT_ID || 'akafe-demo';
    const demoId = configToDemoId[configId] || 'demo_cafe_001';
    
    return {
      id: demoId,
      name: config.DEFAULT_TENANT_NAME || 'AKAFE',
      logo: config.DEFAULT_TENANT_LOGO || '',
      apiEndpoint: config.API_BASE || 'http://localhost:3000/api'
    };
  }

  /**
   * Create cafe from tenant data
   */
  createCafeFromTenant(tenant: TenantData): Cafe {
    // Try to get full cafe data from demo cafes first
    const demoCafes = require('../data/demoCafes').demoCafes;
    const demoCafe = demoCafes.find(cafe => cafe.id === tenant.id);
    
    if (demoCafe) {
      // Return full demo cafe data with categories
      return demoCafe;
    }
    
    // Fallback to basic cafe data if not found in demo
    return {
      id: tenant.id,
      name: tenant.name,
      location: 'Moscow, Arbat St. 1', // Default location
      description: `Welcome to ${tenant.name}`,
      logoUrl: tenant.logo,
      apiEndpoint: tenant.apiEndpoint,
      isActive: true,
      categories: ['for-you', 'new'], // Default categories
      videoConfig: {
        localVideoPath: 'coffee_video.mp4',
        fallbackColors: ['#E8F4FD', '#D1E7DD', '#C3E9C0'],
        videoPosition: 'center',
      },
    };
  }
}

// Export singleton instance
export const cafeStorageService = CafeStorageService.getInstance();
