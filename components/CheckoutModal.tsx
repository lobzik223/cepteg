import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Image,
    LayoutAnimation,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';
import { Product } from '../types/Product';
import { formatPrice } from '../utils/priceFormatter';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface CartItem {
  product: Product;
  quantity: number;
  customizations?: any;
}

interface CheckoutModalProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly cartItems: CartItem[];
  readonly onOrderSuccess: () => void;
  readonly onUpdateQuantity?: (productId: string, quantity: number) => void;
  readonly onRemoveItem?: (productId: string) => void;
  readonly cafeId?: string;
}

export default function CheckoutModal({ 
  visible, 
  onClose, 
  cartItems, 
  onOrderSuccess,
  onUpdateQuantity,
  onRemoveItem,
  cafeId
}: CheckoutModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  
  // Enable LayoutAnimation for Android
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  
  // Payment form states
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [email, setEmail] = useState('');

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const handleIncreaseQuantity = (productId: string) => {
    if (onUpdateQuantity) {
      const item = cartItems.find(item => item.product.id === productId);
      if (item) {
        onUpdateQuantity(productId, item.quantity + 1);
      }
    }
  };

  const handleDecreaseQuantity = (productId: string) => {
    if (onUpdateQuantity) {
      const item = cartItems.find(item => item.product.id === productId);
      if (item) {
        if (item.quantity > 1) {
          onUpdateQuantity(productId, item.quantity - 1);
        } else if (onRemoveItem) {
          // Animate removal
          setRemovingItems(prev => new Set(prev).add(productId));
          
          // Configure LayoutAnimation for smooth removal
          LayoutAnimation.configureNext({
            duration: 200,
            create: {
              type: LayoutAnimation.Types.easeOut,
              property: LayoutAnimation.Properties.opacity,
            },
            update: {
              type: LayoutAnimation.Types.easeOut,
            },
            delete: {
              type: LayoutAnimation.Types.easeOut,
              property: LayoutAnimation.Properties.opacity,
            },
          });
          
          // Remove item after a short delay for animation
          setTimeout(() => {
            onRemoveItem(productId);
            setRemovingItems(prev => {
              const newSet = new Set(prev);
              newSet.delete(productId);
              return newSet;
            });
          }, 80);
        }
      }
    }
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.slice(0, 19); // Limit to 16 digits + 3 spaces
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handlePlaceOrder = () => {
    setShowPaymentForm(true);
  };

  const handlePaymentSubmit = async () => {
    console.log('CheckoutModal: handlePaymentSubmit called');
    console.log('CheckoutModal: cartItems:', cartItems);
    
    // Validate form
    if (!cardNumber || !expiryDate || !cvv || !cardholderName || !email) {
      alert('Please fill in all payment details');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, this would call your payment API
      // const paymentData = {
      //   cardNumber,
      //   expiryDate,
      //   cvv,
      //   cardholderName,
      //   email,
      //   amount: calculateTotal(),
      //   items: cartItems
      // };
      // await fetch('/api/payments', { method: 'POST', body: JSON.stringify(paymentData) });

      console.log('CheckoutModal: calling onOrderSuccess');
      onOrderSuccess();
      console.log('CheckoutModal: calling onClose');
      onClose();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };


  const renderCartItem = (item: CartItem, index: number) => {
    const isRemoving = removingItems.has(item.product.id);
    
    return (
      <Animated.View 
        key={index} 
        style={[
          styles.cartItem,
          isRemoving && {
            opacity: 0.2,
            transform: [{ scale: 0.9 }],
          }
        ]}
      >
      {/* Product Image */}
      <View style={styles.itemImageContainer}>
        {item.product.imageUrl ? (
          <Image
            source={typeof item.product.imageUrl === 'string' ? { uri: item.product.imageUrl } : item.product.imageUrl}
            style={styles.itemImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.itemImagePlaceholder}>
            <Ionicons name="cafe-outline" size={24} color="#9CA3AF" />
          </View>
        )}
      </View>

      {/* Product Details */}
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.product.name}</Text>
        {item.product.description && (
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.product.description}
          </Text>
        )}
        
        {/* Quantity and Customizations */}
        <View style={styles.itemMeta}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              onPress={() => handleDecreaseQuantity(item.product.id)}
              style={styles.quantityButton}
            >
              <Ionicons name="remove-circle-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity 
              onPress={() => handleIncreaseQuantity(item.product.id)}
              style={styles.quantityButton}
            >
              <Ionicons name="add-circle-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          {item.customizations && (
            <View style={styles.customizationsContainer}>
              <Text style={styles.customizationText}>
                Size: {item.customizations.size || 'Medium'}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Price */}
      <View style={styles.itemPriceContainer}>
        <Text style={styles.itemPrice}>
          {formatPrice(item.product.price * item.quantity)}
        </Text>
        <Text style={styles.itemUnitPrice}>
          {formatPrice(item.product.price)} each
        </Text>
      </View>
      </Animated.View>
    );
  };

  const renderPaymentForm = () => (
    <View style={styles.container}>
      <View style={styles.paymentHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => setShowPaymentForm(false)}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.paymentHeaderTitle}>Payment Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Card Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.paymentInput}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#9CA3AF"
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                keyboardType="numeric"
                maxLength={19}
              />
              <Ionicons name="card-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <TextInput
                style={styles.paymentInput}
                placeholder="MM/YY"
                placeholderTextColor="#9CA3AF"
                value={expiryDate}
                onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput
                style={styles.paymentInput}
                placeholder="123"
                placeholderTextColor="#9CA3AF"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Cardholder Name</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.paymentInput}
                placeholder="John Doe"
                placeholderTextColor="#9CA3AF"
                value={cardholderName}
                onChangeText={setCardholderName}
                autoCapitalize="words"
              />
              <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.paymentInput}
                placeholder="john@example.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            </View>
          </View>
        </View>

        <View style={styles.paymentTotalContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>{formatPrice(calculateTotal())}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.payButton, isProcessing && styles.disabledButton]}
          onPress={handlePaymentSubmit}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>Pay {formatPrice(calculateTotal())}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCheckoutContent = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#376138" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Order Summary</Text>
          <Text style={styles.subtitle}>
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your order
          </Text>
        </View>

        {cartItems.length > 0 ? (
          <View style={styles.itemsContainer}>
            {cartItems.map((item, index) => renderCartItem(item, index))}
          </View>
        ) : (
          <View style={styles.emptyCartContainer}>
            <Ionicons name="cart-outline" size={isTablet ? 80 : 64} color="#9CA3AF" />
            <Text style={styles.emptyCartText}>Cart is empty</Text>
            <Text style={styles.emptyCartSubtext}>Add items to your order</Text>
          </View>
        )}


        <View style={styles.totalContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatPrice(calculateTotal())}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Service Fee</Text>
            <Text style={styles.totalValue}>₺0</Text>
          </View>
          <View style={[styles.totalRow, styles.finalTotal]}>
            <Text style={styles.finalTotalLabel}>Total to pay</Text>
            <Text style={styles.finalTotalValue}>{formatPrice(calculateTotal())}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.placeOrderButton, (isProcessing || cartItems.length === 0) && styles.disabledButton]}
          onPress={handlePlaceOrder}
          disabled={isProcessing || cartItems.length === 0}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons 
                name="card" 
                size={20} 
                color={cartItems.length === 0 ? "#9CA3AF" : "#fff"} 
              />
              <Text style={[
                styles.placeOrderText,
                cartItems.length === 0 && { color: '#9CA3AF' }
              ]}>
                {cartItems.length === 0 ? 'Add items to cart' : 'Place Order'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      {showPaymentForm ? renderPaymentForm() : renderCheckoutContent()}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleContainer: {
    marginBottom: 20,
  },
  paymentTitleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: isTablet ? 28 : 24,
    fontWeight: 'bold',
    color: '#376138',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  userText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  itemsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
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
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 20,
  },
  itemDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 8,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  quantityButton: {
    padding: 4,
    borderRadius: 4,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  customizationsContainer: {
    flex: 1,
    marginLeft: 8,
  },
  customizationText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  itemPriceContainer: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  itemUnitPrice: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  totalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  finalTotal: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 8,
    paddingTop: 16,
  },
  finalTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#376138',
  },
  finalTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#376138',
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  placeOrderButton: {
    backgroundColor: '#359441',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#359441',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Payment Form Styles
  paymentSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  payButton: {
    backgroundColor: '#359441',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#359441',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  emptyCartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isTablet ? 60 : 40,
    paddingHorizontal: 20,
  },
  emptyCartText: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: isTablet ? 20 : 16,
    marginBottom: isTablet ? 12 : 8,
    textAlign: 'center',
  },
  emptyCartSubtext: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '400',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: isTablet ? 26 : 24,
  },
  // Payment form specific styles
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  paymentHeaderTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerSpacer: {
    width: 40,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  paymentInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 12,
    fontWeight: '500',
  },
  inputIcon: {
    marginLeft: 8,
  },
  paymentTotalContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});

