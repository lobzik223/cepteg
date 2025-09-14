import { demoCafes } from '../data/demoCafes';
import { Cafe } from './CafeService';
import { cafeVideoService } from './CafeVideoService';
import { productService } from './ProductService';
import PromoCodeService from './PromoCodeService';
const promoCodeService = PromoCodeService.getInstance();

export interface PreloadProgress {
  stage: string;
  progress: number;
  message: string;
}

export interface PreloadResult {
  success: boolean;
  error?: string;
  data?: {
    videoConfig: any;
    products: any[];
    categories: string[];
    promoCodes: any[];
  };
}

export class DataPreloadService {
  private static instance: DataPreloadService;

  public static getInstance(): DataPreloadService {
    if (!DataPreloadService.instance) {
      DataPreloadService.instance = new DataPreloadService();
    }
    return DataPreloadService.instance;
  }

  /**
   * Preload all data for a cafe
   */
  public async preloadCafeData(
    cafe: Cafe,
    onProgress?: (progress: PreloadProgress) => void
  ): Promise<PreloadResult> {
    try {
      const result: PreloadResult = {
        success: true,
        data: {
          videoConfig: null,
          products: [],
          categories: [],
          promoCodes: [],
        },
      };

      // Stage 1: Video Configuration (10%)
      onProgress?.({
        stage: 'video',
        progress: 10,
        message: 'Loading video configuration...',
      });

      const videoConfig = cafeVideoService.getVideoConfig(cafe);
      result.data!.videoConfig = videoConfig;

      // Stage 2: Categories (30%)
      onProgress?.({
        stage: 'categories',
        progress: 30,
        message: 'Loading categories...',
      });

      const categories = cafe.categories || ['for-you', 'new'];
      result.data!.categories = categories;

      // Stage 3: Products (60%)
      onProgress?.({
        stage: 'products',
        progress: 60,
        message: 'Loading products...',
      });

      const productsResponse = await productService.getProducts(cafe.id);
      result.data!.products = Array.isArray(productsResponse)
        ? productsResponse
        : productsResponse.products ?? [];

      // Stage 4: Promo Codes (80%)
      onProgress?.({
        stage: 'promocodes',
        progress: 80,
        message: 'Loading promo codes...',
      });

      // If you expect multiple promo codes, you may need to fetch their IDs from somewhere
      // Here, we assume a single promo code per cafe for demonstration
      // Replace 'demoPromoId' with the actual promoId you want to fetch
      const demoPromoId = 'demoPromoId'; // TODO: Replace with actual promoId
      const promoCode = await promoCodeService.getPromoCodeById(cafe.id, demoPromoId);
      result.data!.promoCodes = promoCode ? [promoCode] : [];

      // Stage 5: Complete (100%)
      onProgress?.({
        stage: 'complete',
        progress: 100,
        message: 'Ready!',
      });

      return result;
    } catch (error) {
      console.error('Error preloading cafe data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Preload demo data for testing
   */
  public async preloadDemoData(
    cafeId: string,
    onProgress?: (progress: PreloadProgress) => void
  ): Promise<PreloadResult> {
    try {
      const result: PreloadResult = {
        success: true,
        data: {
          videoConfig: null,
          products: [],
          categories: [],
          promoCodes: [],
        },
      };

      // Stage 1: Video Configuration (10%)
      onProgress?.({
        stage: 'video',
        progress: 10,
        message: 'Loading video configuration...',
      });
      // Get demo cafe data
      const demoCafe = demoCafes.find((c: Cafe) => c.id === cafeId);
      
      if (demoCafe) {
        const videoConfig = cafeVideoService.getVideoConfig(demoCafe);
        result.data!.videoConfig = videoConfig;
        result.data!.videoConfig = videoConfig;

        // Stage 2: Categories (30%)
        onProgress?.({
          stage: 'categories',
          progress: 30,
          message: 'Loading categories...',
        });

        result.data!.categories = demoCafe.categories || ['for-you', 'new'];

        // Stage 3: Products (60%)
        onProgress?.({
          stage: 'products',
          progress: 60,
          message: 'Loading products...',
        });

        const productsResponse = await productService.getProducts(cafeId);
        result.data!.products = Array.isArray(productsResponse)
          ? productsResponse
          : productsResponse.products ?? [];

        // Stage 4: Promo Codes (80%)
        onProgress?.({
          stage: 'promocodes',
          progress: 80,
          message: 'Loading promo codes...',
        });

        // Replace with actual promo code ID as needed
        const demoPromoId = 'demoPromoId'; // TODO: Replace with actual promoId
        const promoCode = await promoCodeService.getPromoCodeById(cafeId, demoPromoId);
        result.data!.promoCodes = promoCode ? [promoCode] : [];
      }

      // Stage 5: Complete (100%)
      onProgress?.({
        stage: 'complete',
        progress: 100,
        message: 'Ready!',
      });

      return result;
    } catch (error) {
      console.error('Error preloading demo data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get loading stage display name
   */
  public getStageDisplayName(stage: string): string {
    switch (stage) {
      case 'video':
        return 'Video Setup';
      case 'categories':
        return 'Menu Categories';
      case 'products':
        return 'Products & Drinks';
      case 'promocodes':
        return 'Promo Codes';
      case 'complete':
        return 'Complete';
      default:
        return 'Loading...';
    }
  }
}

// Export singleton instance
export const dataPreloadService = DataPreloadService.getInstance();
