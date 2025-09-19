import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { User } from '../services/AuthService';
import EditProfileModal from './EditProfileModal';
import OrderHistoryModal from './OrderHistoryModal';
import PaymentMethodsModal from './PaymentMethodsModal';
import SettingsModal from './SettingsModal';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface ProfileModalProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly user: User | null;
  readonly onLogout: () => void;
  readonly onProfileUpdated?: (user: User) => void;
}

export default function ProfileModal({ visible, onClose, user, onLogout, onProfileUpdated }: ProfileModalProps) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPaymentMethodsVisible, setIsPaymentMethodsVisible] = useState(false);
  const [isOrderHistoryVisible, setIsOrderHistoryVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  const handleEditProfile = () => {
    if (user) {
      setIsEditModalVisible(true);
    }
  };

  const handleProfileUpdated = (updatedUser: User) => {
    if (onProfileUpdated) {
      onProfileUpdated(updatedUser);
    }
    setIsEditModalVisible(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.content}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={60} color="#666" />
            </View>
            
            <Text style={styles.userName}>
              {user?.name || 'Guest User'}
            </Text>
            
            <Text style={styles.userPhone}>
              {user?.phone || 'No phone number'}
            </Text>
          </View>

          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
              <Ionicons name="person-outline" size={24} color="#666" />
              <Text style={styles.menuText}>Edit Profile</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => setIsPaymentMethodsVisible(true)}>
              <Ionicons name="card-outline" size={24} color="#666" />
              <Text style={styles.menuText}>Payment Methods</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>


            <TouchableOpacity style={styles.menuItem} onPress={() => setIsOrderHistoryVisible(true)}>
              <Ionicons name="receipt-outline" size={24} color="#666" />
              <Text style={styles.menuText}>Order History</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => setIsSettingsVisible(true)}>
              <Ionicons name="settings-outline" size={24} color="#666" />
              <Text style={styles.menuText}>Settings</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>

          {user && (
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#EF4444" />
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>

      {/* Edit Profile Modal */}
      {user && (
        <EditProfileModal
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          user={user}
          onProfileUpdated={handleProfileUpdated}
        />
      )}

      {/* Payment Methods Modal */}
      {user && (
        <PaymentMethodsModal
          visible={isPaymentMethodsVisible}
          onClose={() => setIsPaymentMethodsVisible(false)}
          user={user}
        />
      )}


      {/* Order History Modal */}
      {user && (
        <OrderHistoryModal
          visible={isOrderHistoryVisible}
          onClose={() => setIsOrderHistoryVisible(false)}
          user={user}
        />
      )}

      {/* Settings Modal */}
      {user && (
        <SettingsModal
          visible={isSettingsVisible}
          onClose={() => setIsSettingsVisible(false)}
          user={user}
        />
      )}
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
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
  profileSection: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: isTablet ? 14 : 12,
    color: '#9CA3AF',
  },
  menuSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    color: '#EF4444',
    marginLeft: 8,
    fontWeight: '600',
  },
});
