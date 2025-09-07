import { useCallback, useEffect, useState } from 'react';
import {
    getDemoNewProducts,
    getDemoPopularProducts,
    getDemoProductsByCafeId,
    getDemoProductsByCategory
} from '../data/demoProducts';
import { productService } from '../services/ProductService';
import { Product, ProductCategory } from '../types/Product';

interface UseProductsOptions {
  category?: ProductCategory;
  autoFetch?: boolean;
  cafeId?: string; // Добавляем cafeId для получения продуктов конкретного кафе
}

interface UseProductsReturn {
  products: Product[];
  popularProducts: Product[];
  newProducts: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refetchPopular: () => Promise<void>;
  refetchNew: () => Promise<void>;
}

export const useProducts = (options: UseProductsOptions = {}): UseProductsReturn => {
  const { category, autoFetch = true, cafeId } = options;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!autoFetch) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Сначала пытаемся получить продукты через API
      const response = await productService.getProducts(category);
      setProducts(response.products);
    } catch (err) {
      console.warn('API not available, using demo products');
      
      // Если API недоступен, используем демо-данные
      if (cafeId) {
        let demoProducts: Product[];
        if (category) {
          demoProducts = getDemoProductsByCategory(cafeId, category);
        } else {
          demoProducts = getDemoProductsByCafeId(cafeId);
        }
        setProducts(demoProducts);
        setError(null); // Очищаем ошибку, так как используем демо-данные
      } else {
        setProducts([]);
        setError('Cafe ID not provided');
      }
    } finally {
      setLoading(false);
    }
  }, [category, autoFetch, cafeId]);

  const fetchPopularProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Сначала пытаемся получить популярные продукты через API
      const popular = await productService.getPopularProducts();
      setPopularProducts(popular);
    } catch (err) {
      console.warn('API not available, using demo popular products');
      
      // Если API недоступен, используем демо-данные
      if (cafeId) {
        const demoPopular = getDemoPopularProducts(cafeId);
        setPopularProducts(demoPopular);
      } else {
        setPopularProducts([]);
      }
      
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [cafeId]);

  const fetchNewProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Сначала пытаемся получить новые продукты через API
      const newProducts = await productService.getNewProducts();
      setNewProducts(newProducts);
    } catch (err) {
      console.warn('API not available, using demo new products');
      
      // Если API недоступен, используем демо-данные
      if (cafeId) {
        const demoNew = getDemoNewProducts(cafeId);
        setNewProducts(demoNew);
      } else {
        setNewProducts([]);
      }
      
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [cafeId]);

  const refetch = useCallback(async () => {
    await fetchProducts();
  }, [fetchProducts]);

  const refetchPopular = useCallback(async () => {
    await fetchPopularProducts();
  }, [fetchPopularProducts]);

  const refetchNew = useCallback(async () => {
    await fetchNewProducts();
  }, [fetchNewProducts]);

  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
      fetchPopularProducts();
      fetchNewProducts();
    }
  }, [fetchProducts, fetchPopularProducts, fetchNewProducts, autoFetch]);

  return {
    products,
    popularProducts,
    newProducts,
    loading,
    error,
    refetch,
    refetchPopular,
    refetchNew,
  };
};
