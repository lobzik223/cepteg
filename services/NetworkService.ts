import { cafeNetworks, getCafesByNetwork } from '../data/demoCafes';
import { Cafe } from './CafeService';

export interface NetworkValidationResult {
  isValid: boolean;
  networkName?: string;
  cafes?: Cafe[];
  message?: string;
}

export interface CafeValidationResult {
  isValid: boolean;
  cafeData?: {
    cafeId: string;
    cafeName: string;
    location: string;
    apiEndpoint: string;
  };
  message?: string;
}

export class NetworkService {
  private static instance: NetworkService;

  public static getInstance(): NetworkService {
    if (!NetworkService.instance) {
      NetworkService.instance = new NetworkService();
    }
    return NetworkService.instance;
  }

  /**
   * Проверяет, существует ли сеть кафе с данным названием
   */
  public async validateNetwork(networkName: string): Promise<NetworkValidationResult> {
    const lowerNetworkName = networkName.toLowerCase();
    
    // Проверяем известные сети
    const networkMap: Record<string, string> = {
      'coffee': 'Coffee House',
      'brew': 'Brew & Bean',
    };

    const actualNetworkName = networkMap[lowerNetworkName];
    
    if (actualNetworkName && cafeNetworks[actualNetworkName]) {
      const cafes = getCafesByNetwork(actualNetworkName);
      
      return {
        isValid: true,
        networkName: actualNetworkName,
        cafes: cafes,
        message: `Found ${cafes.length} locations for ${actualNetworkName}`
      };
    }

    return {
      isValid: false,
      message: `Network "${networkName}" not found in our database`
    };
  }

  /**
   * Проверяет, существует ли конкретное кафе
   */
  public async validateCafe(cafeName: string): Promise<CafeValidationResult> {
    const lowerCafeName = cafeName.toLowerCase();
    
    // Маппинг названий кафе на их данные
    const cafeMap: Record<string, any> = {
      'akafe': {
        cafeId: 'demo_cafe_001',
        cafeName: 'AKAFE',
        location: 'Moscow, Arbat St. 1',
        apiEndpoint: 'http://localhost:3000/api'
      },
      'brew': {
        cafeId: 'demo_cafe_003',
        cafeName: 'Brew & Bean',
        location: 'Kazan, Bauman St. 15',
        apiEndpoint: 'http://localhost:3002/api'
      }
    };

    const cafeData = cafeMap[lowerCafeName];
    
    if (cafeData) {
      return {
        isValid: true,
        cafeData: cafeData,
        message: `Found cafe: ${cafeData.cafeName}`
      };
    }

    return {
      isValid: false,
      message: `Cafe "${cafeName}" not found in our database`
    };
  }

  /**
   * Определяет тип поиска: сеть или конкретное кафе
   */
  public async validateInput(input: string): Promise<{
    type: 'network' | 'cafe' | 'unknown';
    result: NetworkValidationResult | CafeValidationResult;
  }> {
    const lowerInput = input.toLowerCase();
    
    // Сначала проверяем, является ли это сетью
    const networkResult = await this.validateNetwork(lowerInput);
    if (networkResult.isValid) {
      return { type: 'network', result: networkResult };
    }

    // Затем проверяем, является ли это конкретным кафе
    const cafeResult = await this.validateCafe(lowerInput);
    if (cafeResult.isValid) {
      return { type: 'cafe', result: cafeResult };
    }

    return { 
      type: 'unknown', 
      result: { 
        isValid: false, 
        message: `"${input}" not found in our database` 
      } 
    };
  }
}

// Export singleton instance
export const networkService = NetworkService.getInstance();
