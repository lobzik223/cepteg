import { Product } from '../types/Product';

export const demoProducts: Record<string, Product[]> = {
  // AKAFE products
  'demo_cafe_001': [
    {
      id: 'akafe_milkshake_001',
      name: 'Milkshake',
      description: 'A creamy milkshake with vanilla ice cream and fresh milk. Perfect for a hot day!',
      price: 17000, // 170 TL
      currency: 'TRY',
      category: 'for-you',
      imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop',
      badge: {
        text: 'Popular',
        position: 'topLeft',
        color: '#FFFFFF',
        backgroundColor: '#FF6B6B'
      },
      isActive: true,
      isPopular: true,
      isNew: false,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      nutritionalInfo: {
        energy: 320,
        proteins: 8,
        fats: 12,
        carbs: 45
      },
      customizationOptions: {
        sizes: [
          { id: 'small', label: 'Small', volume: '300ml', priceModifier: 0 },
          { id: 'medium', label: 'Medium', volume: '400ml', priceModifier: 2000 },
          { id: 'large', label: 'Large', volume: '500ml', priceModifier: 4000 }
        ],
        milkTypes: [
          { id: 'whole', name: 'Whole', icon: '🥛', priceModifier: 0 },
          { id: 'almond', name: 'Almond', icon: '🥜', priceModifier: 1000 },
          { id: 'oat', name: 'oat', icon: '🌾', priceModifier: 1000 }
        ],
        temperatures: [
          { id: 'cold', name: 'Cold', icon: '❄️' },
          { id: 'frozen', name: 'Frozen', icon: '🧊' }
        ],
        addOns: [
          { id: 'whipped_cream', name: 'Whipped_Cream', icon: '🍦', price: 500 },
          { id: 'chocolate_sauce', name: 'Chocolate_Sauce', icon: '🍫', price: 300 },
          { id: 'caramel_sauce', name: 'Caramel_Sause', icon: '🍯', price: 300 },
          { id: 'sprinkles', name: 'Sprinkles', icon: '✨', price: 200 }
        ]
      }
    },
    {
      id: 'akafe_latte_001',
      name: 'Latte',
      description: 'Classic latte with delicate milk foam and espresso.',
      price: 12000,
      currency: 'TRY',
      category: 'milk-coffee',
      imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=400&fit=crop',
      badge: {
        text: 'HIT',
        position: 'topRight',
        color: '#FFFFFF',
        backgroundColor: '#4ECDC4'
      },
      isActive: true,
      isPopular: true,
      isNew: false,
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z',
      nutritionalInfo: {
        energy: 120,
        proteins: 6,
        fats: 4,
        carbs: 12
      },
      customizationOptions: {
        sizes: [
          { id: 'small', label: 'Small', volume: '200ml', priceModifier: 0 },
          { id: 'medium', label: 'Medium', volume: '300ml', priceModifier: 1500 },
          { id: 'large', label: 'Large', volume: '400ml', priceModifier: 3000 }
        ],
        milkTypes: [
          { id: 'whole', name: 'Whole', icon: '🥛', priceModifier: 0 },
          { id: 'skim', name: 'Skim', icon: '🥛', priceModifier: 0 },
          { id: 'almond', name: 'Almond', icon: '🥜', priceModifier: 1000 },
          { id: 'oat', name: 'Oat', icon: '🌾', priceModifier: 1000 }
        ],
        temperatures: [
          { id: 'hot', name: 'Hot', icon: '🔥' },
          { id: 'warm', name: 'Warm', icon: '🌡️' }
        ],
        addOns: [
          { id: 'extra_shot', name: 'Extra_shot', icon: '☕', price: 800 },
          { id: 'vanilla_syrup', name: 'Vanilla_Syrup', icon: '🍯', price: 300 },
          { id: 'caramel_syrup', name: 'Caramel_Syrup', icon: '🍯', price: 300 }
        ]
      }
    },
    {
      id: 'akafe_cappuccino_001',
      name: 'Cappuccino',
      description: 'The perfect balance of espresso, steamed milk, and airy milk foam.',
      price: 11000,
      currency: 'TRY',
      category: 'milk-coffee',
      imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop',
      isActive: true,
      isPopular: true,
      isNew: false,
      createdAt: '2024-01-08T10:00:00Z',
      updatedAt: '2024-01-08T10:00:00Z',
      nutritionalInfo: {
        energy: 110,
        proteins: 5,
        fats: 3,
        carbs: 10
      }
    },
    {
      id: 'akafe_americano_001',
      name: 'Americano',
      description: 'Classic Americano with hot water and espresso.',
      price: 8000,
      currency: 'TRY',
      category: 'hot-drinks',
      imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
      isActive: true,
      isPopular: false,
      isNew: false,
      createdAt: '2024-01-05T10:00:00Z',
      updatedAt: '2024-01-05T10:00:00Z',
      nutritionalInfo: {
        energy: 5,
        proteins: 0,
        fats: 0,
        carbs: 1
      }
    },
    {
      id: 'akafe_iced_coffee_001',
      name: 'Iced coffee',
      description: 'Refreshing iced coffee with milk and ice.',
      price: 13000,
      currency: 'TRY',
      category: 'iced-drinks',
      imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop',
      badge: {
        text: 'New',
        position: 'topLeft',
        color: '#FFFFFF',
        backgroundColor: '#45B7D1'
      },
      isActive: true,
      isPopular: false,
      isNew: true,
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z',
      nutritionalInfo: {
        energy: 140,
        proteins: 6,
        fats: 4,
        carbs: 15
      }
    }
  ],
  
  // Coffee House products
  'demo_cafe_002': [
    {
      id: 'coffee_house_espresso_001',
      name: 'Espresso',
      description: 'Bold Italian espresso. Strong and invigorating.',
      price: 6000,
      currency: 'TRY',
      category: 'hot-drinks',
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop',
      isActive: true,
      isPopular: true,
      isNew: false,
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z'
    }
  ],
  
  // Brew & Bean products
  'demo_cafe_003': [
    {
      id: 'brew_bean_filter_001',
      name: 'Filter Coffee',
      description: 'Freshly brewed filter coffee from our special blend of beans.',
      price: 9000,
      currency: 'TRY',
      category: 'hot-drinks',
      imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop',
      isActive: true,
      isPopular: true,
      isNew: false,
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z'
    }
  ]
};

// Helper function to get products by cafe ID
export const getDemoProductsByCafeId = (cafeId: string): Product[] => {
  return demoProducts[cafeId] || [];
};

// Helper function to get products by category
export const getDemoProductsByCategory = (cafeId: string, category: string): Product[] => {
  const cafeProducts = demoProducts[cafeId] || [];
  return cafeProducts.filter(product => product.category === category);
};

// Helper function to get popular products
export const getDemoPopularProducts = (cafeId: string): Product[] => {
  const cafeProducts = demoProducts[cafeId] || [];
  return cafeProducts.filter(product => product.isPopular);
};

// Helper function to get new products
export const getDemoNewProducts = (cafeId: string): Product[] => {
  const cafeProducts = demoProducts[cafeId] || [];
  return cafeProducts.filter(product => product.isNew);
};
