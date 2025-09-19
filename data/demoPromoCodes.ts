// Интерфейс для промокода с фоткой
export interface PromoCodeImage {
  id: string;
  imageUrl: any; // Может быть строкой (URL) или require() для локальных изображений
  cafeId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CafePromoCodeImages {
  cafeId: string;
  images: PromoCodeImage[];
}

export const demoPromoCodeImages: CafePromoCodeImages[] = [
  {
    cafeId: 'demo_cafe_002', // Coffee House - Nevsky
    images: [
      {
        id: 'promo_terra_pizza_001',
        imageUrl: require('../assets/images/demopromocode/terra_pizzademo.png'),
        cafeId: 'demo_cafe_002',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'promo_munchies_bar_001',
        imageUrl: require('../assets/images/demopromocode/munchiesbardemo.png'),
        cafeId: 'demo_cafe_002',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'promo_doner_demo_001',
        imageUrl: require('../assets/images/demopromocode/demodonerpromo.png'),
        cafeId: 'demo_cafe_002',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ]
  }
];

// Helper functions
export const getPromoCodeImagesByCafe = (cafeId: string): PromoCodeImage[] => {
  const cafePromoImages = demoPromoCodeImages.find(cafe => cafe.cafeId === cafeId);
  return cafePromoImages ? cafePromoImages.images.filter(image => image.isActive) : [];
};

export const getPromoCodeImageById = (cafeId: string, imageId: string): PromoCodeImage | null => {
  const images = getPromoCodeImagesByCafe(cafeId);
  return images.find(image => image.id === imageId) || null;
};

export const addPromoCodeImage = (cafeId: string, imageUrl: string): PromoCodeImage => {
  const newImage: PromoCodeImage = {
    id: `promo_${Date.now()}`,
    imageUrl: imageUrl,
    cafeId: cafeId,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Найти существующую запись кафе или создать новую
  let cafePromoImages = demoPromoCodeImages.find(cafe => cafe.cafeId === cafeId);
  if (!cafePromoImages) {
    cafePromoImages = { cafeId: cafeId, images: [] };
    demoPromoCodeImages.push(cafePromoImages);
  }

  cafePromoImages.images.push(newImage);
  return newImage;
};

export const removePromoCodeImage = (cafeId: string, imageId: string): boolean => {
  const cafePromoImages = demoPromoCodeImages.find(cafe => cafe.cafeId === cafeId);
  if (!cafePromoImages) return false;

  const initialLength = cafePromoImages.images.length;
  cafePromoImages.images = cafePromoImages.images.filter(image => image.id !== imageId);
  
  // Если у кафе не осталось изображений, удаляем запись кафе
  if (cafePromoImages.images.length === 0) {
    const cafeIndex = demoPromoCodeImages.findIndex(cafe => cafe.cafeId === cafeId);
    if (cafeIndex !== -1) {
      demoPromoCodeImages.splice(cafeIndex, 1);
    }
  }

  return cafePromoImages.images.length < initialLength;
};
