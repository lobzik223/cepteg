import {
    AppConfig,
    AppConfigResponse,
    CreatePromotionalCardRequest,
    PromotionalCard,
    PromotionalCardsResponse,
    UpdateAppConfigRequest,
    UpdatePromotionalCardRequest
} from '../types/AppConfig';

// Base API configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
const API_ENDPOINTS = {
  appConfig: '/app-config',
  promotionalCards: '/promotional-cards',
} as const;

// Default app configuration
const defaultAppConfig: AppConfig = {
  id: 'default',
          appName: 'Coffee Shop',
  primaryColor: '#4B5563',
  secondaryColor: '#9CA3AF',
  promotionalCards: [],
  currency: 'TRY',
  currencySymbol: '₺',
  language: 'ru',
          businessName: 'Coffee Shop',
        businessDescription: 'Best drinks and coffee in the city',
  socialMedia: {},
  features: {
    enableReviews: true,
    enableFavorites: true,
    enableNotifications: true,
    enableDelivery: true,
    enablePickup: true,
    enableReservations: false,
    enableLoyaltyProgram: false,
    enableGiftCards: false,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Default promotional cards
const defaultPromotionalCards: PromotionalCard[] = [
  {
    id: 'promo-1',
            title: 'Drink for 120 Turkish Lira',
        description: 'Try our new drink',
    price: 12000, // 120 TL in kuruş
    isActive: true,
    position: 'top',
    order: 1,
    backgroundColor: '#F8F9FA',
    textColor: '#4B5563',
  },
  {
    id: 'promo-2',
          title: '-50% discount on first 3 drinks',
          description: 'Special offer for new customers',
    discount: 50,
    discountText: '-50%',
          buttonText: 'Apply',
    buttonAction: 'apply_discount',
    isActive: true,
    position: 'top',
    order: 2,
    backgroundColor: '#F8F9FA',
    textColor: '#4B5563',
  },
];

// API Service class
export class AppConfigService {
  private static instance: AppConfigService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = API_BASE_URL;
  }

  public static getInstance(): AppConfigService {
    if (!AppConfigService.instance) {
      AppConfigService.instance = new AppConfigService();
    }
    return AppConfigService.instance;
  }

  // Generic API request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // App configuration methods
  public async getAppConfig(): Promise<AppConfig> {
    try {
      const response = await this.request<AppConfigResponse>(API_ENDPOINTS.appConfig);
      return response.config;
    } catch (error) {
      console.warn('API not available, using default app config');
      return defaultAppConfig;
    }
  }

  public async updateAppConfig(configData: UpdateAppConfigRequest): Promise<AppConfig> {
    const response = await this.request<AppConfigResponse>(
      API_ENDPOINTS.appConfig,
      {
        method: 'PUT',
        body: JSON.stringify(configData),
      }
    );
    return response.config;
  }

  // Promotional cards methods
  public async getPromotionalCards(): Promise<PromotionalCard[]> {
    try {
      const response = await this.request<PromotionalCardsResponse>(API_ENDPOINTS.promotionalCards);
      return response.cards;
    } catch (error) {
      console.warn('API not available, using default promotional cards');
      return defaultPromotionalCards;
    }
  }

  public async createPromotionalCard(cardData: CreatePromotionalCardRequest): Promise<PromotionalCard> {
    const response = await this.request<{ card: PromotionalCard }>(
      API_ENDPOINTS.promotionalCards,
      {
        method: 'POST',
        body: JSON.stringify(cardData),
      }
    );
    return response.card;
  }

  public async updatePromotionalCard(id: string, cardData: UpdatePromotionalCardRequest): Promise<PromotionalCard> {
    const response = await this.request<{ card: PromotionalCard }>(
      `${API_ENDPOINTS.promotionalCards}/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(cardData),
      }
    );
    return response.card;
  }

  public async deletePromotionalCard(id: string): Promise<void> {
    await this.request(`${API_ENDPOINTS.promotionalCards}/${id}`, {
      method: 'DELETE',
    });
  }

  // Utility methods
  public async getActivePromotionalCards(): Promise<PromotionalCard[]> {
    const cards = await this.getPromotionalCards();
    return cards.filter(card => card.isActive).sort((a, b) => a.order - b.order);
  }

  public async getTopPromotionalCards(): Promise<PromotionalCard[]> {
    const activeCards = await this.getActivePromotionalCards();
    return activeCards.filter(card => card.position === 'top');
  }

  public async getBottomPromotionalCards(): Promise<PromotionalCard[]> {
    const activeCards = await this.getActivePromotionalCards();
    return activeCards.filter(card => card.position === 'bottom');
  }
}

// Export singleton instance
export const appConfigService = AppConfigService.getInstance();
