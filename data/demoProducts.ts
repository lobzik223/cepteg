import { Product } from '../types/Product';

export const demoProducts: Record<string, Product[]> = {
  // AKAFE products - пустой массив
  'demo_cafe_001': [],
  
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
