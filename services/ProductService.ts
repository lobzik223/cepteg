import { CreateProductRequest, Product, ProductsResponse, UpdateProductRequest } from '../types/Product';

// Base API configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
const API_ENDPOINTS = {
  products: '/products',
  categories: '/categories',
  upload: '/upload',
} as const;

// API Service class
export class ProductService {
  private static instance: ProductService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = API_BASE_URL;
  }

  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
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

  // Product CRUD operations
  public async getProducts(category?: string, page = 1, limit = 20): Promise<ProductsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(category && { category }),
    });

    return await this.request<ProductsResponse>(`${API_ENDPOINTS.products}?${params}`);
  }

  public async getProductById(id: string): Promise<Product> {
    const response = await this.request<{ product: Product }>(`${API_ENDPOINTS.products}/${id}`);
    return response.product;
  }

  public async createProduct(productData: CreateProductRequest): Promise<Product> {
    const response = await this.request<{ product: Product }>(
      API_ENDPOINTS.products,
      {
        method: 'POST',
        body: JSON.stringify(productData),
      }
    );
    return response.product;
  }

  public async updateProduct(id: string, productData: UpdateProductRequest): Promise<Product> {
    const response = await this.request<{ product: Product }>(
      `${API_ENDPOINTS.products}/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(productData),
      }
    );
    return response.product;
  }

  public async deleteProduct(id: string): Promise<void> {
    await this.request(`${API_ENDPOINTS.products}/${id}`, {
      method: 'DELETE',
    });
  }

  // Category operations
  public async getCategories(): Promise<string[]> {
    const response = await this.request<{ categories: string[] }>(API_ENDPOINTS.categories);
    return response.categories;
  }

  // Image upload
  public async uploadImage(imageUri: string): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'product-image.jpg',
    } as any);

    return this.request<{ imageUrl: string }>(API_ENDPOINTS.upload, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  }

  // Popular and new products
  public async getPopularProducts(): Promise<Product[]> {
    const response = await this.request<{ products: Product[] }>(`${API_ENDPOINTS.products}/popular`);
    return response.products;
  }

  public async getNewProducts(): Promise<Product[]> {
    const response = await this.request<{ products: Product[] }>(`${API_ENDPOINTS.products}/new`);
    return response.products;
  }
}

// Export singleton instance
export const productService = ProductService.getInstance();
