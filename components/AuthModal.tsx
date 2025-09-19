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
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { authService, LoginCredentials, RegisterCredentials, User } from '../services/AuthService';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

interface AuthModalProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly onAuthSuccess: (user: User) => void;
}

type AuthMode = 'login' | 'register';

export default function AuthModal({ visible, onClose, onAuthSuccess }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Form states
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Animation values
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const switchAnim = useRef(new Animated.Value(0)).current;

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

  // Switch animation
  useEffect(() => {
    Animated.spring(switchAnim, {
      toValue: authMode === 'register' ? 1 : 0,
      tension: 100,
      friction: 8,
      useNativeDriver: false,
    }).start();
  }, [authMode]);

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!phone.trim() || phone.length < 10) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (!password || password.length < 6) {
      errors.password = 'Password must contain at least 6 characters';
    }

    if (authMode === 'register') {
      if (!name.trim()) {
        errors.name = 'Please enter your name';
      }
      
      if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    Keyboard.dismiss();

    try {
      let result;
      
      if (authMode === 'login') {
        const credentials: LoginCredentials = { phone, password };
        result = await authService.login(credentials);
      } else {
        const credentials: RegisterCredentials = { name, phone, password };
        result = await authService.register(credentials);
      }

      if (result.success && result.user) {
        onAuthSuccess(result.user);
        resetForm();
        onClose();
      } else {
        setFormErrors({ general: result.error || 'An error occurred' });
      }
    } catch (error) {
      console.error('Auth error:', error);
      setFormErrors({ general: 'Server connection error' });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setPhone('');
    setPassword('');
    setName('');
    setConfirmPassword('');
    setFormErrors({});
    setFocusedInput(null);
  };

  const switchAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setFormErrors({});
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
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoid}
          >
            <TouchableWithoutFeedback onPress={() => {}}>
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
                  <Text style={styles.headerTitle}>
                    {authMode === 'login' ? 'Sign In' : 'Sign Up'}
                  </Text>
                  <View style={styles.headerSpacer} />
                </View>

                {/* Auth Mode Switcher */}
                <View style={styles.switcherContainer}>
                  <View style={styles.switcherBackground}>
                    <Animated.View
                      style={[
                        styles.switcherIndicator,
                        {
                          left: switchAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [4, width * 0.5 - 20],
                          }),
                        },
                      ]}
                    />
                    <TouchableOpacity
                      style={styles.switcherButton}
                      onPress={() => setAuthMode('login')}
                    >
                      <Text style={[
                        styles.switcherText,
                        authMode === 'login' && styles.switcherTextActive,
                      ]}>
                        Sign In
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.switcherButton}
                      onPress={() => setAuthMode('register')}
                    >
                      <Text style={[
                        styles.switcherText,
                        authMode === 'register' && styles.switcherTextActive,
                      ]}>
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
                  {/* General Error */}
                  {formErrors.general && (
                    <View style={styles.generalErrorContainer}>
                      <Ionicons name="alert-circle" size={20} color="#EF4444" />
                      <Text style={styles.generalErrorText}>{formErrors.general}</Text>
                    </View>
                  )}

                  {/* Registration Fields */}
                  {authMode === 'register' ? (
                    renderInput('name', name, setName, 'Your Name', 'person-outline', {
                      autoCapitalize: 'words',
                    })
                  ) : null}

                  {/* Common Fields */}
                  {renderInput('phone', phone, setPhone, 'Phone Number', 'call-outline', {
                    keyboardType: 'phone-pad',
                  })}

                  {renderInput('password', password, setPassword, 'Password', 'lock-closed-outline', {
                    secureTextEntry: true,
                  })}

                  {/* Confirm Password for Registration */}
                  {authMode === 'register' ? (
                    renderInput('confirmPassword', confirmPassword, setConfirmPassword, 'Confirm Password', 'lock-closed-outline', {
                      secureTextEntry: true,
                    })
                  ) : null}

                  {/* Submit Button */}
                  <TouchableOpacity
                    style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                  >
                    <LinearGradient
                      colors={isLoading ? ['#9CA3AF', '#6B7280'] : ['#10B981', '#059669']}
                      style={styles.submitGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <>
                          <Ionicons 
                            name={authMode === 'login' ? 'log-in' : 'person-add'} 
                            size={20} 
                            color="#fff" 
                          />
                          <Text style={styles.submitButtonText}>
                            {authMode === 'login' ? 'Sign In' : 'Sign Up'}
                          </Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Switch Mode */}
                  <TouchableOpacity style={styles.switchModeButton} onPress={switchAuthMode}>
                    <Text style={styles.switchModeText}>
                      {authMode === 'login' 
                        ? 'No account? Sign up here' 
                        : 'Already have an account? Sign in'}
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
            </LinearGradient>
              </Animated.View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
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
    maxHeight: height * 0.85,
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
  switcherContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  switcherBackground: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    position: 'relative',
  },
  switcherIndicator: {
    position: 'absolute',
    top: 4,
    width: width * 0.5 - 28,
    height: 36,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  switcherButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switcherText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  switcherTextActive: {
    color: '#1F2937',
    fontWeight: '600',
  },
  formContainer: {
    paddingHorizontal: 20,
    maxHeight: height * 0.5,
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
  inputContainer: {
    marginBottom: 16,
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
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
  },
  submitButton: {
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  switchModeButton: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  switchModeText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
});
