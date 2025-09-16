import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Product } from '../types/Product';
import { formatPrice } from '../utils/priceFormatter';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface OrderItem {
  product: Product;
  quantity: number;
  customizations?: any;
}

interface MyOrderSectionProps {
  orderItems: OrderItem[];
  onClose?: () => void;
  orderNumber?: string;
  orderStatus?: 'accepted' | 'preparing' | 'ready' | 'completed';
}

export const MyOrderSection: React.FC<MyOrderSectionProps> = ({
  orderItems,
  onClose,
  orderNumber = '#12345',
  orderStatus = 'accepted'
}) => {
  console.log('MyOrderSection rendered with orderItems:', orderItems);
  
  if (!orderItems || orderItems.length === 0) {
    console.log('MyOrderSection: no order items, returning null');
    return null;
  }

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const getProgressPercentage = () => {
    switch (orderStatus) {
      case 'accepted': return 25;
      case 'preparing': return 50;
      case 'ready': return 75;
      case 'completed': return 100;
      default: return 25;
    }
  };

  const getStatusText = () => {
    switch (orderStatus) {
      case 'accepted': return 'Order Accepted';
      case 'preparing': return 'Preparing';
      case 'ready': return 'Ready for Pickup';
      case 'completed': return 'Completed';
      default: return 'Order Accepted';
    }
  };

  const getStatusColor = () => {
    switch (orderStatus) {
      case 'accepted': return '#10B981';
      case 'preparing': return '#F59E0B';
      case 'ready': return '#3B82F6';
      case 'completed': return '#6B7280';
      default: return '#10B981';
    }
  };

  const progress = getProgressPercentage();
  const statusColor = getStatusColor();
  const statusText = getStatusText();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="receipt-outline" size={20} color="#374151" />
          <Text style={styles.title}>My Order</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Progress Circle and Order Info */}
        <View style={styles.progressSection}>
          <View style={styles.progressContainer}>
            <LinearGradient
              colors={[statusColor, statusColor + '80']}
              style={styles.progressCircle}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.progressInner}>
                <Text style={styles.progressPercentage}>{progress}%</Text>
              </View>
            </LinearGradient>
          </View>
          
          <View style={styles.orderInfo}>
            <Text style={styles.orderNumber}>{orderNumber}</Text>
            <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.itemsContainer}>
          <Text style={styles.itemsTitle}>Ordered Items:</Text>
          {orderItems.slice(0, 3).map((item) => (
            <View key={item.product.id} style={styles.orderItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.product.name}
                </Text>
                <Text style={styles.itemQuantity}>
                  {item.quantity}x {formatPrice(item.product.price)}
                </Text>
              </View>
              <Text style={styles.itemTotal}>
                {formatPrice(item.product.price * item.quantity)}
              </Text>
            </View>
          ))}
          
          {orderItems.length > 3 && (
            <Text style={styles.moreItems}>
              +{orderItems.length - 3} more items
            </Text>
          )}
        </View>

        {/* Total */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>{formatPrice(calculateTotal())}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: isTablet ? 20 : 16,
    marginHorizontal: isTablet ? 20 : 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 20 : 16,
    paddingTop: isTablet ? 16 : 12,
    paddingBottom: isTablet ? 12 : 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  content: {
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 16 : 12,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isTablet ? 20 : 16,
  },
  progressContainer: {
    marginRight: isTablet ? 20 : 16,
  },
  progressCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  progressInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  progressPercentage: {
    fontSize: isTablet ? 14 : 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statusText: {
    fontSize: isTablet ? 14 : 12,
    fontWeight: '600',
  },
  itemsContainer: {
    marginBottom: isTablet ? 16 : 12,
  },
  itemsTitle: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: isTablet ? 12 : 8,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: isTablet ? 8 : 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: isTablet ? 15 : 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: isTablet ? 13 : 12,
    color: '#6B7280',
  },
  itemTotal: {
    fontSize: isTablet ? 15 : 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  moreItems: {
    fontSize: isTablet ? 13 : 12,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: isTablet ? 8 : 6,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: isTablet ? 12 : 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    color: '#374151',
  },
  totalAmount: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
});
