import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { authService, User } from '../services/AuthService';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

interface EditProfileModalProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly user: User;
  readonly onProfileUpdated: (user: User) => void;
}

export default function EditProfileModal({ visible, onClose, user, onProfileUpdated }: EditProfileModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Animation values
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      setName(user.name);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setFormErrors({});
    }
  }, [user]);

  // Animation effects
  useEffect(() => {
    if (visible) {
      // Show animations
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
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Hide animations
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!name.trim()) {
      errors.name = 'Please enter your name';
    }

    // Если пользователь хочет изменить пароль
    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        errors.currentPassword = 'Please enter your current password';
      }
      
      if (newPassword.length < 6) {
        errors.newPassword = 'New password must contain at least 6 characters';
      }
      
      if (newPassword !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    Keyboard.dismiss();

    try {
      // Подготавливаем данные для обновления
      const updateData: Partial<User> = {
        name: name.trim(),
      };

      // Если пользователь меняет пароль, проверяем текущий пароль
      if (newPassword) {
        // В реальном приложении здесь была бы проверка текущего пароля через API
        // Для демо просто проверяем, что текущий пароль = 123456
        if (currentPassword !== '123456') {
          setFormErrors({ currentPassword: 'Current password is incorrect' });
          setIsLoading(false);
          return;
        }
        
        // Здесь в реальном приложении был бы API вызов для смены пароля
        // Для демо обновляем пароль в локальной базе
        const { setUserPassword } = await import('../data/demoUsers');
        setUserPassword(user.phone, newPassword);
      }

      // Обновляем профиль пользователя
      const result = await authService.updateUser(updateData);

      if (result.success && result.user) {
        onProfileUpdated(result.user);
        onClose();
        
        // Сбрасываем форму
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setFormErrors({});
      } else {
        setFormErrors({ general: result.error || 'Update failed' });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setFormErrors({ general: 'Server connection error' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (
    key: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    icon: string,
    options: {
      secureTextEntry?: boolean;
      keyboardType?: any;
      autoCapitalize?: any;
    } = {}
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{placeholder}</Text>
      <View style={[
        styles.inputWrapper,
        focusedInput === key && styles.inputWrapperFocused,
        formErrors[key] && styles.inputWrapperError,
      ]}>
        <Ionicons name={icon as any} size={20} color={focusedInput === key ? '#10B981' : '#9CA3AF'} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={(text) => {
            onChangeText(text);
            if (formErrors[key]) {
              setFormErrors({...formErrors, [key]: ''});
            }
          }}
          onFocus={() => setFocusedInput(key)}
          onBlur={() => setFocusedInput(null)}
          editable={true}
          selectTextOnFocus={true}
          {...options}
        />
      </View>
      {formErrors[key] && (
        <Text style={styles.errorText}>{formErrors[key]}</Text>
      )}
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
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim },
                ],
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
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={styles.headerSpacer} />
              </View>

              <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
                {/* Profile Icon */}
                <View style={styles.profileIconContainer}>
                  <View style={styles.profileIcon}>
                    <Ionicons name="person" size={32} color="#10B981" />
                  </View>
                  <Text style={styles.profileTitle}>Update Your Information</Text>
                </View>

                {/* General Error */}
                {formErrors.general && (
                  <View style={styles.generalErrorContainer}>
                    <Ionicons name="alert-circle" size={20} color="#EF4444" />
                    <Text style={styles.generalErrorText}>{formErrors.general}</Text>
                  </View>
                )}

                {/* Basic Information Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Basic Information</Text>
                  
                  {renderInput('name', name, setName, 'Your Name', 'person-outline', {
                    autoCapitalize: 'words',
                  })}

                  {/* Phone number (read-only) */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Phone Number</Text>
                    <View style={styles.readOnlyInputWrapper}>
                      <Ionicons name="call-outline" size={20} color="#9CA3AF" />
                      <Text style={styles.readOnlyInput}>{user.phone}</Text>
                      <View style={styles.readOnlyBadge}>
                        <Text style={styles.readOnlyBadgeText}>Read Only</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Password Change Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Change Password</Text>
                  <Text style={styles.sectionSubtitle}>Leave empty if you don't want to change password</Text>
                  
                  {renderInput('currentPassword', currentPassword, setCurrentPassword, 'Current Password', 'lock-closed-outline', {
                    secureTextEntry: true,
                  })}

                  {renderInput('newPassword', newPassword, setNewPassword, 'New Password', 'lock-open-outline', {
                    secureTextEntry: true,
                  })}

                  {renderInput('confirmPassword', confirmPassword, setConfirmPassword, 'Confirm New Password', 'lock-closed-outline', {
                    secureTextEntry: true,
                  })}
                </View>

                {/* Save Button */}
                <TouchableOpacity
                  style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                  onPress={handleSave}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={isLoading ? ['#9CA3AF', '#6B7280'] : ['#10B981', '#059669']}
                    style={styles.saveGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <>
                        <Ionicons name="checkmark-circle" size={20} color="#fff" />
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </ScrollView>
            </LinearGradient>
          </Animated.View>
        </KeyboardAvoidingView>
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
  keyboardAvoid: {
    flex: 1,
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
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
  formContainer: {
    paddingHorizontal: 20,
    maxHeight: height * 0.7,
  },
  profileIconContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    fontStyle: 'italic',
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 4,
    minHeight: 52,
  },
  inputWrapperFocused: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  inputWrapperError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 12,
    paddingLeft: 12,
    fontWeight: '500',
  },
  readOnlyInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 52,
  },
  readOnlyInput: {
    flex: 1,
    fontSize: 16,
    color: '#6B7280',
    paddingLeft: 12,
    fontWeight: '500',
  },
  readOnlyBadge: {
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  readOnlyBadgeText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
  },
  generalErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  generalErrorText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  saveButton: {
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
