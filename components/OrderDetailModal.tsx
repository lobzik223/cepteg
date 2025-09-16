import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
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

interface OrderDetailModalProps {
  visible: boolean;
  onClose: () => void;
  orderItems: OrderItem[];
  orderNumber: string;
  orderStatus: 'accepted' | 'preparing' | 'ready' | 'completed';
  cafeName?: string;
  cafeAddress?: string;
  paymentMethod?: string;
  orderDate?: string;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  visible,
  onClose,
  orderItems,
  orderNumber,
  orderStatus,
  cafeName = 'Cafe',
  cafeAddress = 'Address not specified',
  paymentMethod = 'Credit Card',
  orderDate = new Date().toLocaleDateString()
}) => {
  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
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

  const statusColor = getStatusColor();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Order Status Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <View style={styles.orderInfo}>
                <Text style={styles.orderNumber}>{orderNumber}</Text>
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {getStatusText()}
                </Text>
              </View>
              <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
            </View>
            <Text style={styles.orderDate}>Ordered on {orderDate}</Text>
          </View>

          {/* Cafe Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="storefront" size={20} color="#666" />
              <Text style={styles.sectionTitle}>Cafe Information</Text>
            </View>
            <View style={styles.cafeInfo}>
              <Text style={styles.cafeName}>{cafeName}</Text>
              <View style={styles.addressContainer}>
                <Ionicons name="location" size={16} color="#999" />
                <Text style={styles.cafeAddress}>{cafeAddress}</Text>
              </View>
            </View>
          </View>

          {/* Order Items */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="receipt" size={20} color="#666" />
              <Text style={styles.sectionTitle}>Order Items</Text>
            </View>
            <View style={styles.itemsContainer}>
              {orderItems.map((item, index) => (
                <View key={`${item.product.id}-${index}`} style={styles.orderItem}>
                  <View style={styles.itemImageContainer}>
                    {item.product.imageUrl ? (
                      <Image
                        source={typeof item.product.imageUrl === 'string' 
                          ? { uri: item.product.imageUrl } 
                          : item.product.imageUrl}
                        style={styles.itemImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.itemImagePlaceholder}>
                        <Ionicons name="cafe" size={24} color="#999" />
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.product.name}</Text>
                    {item.product.description && (
                      <Text style={styles.itemDescription} numberOfLines={2}>
                        {item.product.description}
                      </Text>
                    )}
                    <View style={styles.itemMeta}>
                      <Text style={styles.itemQuantity}>
                        Quantity: {item.quantity}
                      </Text>
                      <Text style={styles.itemPrice}>
                        {formatPrice(item.product.price * item.quantity)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Payment Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="card" size={20} color="#666" />
              <Text style={styles.sectionTitle}>Payment Information</Text>
            </View>
            <View style={styles.paymentInfo}>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Payment Method:</Text>
                <Text style={styles.paymentValue}>{paymentMethod}</Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Total Amount:</Text>
                <Text style={styles.paymentTotal}>{formatPrice(calculateTotal())}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statusText: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  orderDate: {
    fontSize: isTablet ? 14 : 12,
    color: '#6B7280',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  cafeInfo: {
    gap: 8,
  },
  cafeName: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cafeAddress: {
    fontSize: isTablet ? 14 : 12,
    color: '#6B7280',
    flex: 1,
  },
  itemsContainer: {
    gap: 16,
  },
  orderItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#F8F9FA',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: isTablet ? 13 : 12,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 16,
  },
  itemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemQuantity: {
    fontSize: isTablet ? 13 : 12,
    color: '#6B7280',
  },
  itemPrice: {
    fontSize: isTablet ? 15 : 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  paymentInfo: {
    gap: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: isTablet ? 14 : 12,
    color: '#6B7280',
  },
  paymentValue: {
    fontSize: isTablet ? 14 : 12,
    fontWeight: '500',
    color: '#1F2937',
  },
  paymentTotal: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
});
