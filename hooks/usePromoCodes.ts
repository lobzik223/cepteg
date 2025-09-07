import { useEffect, useState } from 'react';
import PromoCodeService from '../services/PromoCodeService';
import { PromoCode } from '../types/PromoCode';

export const usePromoCodes = (cafeId: string) => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const promoCodesService = PromoCodeService.getInstance();
        const codes = await promoCodesService.getPromoCodesForCafe(cafeId);
        
        setPromoCodes(codes);
      } catch (err) {
        console.error('Error fetching promo codes:', err);
        setError('Не удалось загрузить промокоды');
        setPromoCodes([]);
      } finally {
        setLoading(false);
      }
    };

    if (cafeId) {
      fetchPromoCodes();
    }
  }, [cafeId]);

  const applyPromoCode = async (promoId: string, orderAmount: number) => {
    try {
      const promoCodesService = PromoCodeService.getInstance();
      const result = await promoCodesService.applyPromoCode(cafeId, promoId, orderAmount);
      return result;
    } catch (err) {
      console.error('Error applying promo code:', err);
      return {
        success: false,
        discount: 0,
        message: 'Ошибка при применении промокода'
      };
    }
  };

  const refreshPromoCodes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const promoCodesService = PromoCodeService.getInstance();
      const codes = await promoCodesService.getPromoCodesForCafe(cafeId);
      
      setPromoCodes(codes);
    } catch (err) {
      console.error('Error refreshing promo codes:', err);
      setError('Не удалось обновить промокоды');
    } finally {
      setLoading(false);
    }
  };

  return {
    promoCodes,
    loading,
    error,
    applyPromoCode,
    refreshPromoCodes,
  };
};
