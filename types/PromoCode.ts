export interface PromoCode {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'free_drink';
  discountValue: number;
  code?: string;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usedCount: number;
  minOrderAmount?: number;
  applicableProducts?: string[];
  icon?: string;
  backgroundColor?: string;
  textColor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CafePromoCodes {
  cafeId: string;
  promoCodes: PromoCode[];
}
