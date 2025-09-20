import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types/Product';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  time: string;
  cafeName: string;
  cafeLocation: string;
  cafeId: string;
  items: OrderItem[];
  total: number;
  status: 'completed' | 'processing' | 'cancelled';
  userId: string;
  createdAt: string;
}

const STORAGE_KEY = '@user_orders';

export class OrderService {
  private static instance: OrderService;

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  /**
   * Сохранить новый заказ
   */
  public async saveOrder(orderData: {
    userId: string;
    cafeId: string;
    cafeName: string;
    cafeLocation: string;
    cartItems: { product: Product; quantity: number }[];
    total: number;
  }): Promise<Order> {
    try {
      // Генерируем уникальный ID и номер заказа
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const orderNumber = `#${Math.floor(10000 + Math.random() * 90000)}`;
      const now = new Date();
      
      // Конвертируем товары корзины в элементы заказа
      const orderItems: OrderItem[] = orderData.cartItems.map(item => ({
        id: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        imageUrl: item.product.imageUrl,
      }));

      // Создаем объект заказа
      const order: Order = {
        id: orderId,
        orderNumber,
        date: now.toLocaleDateString('ru-RU'),
        time: now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        cafeName: orderData.cafeName,
        cafeLocation: orderData.cafeLocation,
        cafeId: orderData.cafeId,
        items: orderItems,
        total: orderData.total,
        status: 'completed',
        userId: orderData.userId,
        createdAt: now.toISOString(),
      };

      // Получаем существующие заказы
      const existingOrders = await this.getUserOrders(orderData.userId);
      
      // Добавляем новый заказ в начало списка
      const updatedOrders = [order, ...existingOrders];
      
      // Сохраняем обновленный список
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
      
      console.log('Order saved successfully:', order);
      return order;
    } catch (error) {
      console.error('Error saving order:', error);
      throw new Error('Failed to save order');
    }
  }

  /**
   * Получить все заказы пользователя
   */
  public async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const ordersData = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (!ordersData) {
        return [];
      }

      const allOrders: Order[] = JSON.parse(ordersData);
      
      // Фильтруем заказы по пользователю и сортируем по дате (новые первыми)
      return allOrders
        .filter(order => order.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('Error getting user orders:', error);
      return [];
    }
  }

  /**
   * Получить заказ по ID
   */
  public async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const ordersData = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (!ordersData) {
        return null;
      }

      const allOrders: Order[] = JSON.parse(ordersData);
      return allOrders.find(order => order.id === orderId) || null;
    } catch (error) {
      console.error('Error getting order by ID:', error);
      return null;
    }
  }

  /**
   * Обновить статус заказа
   */
  public async updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
    try {
      const ordersData = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (!ordersData) {
        return false;
      }

      const allOrders: Order[] = JSON.parse(ordersData);
      const orderIndex = allOrders.findIndex(order => order.id === orderId);
      
      if (orderIndex === -1) {
        return false;
      }

      allOrders[orderIndex].status = status;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allOrders));
      
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }

  /**
   * Удалить заказ
   */
  public async deleteOrder(orderId: string): Promise<boolean> {
    try {
      const ordersData = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (!ordersData) {
        return false;
      }

      const allOrders: Order[] = JSON.parse(ordersData);
      const filteredOrders = allOrders.filter(order => order.id !== orderId);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredOrders));
      return true;
    } catch (error) {
      console.error('Error deleting order:', error);
      return false;
    }
  }

  /**
   * Получить статистику заказов пользователя
   */
  public async getUserOrderStats(userId: string): Promise<{
    totalOrders: number;
    completedOrders: number;
    totalSpent: number;
    favoriteRestaurant: string | null;
  }> {
    try {
      const orders = await this.getUserOrders(userId);
      
      const completedOrders = orders.filter(order => order.status === 'completed');
      const totalSpent = completedOrders.reduce((sum, order) => sum + order.total, 0);
      
      // Находим самое популярное кафе
      const restaurantCounts: { [key: string]: number } = {};
      completedOrders.forEach(order => {
        restaurantCounts[order.cafeName] = (restaurantCounts[order.cafeName] || 0) + 1;
      });
      
      const favoriteRestaurant = Object.keys(restaurantCounts).length > 0
        ? Object.keys(restaurantCounts).reduce((a, b) => 
            restaurantCounts[a] > restaurantCounts[b] ? a : b
          )
        : null;

      return {
        totalOrders: orders.length,
        completedOrders: completedOrders.length,
        totalSpent,
        favoriteRestaurant,
      };
    } catch (error) {
      console.error('Error getting user order stats:', error);
      return {
        totalOrders: 0,
        completedOrders: 0,
        totalSpent: 0,
        favoriteRestaurant: null,
      };
    }
  }

  /**
   * Очистить все заказы пользователя (для тестирования)
   */
  public async clearUserOrders(userId: string): Promise<boolean> {
    try {
      const ordersData = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (!ordersData) {
        return true;
      }

      const allOrders: Order[] = JSON.parse(ordersData);
      const filteredOrders = allOrders.filter(order => order.userId !== userId);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredOrders));
      return true;
    } catch (error) {
      console.error('Error clearing user orders:', error);
      return false;
    }
  }
}

// Экспортируем singleton instance
export const orderService = OrderService.getInstance();
