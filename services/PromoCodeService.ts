import { getPromoCodeById, getPromoCodesByCafe, isPromoCodeValid } from '../data/demoPromoCodes';
import { PromoCode } from '../types/PromoCode';

class PromoCodeService {
  private static instance: PromoCodeService;

  private constructor() {}

  public static getInstance(): PromoCodeService {
    if (!PromoCodeService.instance) {
      PromoCodeService.instance = new PromoCodeService();
    }
    return PromoCodeService.instance;
  }

  // Получить все активные промокоды для кафе
  public async getPromoCodesForCafe(cafeId: string): Promise<PromoCode[]> {
    try {
      // В будущем здесь будет API запрос
      // const response = await fetch(`${apiEndpoint}/promo-codes?cafeId=${cafeId}`);
      // return response.json();
      
      // Пока используем демо данные
      const promoCodes = getPromoCodesByCafe(cafeId);
      return promoCodes.filter(promo => isPromoCodeValid(promo));
    } catch (error) {
      console.error('Error fetching promo codes:', error);
      return [];
    }
  }

  // Получить промокод по ID
  public async getPromoCodeById(cafeId: string, promoId: string): Promise<PromoCode | null> {
    try {
      // В будущем здесь будет API запрос
      // const response = await fetch(`${apiEndpoint}/promo-codes/${promoId}`);
      // return response.json();
      
      // Пока используем демо данные
      return getPromoCodeById(cafeId, promoId);
    } catch (error) {
      console.error('Error fetching promo code:', error);
      return null;
    }
  }

  // Применить промокод
  public async applyPromoCode(cafeId: string, promoId: string, orderAmount: number): Promise<{
    success: boolean;
    discount: number;
    message: string;
  }> {
    try {
      const promoCode = await this.getPromoCodeById(cafeId, promoId);
      
      if (!promoCode) {
        return {
          success: false,
          discount: 0,
          message: 'Промокод не найден'
        };
      }

      if (!isPromoCodeValid(promoCode)) {
        return {
          success: false,
          discount: 0,
          message: 'Промокод недействителен'
        };
      }

      if (promoCode.minOrderAmount && orderAmount < promoCode.minOrderAmount) {
        return {
          success: false,
          discount: 0,
          message: `Минимальная сумма заказа: ₺${promoCode.minOrderAmount / 100}`
        };
      }

      if (promoCode.usageLimit && promoCode.usedCount >= promoCode.usageLimit) {
        return {
          success: false,
          discount: 0,
          message: 'Промокод исчерпан'
        };
      }

      let discount = 0;
      switch (promoCode.discountType) {
        case 'percentage':
          discount = Math.round((orderAmount * promoCode.discountValue) / 100);
          break;
        case 'fixed':
          discount = promoCode.discountValue;
          break;
        case 'free_drink':
          // Для бесплатного напитка нужно определить стоимость самого дешевого напитка
          discount = Math.min(orderAmount, 5000); // Максимум 50 TL
          break;
      }

      // В будущем здесь будет API запрос для обновления счетчика использования
      // await fetch(`${apiEndpoint}/promo-codes/${promoId}/use`, { method: 'POST' });

      return {
        success: true,
        discount,
        message: 'Промокод применен успешно'
      };
    } catch (error) {
      console.error('Error applying promo code:', error);
      return {
        success: false,
        discount: 0,
        message: 'Ошибка при применении промокода'
      };
    }
  }

  // Проверить валидность промокода
  public async validatePromoCode(cafeId: string, promoId: string): Promise<boolean> {
    const promoCode = await this.getPromoCodeById(cafeId, promoId);
    return promoCode ? isPromoCodeValid(promoCode) : false;
  }
}

export default PromoCodeService;
