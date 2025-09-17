import { Product } from '../types/Product';

export const demoProducts: Record<string, Product[]> = {
  // Coffee House products
  'demo_cafe_002': [
    {
      id: 'coffee-house-new-001',
      name: 'Iced Caramel Macchiato',
      description: 'Rich espresso with vanilla-flavored syrup, steamed milk, and caramel drizzle over ice',
      price: 8500, // 85 TL in kuruş
      currency: 'TRY',
      category: 'iced-coffee',
      imageUrl: require('../assets/images/İCedMacchisLatte.jpg'),
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
    },
    {
      id: 'coffee-house-new-002',
      name: 'Cappuccino',
      description: 'Classic Italian coffee with equal parts espresso, steamed milk, and milk foam',
      price: 7500, // 75 TL in kuruş
      currency: 'TRY',
      category: 'milk-coffee',
      imageUrl: 'cappuccino.jpg',
      badge: {
        text: 'POPULAR',
        position: 'topRight',
        color: '#fff',
        backgroundColor: '#F59E0B'
      },
      isActive: true,
      isPopular: true,
      isNew: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nutritionalInfo: {
        energy: 120,
        proteins: 4,
        fats: 3,
        carbs: 12
      },
      customizationOptions: {
        sizes: [
          { id: 'small', label: 'Small', volume: '8oz', priceModifier: 0 },
          { id: 'medium', label: 'Medium', volume: '12oz', priceModifier: 500 },
          { id: 'large', label: 'Large', volume: '16oz', priceModifier: 1000 }
        ],
        milkTypes: [
          { id: 'whole', name: 'Whole Milk', icon: '🥛', priceModifier: 0 },
          { id: 'oat', name: 'Oat Milk', icon: '🌾', priceModifier: 300 },
          { id: 'almond', name: 'Almond Milk', icon: '🥜', priceModifier: 300 }
        ],
        temperatures: [
          { id: 'hot', name: 'Hot', icon: '🔥' }
        ],
        addOns: [
          { id: 'extra-shot', name: 'Extra Shot', icon: '☕', price: 500 },
          { id: 'cinnamon', name: 'Cinnamon', icon: '🌿', price: 100 }
        ]
      }
    },
    {
      id: 'coffee-house-new-003',
      name: 'Chocolate Croissant',
      description: 'Buttery croissant filled with rich chocolate, perfect with your morning coffee',
      price: 4500, // 45 TL in kuruş
      currency: 'TRY',
      category: 'desserts',
      imageUrl: 'chocolate-croissant.jpg',
      badge: {
        text: 'FRESH',
        position: 'topRight',
        color: '#fff',
        backgroundColor: '#8B5CF6'
      },
      isActive: true,
      isPopular: false,
      isNew: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nutritionalInfo: {
        energy: 320,
        proteins: 8,
        fats: 18,
        carbs: 35
      },
      customizationOptions: {
        sizes: [
          { id: 'regular', label: 'Regular', volume: '1 piece', priceModifier: 0 }
        ],
        addOns: [
          { id: 'extra-chocolate', name: 'Extra Chocolate', icon: '🍫', price: 300 },
          { id: 'butter', name: 'Butter', icon: '🧈', price: 200 }
        ]
      }
    }
  ],
  
  // Brew & Bean products - пустой массив
  'demo_cafe_003': [],
  
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