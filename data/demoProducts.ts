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
      id: 'coffee-house-new-001',
      name: 'Iced Caramel Macchiato',
      description: 'Rich espresso with vanilla-flavored syrup, steamed milk, and caramel drizzle over ice',
      price: 8500, // 85 TL in kuruş
      currency: 'TRY',
      category: 'new',
      imageUrl: 'https://example.com/iced-caramel-macchiato.jpg',
      badge: {
        text: 'NEW',
        position: 'topRight',
        color: '#fff',
        backgroundColor: '#10B981'
      },
      isActive: true,
      isPopular: false,
      isNew: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nutritionalInfo: {
        energy: 180,
        proteins: 6,
        fats: 4,
        carbs: 28
      },
      customizationOptions: {
        sizes: [
          { id: 'small', label: 'Small', volume: '12oz', priceModifier: 0 },
          { id: 'medium', label: 'Medium', volume: '16oz', priceModifier: 500 },
          { id: 'large', label: 'Large', volume: '20oz', priceModifier: 1000 }
        ],
        milkTypes: [
          { id: 'whole', name: 'Whole Milk', icon: '🥛', priceModifier: 0 },
          { id: 'oat', name: 'Oat Milk', icon: '🌾', priceModifier: 300 },
          { id: 'almond', name: 'Almond Milk', icon: '🥜', priceModifier: 300 }
        ],
        temperatures: [
          { id: 'hot', name: 'Hot', icon: '🔥' },
          { id: 'iced', name: 'Iced', icon: '🧊' }
        ],
        addOns: [
          { id: 'extra-shot', name: 'Extra Shot', icon: '☕', price: 500 },
          { id: 'whipped-cream', name: 'Whipped Cream', icon: '🍦', price: 200 }
        ]
      }
    }
  ],
  
  // Brew & Bean products - пустой массив
  'demo_cafe_003': []
};

// Helper function to get products by cafe ID
export const getDemoProductsByCafeId = (cafeId: string): Product[] => {
  return demoProducts[cafeId] || [];
};

// Helper function to get products by category
export const getDemoProductsByCategory = (cafeId: string, category: string): Product[] => {
  const cafeProducts = demoProducts[cafeId] || [];
  const filteredProducts = cafeProducts.filter(product => product.category === category);
  console.log(`🔍 getDemoProductsByCategory: cafeId=${cafeId}, category=${category}, found=${filteredProducts.length} products`);
  return filteredProducts;
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