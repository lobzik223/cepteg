// Product types for API integration
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number; // Price in kuruş (1 TL = 100 kuruş)
  currency: 'TRY'; // Turkish Lira
  category: ProductCategory;
  imageUrl?: string;
  badge?: ProductBadge;
  isActive: boolean;
  isPopular: boolean;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
  // Nutritional information
  nutritionalInfo?: {
    energy: number; // kcal
    proteins: number; // g
    fats: number; // g
    carbs: number; // g
  };
  // Customization options
  customizationOptions?: {
    sizes: ProductSize[];
    milkTypes: MilkType[];
    temperatures: Temperature[];
    addOns: AddOn[];
  };
  // Related products
  relatedProducts?: RelatedProduct[];
}

export interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
}

export interface ProductBadge {
  text: string;
  position: 'topLeft' | 'topRight' | 'none';
  color?: string;
  backgroundColor?: string;
}

export interface ProductSize {
  id: string;
  label: string;
  volume: string;
  priceModifier: number; // Additional cost for this size
}

export interface MilkType {
  id: string;
  name: string;
  icon: string;
  imageUrl?: string;
  priceModifier: number;
}

export interface Temperature {
  id: string;
  name: string;
  icon: string;
  imageUrl?: string;
}

export interface AddOn {
  id: string;
  name: string;
  icon: string;
  imageUrl?: string;
  price: number;
}

export type ProductCategory = 
  | 'for-you'
  | 'new'
  | 'milk-coffee'
  | 'iced-drinks'
  | 'hot-drinks'
  | 'desserts'
  | 'food';

// API Response types
export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductResponse {
  product: Product;
}

// Admin Panel types
export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  category: ProductCategory;
  imageUrl?: string;
  badge?: ProductBadge;
  isActive: boolean;
  isPopular: boolean;
  isNew: boolean;
  nutritionalInfo?: Product['nutritionalInfo'];
  customizationOptions?: Product['customizationOptions'];
  relatedProducts?: RelatedProduct[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}
