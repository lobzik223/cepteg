import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { User } from '../services/AuthService';
import { Order, orderService } from '../services/OrderService';
import { formatPrice } from '../utils/priceFormatter';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

interface OrderHistoryItem {
  id: string;
  orderNumber: string;
  date: string;
  time: string;
  cafeName: string;
  cafeLocation: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'completed' | 'cancelled' | 'refunded';
}

interface OrderHistoryModalProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly user: User;
}

export default function OrderHistoryModal({ visible, onClose, user }: OrderHistoryModalProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Загружаем заказы пользователя при открытии модального окна
  useEffect(() => {
    if (visible && user) {
      loadUserOrders();
    }
  }, [visible, user]);

  const loadUserOrders = async () => {
    try {
      setLoading(true);
      const userOrders = await orderService.getUserOrders(user.id);
      setOrders(userOrders);
      console.log('Loaded user orders:', userOrders);
    } catch (error) {
      console.error('Error loading user orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = (orderId: string, orderNumber: string) => {
    Alert.alert(
      'Delete Order',
      `Are you sure you want to delete order ${orderNumber}? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await orderService.deleteOrder(orderId);
              if (success) {
                // Обновляем список заказов
                setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
                console.log('Order deleted successfully');
              } else {
                Alert.alert('Error', 'Failed to delete order. Please try again.');
              }
            } catch (error) {
              console.error('Error deleting order:', error);
              Alert.alert('Error', 'Failed to delete order. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Animation values
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'cancelled': return '#EF4444';
      case 'refunded': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'refunded': return 'Refunded';
      default: return 'Unknown';
    }
  };

  const SwipeableOrderItem = ({ item }: { item: Order }) => {
    const translateX = useRef(new Animated.Value(0)).current;
    const [isDeleting, setIsDeleting] = useState(false);

    const panGesture = Gesture.Pan()
      .onUpdate((event) => {
        translateX.setValue(Math.min(0, event.translationX));
      })
      .onEnd((event) => {
        const { translationX } = event;
        
        if (translationX < -100) {
          // Свайп влево больше 100px - показываем кнопку удаления
          Animated.timing(translateX, {
            toValue: -80,
            duration: 200,
            useNativeDriver: true,
          }).start();
        } else {
          // Возвращаем в исходное положение
          Animated.timing(translateX, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      });

    const resetPosition = () => {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    };

    const handleDelete = () => {
      setIsDeleting(true);
      // Анимация удаления
      Animated.timing(translateX, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        handleDeleteOrder(item.id, item.orderNumber);
        setIsDeleting(false);
        resetPosition();
      });
    };

    return (
      <View style={styles.swipeContainer}>
        {/* Кнопка удаления (фон) */}
        <View style={styles.deleteBackground}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            disabled={isDeleting}
          >
            <Ionicons name="trash-outline" size={24} color="#fff" />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>

        {/* Основной контент заказа */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              styles.orderCard,
              {
                transform: [{ translateX }],
              },
              isDeleting && { opacity: 0.7 },
            ]}
          >
            {renderOrderContent(item)}
          </Animated.View>
        </GestureDetector>
      </View>
    );
  };

  const renderOrderContent = (item: Order) => (
    <>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
          <Text style={styles.orderDate}>{item.date} at {item.time}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.cafeInfo}>
        <Ionicons name="storefront" size={16} color="#6B7280" />
        <View style={styles.cafeDetails}>
          <Text style={styles.cafeName}>{item.cafeName}</Text>
          <Text style={styles.cafeLocation}>{item.cafeLocation}</Text>
        </View>
      </View>

      <View style={styles.orderItems}>
        {item.items.map((orderItem) => (
          <View key={`${item.id}_${orderItem.id}`} style={styles.orderItemRow}>
            <Text style={styles.itemName}>
              {orderItem.quantity}x {orderItem.name}
            </Text>
            <Text style={styles.itemPrice}>
              {formatPrice(orderItem.price * orderItem.quantity)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalAmount}>{formatPrice(item.total)}</Text>
      </View>
    </>
  );

  const renderOrderItem = ({ item }: { item: Order }) => (
    <SwipeableOrderItem item={item} />
  );

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          <LinearGradient
            colors={['#FFFFFF', '#F8FAFC']}
            style={styles.modalContent}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="arrow-back" size={24} color="#6B7280" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Order History</Text>
              <View style={styles.headerSpacer} />
            </View>

            {/* User Info */}
            <View style={styles.userInfo}>
              <Ionicons name="person-circle" size={40} color="#10B981" />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userPhone}>{user.phone}</Text>
              </View>
              <View style={styles.statsContainer}>
                <Text style={styles.statsNumber}>{orders.length}</Text>
                <Text style={styles.statsLabel}>Orders</Text>
              </View>
            </View>

            {/* Orders List */}
            <View style={styles.content}>
              <Text style={styles.sectionTitle}>Recent Orders</Text>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#10B981" />
                  <Text style={styles.loadingText}>Loading your orders...</Text>
                </View>
              ) : (
                <FlatList
                  data={orders}
                  renderItem={renderOrderItem}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.ordersList}
                  ListEmptyComponent={
                    <View style={styles.emptyState}>
                      <Ionicons name="receipt-outline" size={60} color="#D1D5DB" />
                      <Text style={styles.emptyStateTitle}>No Orders Yet</Text>
                      <Text style={styles.emptyStateText}>Your order history will appear here after you make your first order</Text>
                    </View>
                  }
                />
              )}
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'transparent',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    maxHeight: height * 0.9,
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    minHeight: height * 0.7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSpacer: {
    width: 40,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  userDetails: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  userPhone: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statsContainer: {
    alignItems: 'center',
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
  },
  statsLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  ordersList: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  orderDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cafeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  cafeDetails: {
    marginLeft: 8,
    flex: 1,
  },
  cafeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  cafeLocation: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  orderItems: {
    marginBottom: 12,
  },
  orderItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemName: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    textAlign: 'center',
  },
  // Swipe styles
  swipeContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  deleteBackground: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 80,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
