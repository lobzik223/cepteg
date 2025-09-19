import {
    addPromoCodeImage,
    getPromoCodeImageById,
    getPromoCodeImagesByCafe,
    PromoCodeImage,
    removePromoCodeImage
} from '../data/demoPromoCodes';

class PromoCodeService {
  private static instance: PromoCodeService;

  private constructor() {}

  public static getInstance(): PromoCodeService {
    if (!PromoCodeService.instance) {
      PromoCodeService.instance = new PromoCodeService();
    }
    return PromoCodeService.instance;
  }

  /**
   * Get all active promo code images for a specific cafe
   */
  public async getPromoCodeImages(cafeId: string): Promise<PromoCodeImage[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return getPromoCodeImagesByCafe(cafeId);
    } catch (error) {
      console.error('Error fetching promo code images:', error);
      return [];
    }
  }

  /**
   * Get a specific promo code image by ID
   */
  public async getPromoCodeImageById(cafeId: string, imageId: string): Promise<PromoCodeImage | null> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return getPromoCodeImageById(cafeId, imageId);
    } catch (error) {
      console.error('Error fetching promo code image:', error);
      return null;
    }
  }

  /**
   * Add a new promo code image
   */
  public async addPromoCodeImage(cafeId: string, imageUrl: string): Promise<PromoCodeImage> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return addPromoCodeImage(cafeId, imageUrl);
    } catch (error) {
      console.error('Error adding promo code image:', error);
      throw error;
    }
  }

  /**
   * Remove a promo code image
   */
  public async removePromoCodeImage(cafeId: string, imageId: string): Promise<boolean> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return removePromoCodeImage(cafeId, imageId);
    } catch (error) {
      console.error('Error removing promo code image:', error);
      return false;
    }
  }

  /**
   * Get all active promo code images for a specific cafe (backward compatibility)
   */
  public async getPromoCodesForCafe(cafeId: string): Promise<PromoCodeImage[]> {
    return this.getPromoCodeImages(cafeId);
  }
}

export default PromoCodeService;