import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { User } from '../services/AuthService';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

interface SettingsModalProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly user: User;
}

export default function SettingsModal({ visible, onClose, user }: SettingsModalProps) {
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: false,
    locationServices: true,
    biometricAuth: false,
    darkMode: false,
    autoReorder: true,
  });

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

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data including images and temporary files. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Cache cleared successfully!');
          }
        }
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'This will reset all settings to default values. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setSettings({
              notifications: true,
              emailNotifications: false,
              locationServices: true,
              biometricAuth: false,
              darkMode: false,
              autoReorder: true,
            });
            Alert.alert('Success', 'Settings reset to default!');
          }
        }
      ]
    );
  };

  const renderSettingItem = (
    key: string,
    title: string,
    description: string,
    icon: string,
    value: boolean
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <View style={styles.settingIconContainer}>
          <Ionicons name={icon as any} size={20} color="#374151" />
        </View>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
        <Switch
          value={value}
          onValueChange={(newValue) => handleSettingChange(key, newValue)}
          trackColor={{ false: '#E5E7EB', true: '#BBF7D0' }}
          thumbColor={value ? '#10B981' : '#9CA3AF'}
          ios_backgroundColor="#E5E7EB"
        />
      </View>
    </View>
  );

  const renderActionItem = (
    title: string,
    description: string,
    icon: string,
    onPress: () => void,
    isDestructive = false
  ) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
      <View style={styles.actionContent}>
        <View style={[
          styles.actionIconContainer,
          isDestructive && styles.destructiveIconContainer
        ]}>
          <Ionicons 
            name={icon as any} 
            size={20} 
            color={isDestructive ? '#EF4444' : '#374151'} 
          />
        </View>
        <View style={styles.actionInfo}>
          <Text style={[
            styles.actionTitle,
            isDestructive && styles.destructiveText
          ]}>
            {title}
          </Text>
          <Text style={styles.actionDescription}>{description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
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
              <Text style={styles.headerTitle}>Settings</Text>
              <View style={styles.headerSpacer} />
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

              {/* Notifications Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notifications</Text>
                {renderSettingItem(
                  'notifications',
                  'Push Notifications',
                  'Receive notifications about orders and promotions',
                  'notifications',
                  settings.notifications
                )}
                {renderSettingItem(
                  'emailNotifications',
                  'Email Notifications',
                  'Receive order confirmations via email',
                  'mail',
                  settings.emailNotifications
                )}
              </View>

              {/* Privacy & Security Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Privacy & Security</Text>
                {renderSettingItem(
                  'locationServices',
                  'Location Services',
                  'Allow app to access your location for better recommendations',
                  'location',
                  settings.locationServices
                )}
                {renderSettingItem(
                  'biometricAuth',
                  'Biometric Authentication',
                  'Use fingerprint or face ID for quick access',
                  'finger-print',
                  settings.biometricAuth
                )}
              </View>

              {/* App Preferences Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>App Preferences</Text>
                {renderSettingItem(
                  'darkMode',
                  'Dark Mode',
                  'Switch to dark theme for better viewing in low light',
                  'moon',
                  settings.darkMode
                )}
                {renderSettingItem(
                  'autoReorder',
                  'Auto Reorder',
                  'Automatically suggest reordering your favorite items',
                  'repeat',
                  settings.autoReorder
                )}
              </View>

              {/* Action Items Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Data & Storage</Text>
                {renderActionItem(
                  'Clear Cache',
                  'Free up storage space by clearing cached data',
                  'trash',
                  handleClearCache
                )}
                {renderActionItem(
                  'Reset Settings',
                  'Reset all settings to their default values',
                  'refresh',
                  handleResetSettings,
                  true
                )}
              </View>

              {/* App Info */}
              <View style={styles.appInfo}>
                <Text style={styles.appInfoTitle}>Cafe App</Text>
                <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
                <Text style={styles.appInfoCopyright}>© 2024 CEPTEG Network</Text>
              </View>
            </ScrollView>
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
    minHeight: height * 0.8,
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  settingDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  actionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  destructiveIconContainer: {
    backgroundColor: '#FEF2F2',
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  destructiveText: {
    color: '#EF4444',
  },
  actionDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 30,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
    marginTop: 20,
  },
  appInfoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  appInfoVersion: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  appInfoCopyright: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
