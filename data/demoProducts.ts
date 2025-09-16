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
  
  // Emrahkeba products
  'demo_cafe_004': [
    // Hot Drinks
    {
      id: 'emrahkeba-turkish-tea-001',
      name: 'Turkish Tea',
      description: 'Traditional Turkish black tea served in tulip-shaped glasses',
      price: 1500, // 15 TL
      currency: 'TRY',
      category: 'hot-drinks',
      imageUrl: 'emrahkeba-turkish-tea.jpg',
      badge: {
        text: 'POPULAR',
        position: 'topLeft',
        color: '#fff',
        backgroundColor: '#DC2626'
      },
      isActive: true,
      isPopular: true,
      isNew: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nutritionalInfo: {
        energy: 2,
        proteins: 0,
        fats: 0,
        carbs: 0
      }
    },
    {
      id: 'emrahkeba-turkish-coffee-001',
      name: 'Turkish Coffee',
      description: 'Authentic Turkish coffee prepared in traditional cezve',
      price: 2500, // 25 TL
      currency: 'TRY',
      category: 'hot-drinks',
      imageUrl: 'emrahkeba-turkish-coffee.jpg',
      isActive: true,
      isPopular: true,
      isNew: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nutritionalInfo: {
        energy: 5,
        proteins: 0,
        fats: 0,
        carbs: 1
      }
    },
    {
      id: 'emrahkeba-sahlep-001',
      name: 'Sahlep',
      description: 'Traditional Turkish winter drink with orchid root powder',
      price: 2000, // 20 TL
      currency: 'TRY',
      category: 'hot-drinks',
      imageUrl: 'emrahkeba-sahlep.jpg',
      badge: {
        text: 'SEASONAL',
        position: 'topRight',
        color: '#fff',
        backgroundColor: '#059669'
      },
      isActive: true,
      isPopular: false,
      isNew: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nutritionalInfo: {
        energy: 120,
        proteins: 3,
        fats: 2,
        carbs: 20
      }
    },
    
    // Cold Drinks
    {
      id: 'emrahkeba-ayran-001',
      name: 'Ayran',
      description: 'Traditional Turkish yogurt drink with salt and water',
      price: 1200, // 12 TL
      currency: 'TRY',
      category: 'cold-drinks',
      imageUrl: 'emrahkeba-ayran.jpg',
      isActive: true,
      isPopular: true,
      isNew: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nutritionalInfo: {
        energy: 60,
        proteins: 4,
        fats: 2,
        carbs: 6
      }
    },
    {
      id: 'emrahkeba-fresh-orange-001',
      name: 'Fresh Orange Juice',
      description: 'Freshly squeezed orange juice from Turkish oranges',
      price: 1800, // 18 TL
      currency: 'TRY',
      category: 'cold-drinks',
      imageUrl: 'emrahkeba-orange-juice.jpg',
      isActive: true,
      isPopular: false,
      isNew: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nutritionalInfo: {
        energy: 110,
        proteins: 2,
        fats: 0,
        carbs: 26
      }
    },
    
    // Kebabs
    {
      id: 'emrahkeba-adana-kebab-001',
      name: 'Adana Kebab',
      description: 'Spicy minced lamb kebab served with rice and salad',
      price: 4500, // 45 TL
      currency: 'TRY',
      category: 'kebabs',
      imageUrl: 'emrahkeba-adana-kebab.jpg',
      badge: {
        text: 'SPICY',
        position: 'topLeft',
        color: '#fff',
        backgroundColor: '#DC2626'
      },
      isActive: true,
      isPopular: true,
      isNew: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nutritionalInfo: {
        energy: 450,
        proteins: 35,
        fats: 25,
        carbs: 15
      }
    },
    {
      id: 'emrahkeba-urfa-kebab-001',
      name: 'Urfa Kebab',
      description: 'Mild minced lamb kebab with traditional spices',
      price: 4500, // 45 TL
      currency: 'TRY',
      category: 'kebabs',
      imageUrl: 'emrahkeba-urfa-kebab.jpg',
      isActive: true,
      isPopular: true,
      isNew: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nutritionalInfo: {
        energy: 420,
        proteins: 33,
        fats: 22,
        carbs: 15
      }
    },
    {
      id: 'emrahkeba-chicken-kebab-001',
      name: 'Chicken Kebab',
      description: 'Grilled chicken kebab with vegetables and rice',
      price: 3800, // 38 TL
      currency: 'TRY',
      category: 'kebabs',
      imageUrl: 'emrahkeba-chicken-kebab.jpg',
      isActive: true,
      isPopular: false,
      isNew: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nutritionalInfo: {
        energy: 380,
        proteins: 40,
        fats: 15,
        carbs: 12
      }
    },
    
    // Appetizers
    {
      id: 'emrahkeba-hummus-001',
      name: 'Hummus',
      description: 'Traditional chickpea dip with olive oil and pita bread',
      price: 1800, // 18 TL
      currency: 'TRY',
      category: 'appetizers',
      imageUrl: 'emrahkeba-hummus.jpg',
      isActive: true,
      isPopular: true,
      isNew: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nutritionalInfo: {
        energy: 200,
        proteins: 8,
        fats: 12,
        carbs: 18
      }
    },
    {
      id: 'emrahkeba-baba-ganoush-001',
      name: 'Baba Ganoush',
      description: 'Smoky eggplant dip with tahini and lemon',
      price: 2000, // 20 TL
      currency: 'TRY',
      category: 'appetizers',
      imageUrl: 'emrahkeba-baba-ganoush.jpg',
      isActive: true,
      isPopular: false,
      isNew: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nutritionalInfo: {
        energy: 180,
        proteins: 6,
        fats: 14,
        carbs: 12
      }
    },
    {
      id: 'emrahkeba-mixed-salad-001',
      name: 'Mixed Salad',
      description: 'Fresh seasonal vegetables with olive oil dressing',
      price: 1500, // 15 TL
      currency: 'TRY',
      category: 'appetizers',
      imageUrl: 'emrahkeba-mixed-salad.jpg',
      isActive: true,
      isPopular: false,
      isNew: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nutritionalInfo: {
        energy: 80,
        proteins: 3,
        fats: 5,
        carbs: 8
      }
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