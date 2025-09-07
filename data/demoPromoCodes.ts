import { CafePromoCodes, PromoCode } from '../types/PromoCode';

export const demoPromoCodes: CafePromoCodes[] = [
  {
    cafeId: 'demo_cafe_001',
    promoCodes: [
      {
        id: 'akafe_welcome_001',
        title: 'Welcome to AKAFE',
        description: 'Get 20% off your first order',
        discountType: 'percentage',
        discountValue: 20,
        code: 'WELCOME20',
        isActive: true,
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        usageLimit: 100,
        usedCount: 15,
        minOrderAmount: 500, // 5 TL
        icon: 'gift',
        backgroundColor: '#F3F4F6',
        textColor: '#374151',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'akafe_coffee_002',
        title: 'Free Coffee',
        description: 'Win a free drink',
        discountType: 'free_drink',
        discountValue: 0,
        isActive: true,
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        usageLimit: 50,
        usedCount: 8,
        icon: 'trophy',
        backgroundColor: '#F3F4F6',
        textColor: '#374151',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ]
  },
  {
    cafeId: 'demo_cafe_002',
    promoCodes: [
      {
        id: 'coffee_house_new_001',
        title: 'New Customer Special',
        description: '50% off first 3 drinks',
        discountType: 'percentage',
        discountValue: 50,
        code: 'NEW50',
        isActive: true,
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
        usageLimit: 200,
        usedCount: 45,
        minOrderAmount: 300, // 3 TL
        icon: 'star',
        backgroundColor: '#F3F4F6',
        textColor: '#374151',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'coffee_house_win_002',
        title: 'Play & Win',
        description: 'Win a free drink',
        discountType: 'free_drink',
        discountValue: 0,
        isActive: true,
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days
        usageLimit: 100,
        usedCount: 23,
        icon: 'game-controller',
        backgroundColor: '#F3F4F6',
        textColor: '#374151',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'coffee_house_loyalty_003',
        title: 'Loyalty Reward',
        description: 'Fixed 15 TL discount',
        discountType: 'fixed',
        discountValue: 1500, // 15 TL in kuruş
        code: 'LOYAL15',
        isActive: true,
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
        usageLimit: 75,
        usedCount: 12,
        minOrderAmount: 2000, // 20 TL
        icon: 'heart',
        backgroundColor: '#F3F4F6',
        textColor: '#374151',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'coffee_house_morning_004',
        title: 'Morning Boost',
        description: '30% off morning drinks',
        discountType: 'percentage',
        discountValue: 30,
        code: 'MORNING30',
        isActive: true,
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        usageLimit: 150,
        usedCount: 67,
        minOrderAmount: 500, // 5 TL
        icon: 'sunny',
        backgroundColor: '#F3F4F6',
        textColor: '#374151',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'coffee_house_weekend_005',
        title: 'Weekend Special',
        description: 'Buy 2 get 1 free',
        discountType: 'free_drink',
        discountValue: 0,
        isActive: true,
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
        usageLimit: 80,
        usedCount: 34,
        minOrderAmount: 1000, // 10 TL
        icon: 'calendar',
        backgroundColor: '#F3F4F6',
        textColor: '#374151',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'coffee_house_student_006',
        title: 'Student Discount',
        description: '20% off with student ID',
        discountType: 'percentage',
        discountValue: 20,
        code: 'STUDENT20',
        isActive: true,
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
        usageLimit: 300,
        usedCount: 89,
        minOrderAmount: 400, // 4 TL
        icon: 'school',
        backgroundColor: '#F3F4F6',
        textColor: '#374151',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ]
  },
  {
    cafeId: 'demo_cafe_003',
    promoCodes: [
      {
        id: 'brew_bean_roast_001',
        title: 'Roast Special',
        description: '25% off all roasted drinks',
        discountType: 'percentage',
        discountValue: 25,
        code: 'ROAST25',
        isActive: true,
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days
        usageLimit: 80,
        usedCount: 18,
        minOrderAmount: 800, // 8 TL
        applicableProducts: ['hot-drinks'],
        icon: 'flame',
        backgroundColor: '#F3F4F6',
        textColor: '#374151',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ]
  }
];

// Helper functions
export const getPromoCodesByCafe = (cafeId: string): PromoCode[] => {
  const cafePromoCodes = demoPromoCodes.find(cafe => cafe.cafeId === cafeId);
  return cafePromoCodes ? cafePromoCodes.promoCodes.filter(promo => promo.isActive) : [];
};

export const getPromoCodeById = (cafeId: string, promoId: string): PromoCode | null => {
  const promoCodes = getPromoCodesByCafe(cafeId);
  return promoCodes.find(promo => promo.id === promoId) || null;
};

export const isPromoCodeValid = (promoCode: PromoCode): boolean => {
  const now = new Date();
  const validFrom = new Date(promoCode.validFrom);
  const validUntil = new Date(promoCode.validUntil);
  
  return now >= validFrom && now <= validUntil && promoCode.isActive;
};
