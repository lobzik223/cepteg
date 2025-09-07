// App configuration types for admin panel management
export interface AppConfig {
  id: string;
  // App branding
  appName: string;
  appLogo?: string;
  primaryColor: string;
  secondaryColor: string;
  
  // Promotional content
  promotionalCards: PromotionalCard[];
  
  // App settings
  currency: string;
  currencySymbol: string;
  language: string;
  
  // Business info
  businessName: string;
  businessDescription?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessEmail?: string;
  
  // Social media
  socialMedia: SocialMediaLinks;
  
  // App features
  features: AppFeatures;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface PromotionalCard {
  id: string;
  // Cafe/restaurant specific
  cafeId: string;
  cafeName: string;
  
  // Card content
  title: string;
  description?: string;
  price?: number;
  discount?: number;
  discountText?: string;
  buttonText?: string;
  buttonAction?: 'apply_discount' | 'navigate' | 'external_link';
  buttonLink?: string;
  
  // Card settings
  isActive: boolean;
  position: 'top' | 'bottom';
  order: number;
  backgroundColor?: string;
  textColor?: string;
  imageUrl?: string;
  
  // Validity
  validFrom?: string; // ISO date string
  validUntil?: string; // ISO date string
  maxUses?: number; // Maximum number of times this promo can be used
  currentUses?: number; // Current usage count
}

export interface SocialMediaLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
  website?: string;
}

export interface AppFeatures {
  enableReviews: boolean;
  enableFavorites: boolean;
  enableNotifications: boolean;
  enableDelivery: boolean;
  enablePickup: boolean;
  enableReservations: boolean;
  enableLoyaltyProgram: boolean;
  enableGiftCards: boolean;
}

// API Response types
export interface AppConfigResponse {
  config: AppConfig;
}

export interface PromotionalCardsResponse {
  cards: PromotionalCard[];
}

// Admin Panel types
export interface UpdateAppConfigRequest {
  appName?: string;
  appLogo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  currency?: string;
  currencySymbol?: string;
  language?: string;
  businessName?: string;
  businessDescription?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessEmail?: string;
  socialMedia?: SocialMediaLinks;
  features?: AppFeatures;
}

export interface CreatePromotionalCardRequest {
  // Cafe/restaurant specific
  cafeId: string;
  cafeName: string;
  
  // Card content
  title: string;
  description?: string;
  price?: number;
  discount?: number;
  discountText?: string;
  buttonText?: string;
  buttonAction?: 'apply_discount' | 'navigate' | 'external_link';
  buttonLink?: string;
  
  // Card settings
  isActive: boolean;
  position: 'top' | 'bottom';
  order: number;
  backgroundColor?: string;
  textColor?: string;
  imageUrl?: string;
  
  // Validity
  validFrom?: string;
  validUntil?: string;
  maxUses?: number;
}

export interface UpdatePromotionalCardRequest extends Partial<CreatePromotionalCardRequest> {
  id: string;
}
