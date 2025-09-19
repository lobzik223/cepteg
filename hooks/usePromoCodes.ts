import { useEffect, useState } from 'react';
import { PromoCodeImage } from '../data/demoPromoCodes';
import PromoCodeService from '../services/PromoCodeService';

export const usePromoCodes = (cafeId: string) => {
  const [promoCodeImages, setPromoCodeImages] = useState<PromoCodeImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromoCodeImages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const promoCodesService = PromoCodeService.getInstance();
        const images = await promoCodesService.getPromoCodeImages(cafeId);
        
        setPromoCodeImages(images);
      } catch (err) {
        console.error('Error fetching promo code images:', err);
        setError('Не удалось загрузить изображения промокодов');
        setPromoCodeImages([]);
      } finally {
        setLoading(false);
      }
    };

    if (cafeId) {
      fetchPromoCodeImages();
    }
  }, [cafeId]);

  const addPromoCodeImage = async (imageUrl: string): Promise<PromoCodeImage | null> => {
    try {
      const promoCodesService = PromoCodeService.getInstance();
      const newImage = await promoCodesService.addPromoCodeImage(cafeId, imageUrl);
      
      // Обновляем локальное состояние
      setPromoCodeImages(prev => [...prev, newImage]);
      
      return newImage;
    } catch (err) {
      console.error('Error adding promo code image:', err);
      setError('Не удалось добавить изображение промокода');
      return null;
    }
  };

  const removePromoCodeImage = async (imageId: string): Promise<boolean> => {
    try {
      const promoCodesService = PromoCodeService.getInstance();
      const success = await promoCodesService.removePromoCodeImage(cafeId, imageId);
      
      if (success) {
        // Обновляем локальное состояние
        setPromoCodeImages(prev => prev.filter(image => image.id !== imageId));
      }
      
      return success;
    } catch (err) {
      console.error('Error removing promo code image:', err);
      setError('Не удалось удалить изображение промокода');
      return false;
    }
  };

  const refreshPromoCodeImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const promoCodesService = PromoCodeService.getInstance();
      const images = await promoCodesService.getPromoCodeImages(cafeId);
      
      setPromoCodeImages(images);
    } catch (err) {
      console.error('Error refreshing promo code images:', err);
      setError('Не удалось обновить изображения промокодов');
    } finally {
      setLoading(false);
    }
  };

  return {
    promoCodeImages,
    loading,
    error,
    addPromoCodeImage,
    removePromoCodeImage,
    refreshPromoCodeImages,
  };
};