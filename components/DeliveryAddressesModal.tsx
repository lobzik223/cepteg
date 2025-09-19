import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { User } from '../services/AuthService';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

interface DeliveryAddress {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  isDefault: boolean;
}

interface DeliveryAddressesModalProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly user: User;
}

export default function DeliveryAddressesModal({ visible, onClose, user }: DeliveryAddressesModalProps) {
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([
    {
      id: 'addr_001',
      name: 'Home',
      address: 'Nevsky Prospect 50, Apt 15',
      city: 'St. Petersburg',
      phone: user.phone,
      isDefault: true,
    },
    {
      id: 'addr_002',
      name: 'Office',
      address: 'Business Center, Floor 5',
      city: 'Moscow',
      phone: user.phone,
      isDefault: false,
    },
  ]);

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Add address form
  const [addressName, setAddressName] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState(user.phone);

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

  const handleAddAddress = async () => {
    if (!addressName || !addressLine || !city) {
      Alert.alert('Error', 'Please fill in all address details');
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newAddress: DeliveryAddress = {
        id: `addr_${Date.now()}`,
        name: addressName,
        address: addressLine,
        city: city,
        phone: phone,
        isDefault: addresses.length === 0,
      };

      setAddresses([...addresses, newAddress]);
      setShowAddAddress(false);
      
      // Reset form
      setAddressName('');
      setAddressLine('');
      setCity('');
      setPhone(user.phone);
      
      Alert.alert('Success', 'Delivery address added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add delivery address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addrs => 
      addrs.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }))
    );
  };

  const handleDeleteAddress = (id: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this delivery address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAddresses(addrs => addrs.filter(addr => addr.id !== id));
          }
        }
      ]
    );
  };

  const renderAddress = (address: DeliveryAddress) => (
    <View key={address.id} style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.addressIconContainer}>
          <Ionicons name="location" size={24} color="#374151" />
        </View>
        <View style={styles.addressInfo}>
          <Text style={styles.addressName}>{address.name}</Text>
          <Text style={styles.addressDetails}>{address.address}</Text>
          <Text style={styles.addressCity}>{address.city}</Text>
          <Text style={styles.addressPhone}>{address.phone}</Text>
        </View>
        {address.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultBadgeText}>Default</Text>
          </View>
        )}
      </View>
      
      <View style={styles.addressActions}>
        {!address.isDefault && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleSetDefault(address.id)}
          >
            <Text style={styles.actionButtonText}>Set Default</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteAddress(address.id)}
        >
          <Ionicons name="trash-outline" size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
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
              <Text style={styles.headerTitle}>Delivery Addresses</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setShowAddAddress(true)}
              >
                <Ionicons name="add" size={24} color="#10B981" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* User Info */}
              <View style={styles.userInfo}>
                <Ionicons name="person-circle" size={40} color="#10B981" />
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userPhone}>{user.phone}</Text>
                </View>
              </View>

              {/* Addresses List */}
              <View style={styles.addressesList}>
                <Text style={styles.sectionTitle}>Your Delivery Addresses</Text>
                {addresses.length > 0 ? (
                  addresses.map(renderAddress)
                ) : (
                  <View style={styles.emptyState}>
                    <Ionicons name="location-outline" size={60} color="#D1D5DB" />
                    <Text style={styles.emptyStateTitle}>No Delivery Addresses</Text>
                    <Text style={styles.emptyStateText}>Add an address for delivery orders</Text>
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Add Address Modal */}
            {showAddAddress && (
              <View style={styles.addAddressOverlay}>
                <View style={styles.addAddressModal}>
                  <View style={styles.addAddressHeader}>
                    <Text style={styles.addAddressTitle}>Add Delivery Address</Text>
                    <TouchableOpacity onPress={() => setShowAddAddress(false)}>
                      <Ionicons name="close" size={24} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={styles.addAddressForm} showsVerticalScrollIndicator={false}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Address Name</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Home, Office, etc."
                        value={addressName}
                        onChangeText={setAddressName}
                        autoCapitalize="words"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Street Address</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Street name, building number, apartment"
                        value={addressLine}
                        onChangeText={setAddressLine}
                        autoCapitalize="words"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>City</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="City name"
                        value={city}
                        onChangeText={setCity}
                        autoCapitalize="words"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Contact Phone</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Phone number for delivery"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                      />
                    </View>

                    <TouchableOpacity
                      style={[styles.addAddressButton, isLoading && styles.addAddressButtonDisabled]}
                      onPress={handleAddAddress}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.addAddressButtonText}>Add Address</Text>
                      )}
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </View>
            )}
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 16,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  userDetails: {
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
  addressesList: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  addressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  addressIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  addressDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  addressCity: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  addressPhone: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  defaultBadge: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  defaultBadgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
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
  // Add Address Modal Styles
  addAddressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addAddressModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    margin: 20,
    maxWidth: 400,
    width: '90%',
    maxHeight: height * 0.8,
  },
  addAddressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  addAddressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  addAddressForm: {
    padding: 20,
    maxHeight: height * 0.5,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  addAddressButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  addAddressButtonDisabled: {
    opacity: 0.7,
  },
  addAddressButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
