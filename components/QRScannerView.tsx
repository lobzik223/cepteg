import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';

import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { networkService } from '../services/NetworkService';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface QRScannerViewProps {
  onCafeScanned: (cafeData: any) => void;
  onNetworkSearch?: (networkName: string, cafes: any[]) => void;
  onClose?: () => void;
}

export const QRScannerView: React.FC<QRScannerViewProps> = ({
  onCafeScanned,
  onNetworkSearch,
  onClose,
}) => {
  const [permission, requestPermission] = useCameraPermissions();

  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [cafeCode, setCafeCode] = useState('');
  const [scanError, setScanError] = useState<string | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showManualInput, setShowManualInput] = useState(true);
  const [isShowingAlert, setIsShowingAlert] = useState(false);
  const isProcessingRef = useRef(false);

  const hasPermission =
    permission?.granted === true ? true : permission ? false : null;

  // Keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
      setIsInputFocused(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const requestCameraPermission = async () => {
    try {
    setIsRequestingPermission(true);
      setScanError(null);
      const result = await requestPermission();
      
      if (!result.granted) {
        setScanError('Camera permission is required to scan QR codes');
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      setScanError('Failed to request camera permission');
    } finally {
    setIsRequestingPermission(false);
    }
  };

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned || isShowingAlert || isProcessingRef.current) return;
    
    console.log('🔍 QR Code scanned:', { type, data });
    isProcessingRef.current = true;
    setScanned(true);
    setScanError(null);
    setIsShowingAlert(true);
    
    try {
      // Validate data
      if (!data || typeof data !== 'string') {
        throw new Error('Invalid QR code data');
      }

      // Try to parse as JSON
      let cafeData;
      try {
        cafeData = JSON.parse(data);
      } catch {
        // If not JSON, treat as simple cafe code
        console.log('🔍 Treating as simple cafe code:', data);
        const result = await handleCafeCodeSubmit(data);
        if (!result) {
          // If handleCafeCodeSubmit didn't handle it, show error
          throw new Error('Invalid cafe code');
        }
        return;
      }

      // Validate cafe data structure
      if (!cafeData || typeof cafeData !== 'object') {
        throw new Error('Invalid cafe data structure');
      }

      if (!cafeData.cafeId || !cafeData.cafeName) {
        throw new Error('Missing required cafe information');
      }

      console.log('🔍 Valid cafe data found:', cafeData);
      onCafeScanned(cafeData);
      
    } catch (error) {
      console.error('🔍 QR scan error:', error);
      setScanError(error instanceof Error ? error.message : 'Unknown scanning error');
      
      Alert.alert(
        'QR Code Not Recognized',
        'This QR code is not recognized. Please try scanning a valid cafe QR code or enter the cafe name manually.',
        [
          { 
            text: 'OK', 
            onPress: () => {
              setScanned(false);
              setScanError(null);
              setIsShowingAlert(false);
              isProcessingRef.current = false;
            }
          }
        ]
      );
    }
  };

  const toggleFlash = () => setFlashOn((v) => !v);

  const resetScanning = () => {
    setScanned(false);
    setScanError(null);
    setIsShowingAlert(false);
    isProcessingRef.current = false;
  };

  const handleCafeCodeSubmit = async (code?: string): Promise<boolean> => {
    const inputCode = code || cafeCode;
    console.log('🔍 handleCafeCodeSubmit called with code:', inputCode);
    
    if (isShowingAlert) return false;
    
    if (!inputCode.trim()) {
      setIsShowingAlert(true);
      Alert.alert('Oops!', 'Please enter the name of your favorite cafe or restaurant', [
        { text: 'OK', onPress: () => setIsShowingAlert(false) }
      ]);
      return false;
    }

    try {
      // Используем NetworkService для валидации
      const validation = await networkService.validateInput(inputCode);
      console.log('🔍 Validation result:', validation);
      
      if (validation.type === 'cafe' && validation.result.isValid) {
        // Найдено конкретное кафе
        const cafeResult = validation.result as any;
        console.log('🔍 Calling onCafeScanned with:', cafeResult.cafeData);
        onCafeScanned(cafeResult.cafeData);
        return true;
      } 
      
      if (validation.type === 'network' && validation.result.isValid) {
        // Найдена сеть кафе
        const networkResult = validation.result as any;
        console.log('🔍 Network search triggered for:', networkResult.networkName);
        console.log('🔍 Found cafes for network:', networkResult.cafes);
        
        if (onNetworkSearch && networkResult.cafes.length > 0) {
          onNetworkSearch(networkResult.networkName, networkResult.cafes);
          return true;
        }
      }
      
      // Не найдено
      setIsShowingAlert(true);
      Alert.alert(
        'Cafe Not Found',
        validation.result.message || `Sorry, we couldn't find "${inputCode}" in our network.`,
        [
          { text: 'OK', onPress: () => setIsShowingAlert(false) }
        ]
      );
      
      return false;
    } catch (error) {
      console.error('Error validating input:', error);
      setIsShowingAlert(true);
      Alert.alert(
        'Connection Error',
        'Failed to validate cafe. Please check your internet connection.',
        [
          { text: 'OK', onPress: () => setIsShowingAlert(false) }
        ]
      );
      
      return false;
    }
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={isTablet ? 32 : 24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>QR Code Scanning</Text>
          <View style={styles.placeholderButton} />
        </View>

        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
        {/* Permission Request */}
          <View style={[styles.permissionContainer, isKeyboardVisible && styles.permissionContainerKeyboard]}>
          <Ionicons name="qr-code" size={isTablet ? 80 : 60} color="#000" />
          <Text style={styles.permissionTitle}>Ready to Find Your Cafe</Text>
          <Text style={styles.permissionText}>
            Scan a QR code or enter your favorite cafe name to discover nearby locations
          </Text>
          <TouchableOpacity 
            style={styles.permissionButton} 
            onPress={() => requestCameraPermission()}
            disabled={isRequestingPermission}
          >
            {isRequestingPermission ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.permissionButtonText}>Start Finding Cafes</Text>
            )}
          </TouchableOpacity>
          
          {/* Manual Cafe Code Input for Simulator */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>
          
          <Text style={styles.cafeCodeTitle}>Enter Your Favorite Cafe</Text>
          <Text style={styles.cafeCodeDescription}>
            Type the name of your favorite cafe or restaurant and we&apos;ll find the nearest locations for you
          </Text>
          
          <View style={[styles.inputContainer, isInputFocused && styles.inputContainerFocused]}>
            <TextInput
              style={styles.cafeCodeInput}
              value={cafeCode}
              onChangeText={setCafeCode}
              placeholder="Try: coffee, brew..."
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
            />
            <TouchableOpacity 
              style={[styles.submitButton, isInputFocused && styles.submitButtonFocused]}
              onPress={() => handleCafeCodeSubmit()}
            >
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={isTablet ? 32 : 24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>QR Code Scanning</Text>
          <View style={styles.placeholderButton} />
        </View>

        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
        {/* Permission Denied */}
          <View style={[styles.permissionContainer, isKeyboardVisible && styles.permissionContainerKeyboard]}>
          <Ionicons name="camera-outline" size={isTablet ? 80 : 60} color="#DC2626" />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            To scan QR codes, please allow camera access in your device settings
          </Text>
          
          {scanError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{scanError}</Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={[styles.permissionButton, isRequestingPermission && styles.permissionButtonDisabled]} 
            onPress={() => requestCameraPermission()}
            disabled={isRequestingPermission}
          >
            {isRequestingPermission ? (
              <Text style={styles.permissionButtonText}>Requesting...</Text>
            ) : (
              <Text style={styles.permissionButtonText}>Allow Camera Access</Text>
            )}
          </TouchableOpacity>
          
          {/* Manual Cafe Code Input */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>
          
          <Text style={styles.cafeCodeTitle}>Enter Your Favorite Cafe</Text>
          <Text style={styles.cafeCodeDescription}>
            Type the name of your favorite cafe or restaurant and we&apos;ll find the nearest locations for you
          </Text>
          
          <View style={[styles.inputContainer, isInputFocused && styles.inputContainerFocused]}>
            <TextInput
              style={styles.cafeCodeInput}
              value={cafeCode}
              onChangeText={setCafeCode}
              placeholder="Try: coffee, brew..."
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
            />
            <TouchableOpacity 
              style={[styles.submitButton, isInputFocused && styles.submitButtonFocused]}
              onPress={() => handleCafeCodeSubmit()}
            >
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={isTablet ? 32 : 24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {showManualInput ? 'Enter Cafe Name' : 'QR Code Scanning'}
        </Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={[styles.headerButton, !showManualInput && styles.headerButtonActive]} 
            onPress={() => setShowManualInput(!showManualInput)}
          >
            <Ionicons 
              name="qr-code" 
              size={isTablet ? 24 : 20} 
              color={!showManualInput ? "#10B981" : "#000"} 
            />
          </TouchableOpacity>
          {!showManualInput && (
        <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
          <Ionicons 
            name={flashOn ? "flash" : "flash-off"} 
            size={isTablet ? 28 : 24} 
            color="#000" 
          />
        </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Camera View */}
      {!showManualInput && (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          enableTorch={flashOn}
            barcodeScannerSettings={{ 
              barcodeTypes: ['qr']
            }}
          onBarcodeScanned={scanned || isShowingAlert || isProcessingRef.current ? undefined : handleBarCodeScanned}
        />
        
        {/* Overlay */}
        <View style={styles.overlay}>
          {/* Top overlay */}
          <View style={styles.overlayTop} />
          
          {/* Middle section with scanning frame */}
          <View style={styles.overlayMiddle}>
            <View style={styles.overlaySide} />
            <View style={styles.scanFrame}>
              {/* Corner indicators */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              
              {/* QR Code Icon in center */}
              <View style={styles.qrIconContainer}>
                <Ionicons name="qr-code" size={isTablet ? 80 : 60} color="#fff" />
              </View>
            </View>
            <View style={styles.overlaySide} />
          </View>
          
          {/* Bottom overlay */}
          <View style={styles.overlayBottom} />
        </View>
      </View>
      )}

      {/* Manual Input View */}
      {showManualInput && (
        <KeyboardAvoidingView 
          style={styles.manualInputContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={styles.manualInputContent}>
            <View style={styles.manualInputHeader}>
              <Ionicons name="keypad" size={isTablet ? 60 : 50} color="#10B981" />
              <Text style={styles.manualInputTitle}>Enter Cafe Name</Text>
              <Text style={styles.manualInputDescription}>
                Type the name of your favorite cafe or restaurant and we&apos;ll find the nearest locations for you
              </Text>
            </View>
            
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={[styles.inputContainer, isInputFocused && styles.inputContainerFocused]}>
                <TextInput
                  style={styles.cafeCodeInput}
                  value={cafeCode}
                  onChangeText={setCafeCode}
                  placeholder="Try: coffee, brew..."
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  autoFocus={true}
                  editable={true}
                  selectTextOnFocus={true}
                  keyboardType="default"
                  returnKeyType="search"
                  onSubmitEditing={() => handleCafeCodeSubmit()}
                />
                <TouchableOpacity 
                  style={[styles.submitButton, isInputFocused && styles.submitButtonFocused]}
                  onPress={() => handleCafeCodeSubmit()}
                >
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
            
            
            {/* Switch to QR Scanner */}
            <TouchableOpacity 
              style={styles.switchToQRButton} 
              onPress={() => setShowManualInput(false)}
            >
              <Ionicons name="qr-code" size={20} color="#fff" />
              <Text style={styles.switchToQRText}>Or scan QR code</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* Instructions - Only show when camera is active */}
      {!showManualInput && (
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>
          Point camera at cafe QR code
        </Text>
        <Text style={styles.instructionsText}>
            Scan any cafe QR code to instantly access their menu and find nearby locations
        </Text>
        
        {scanned && (
          <TouchableOpacity 
            style={styles.rescanButton} 
              onPress={resetScanning}
          >
            <Ionicons name="refresh" size={20} color="#333" />
            <Text style={styles.rescanButtonText}>Scan Again</Text>
          </TouchableOpacity>
        )}
        
          {/* Quick switch to manual input */}
          <TouchableOpacity 
            style={styles.switchToManualButton} 
            onPress={() => setShowManualInput(true)}
          >
            <Ionicons name="keypad" size={20} color="#10B981" />
            <Text style={styles.switchToManualText}>Or enter cafe name manually</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 40,
  },
  permissionContainerKeyboard: {
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  permissionTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: isTablet ? 16 : 14,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  permissionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  permissionButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.7,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginVertical: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: isTablet ? 14 : 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    color: '#666',
    fontSize: isTablet ? 14 : 12,
    marginHorizontal: 15,
  },
  cafeCodeTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  cafeCodeDescription: {
    fontSize: isTablet ? 14 : 12,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
    pointerEvents: 'box-none',
  },
  inputContainerFocused: {
    transform: [{ scale: 1.02 }],
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  cafeCodeInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: isTablet ? 16 : 14,
    color: '#000',
    marginRight: 10,
    minHeight: 50,
    textAlignVertical: 'center',
  },
  submitButton: {
    width: 50,
    height: 50,
    backgroundColor: '#333',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonFocused: {
    backgroundColor: '#10B981',
    transform: [{ scale: 1.1 }],
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerButton: {
    width: isTablet ? 44 : 40,
    height: isTablet ? 44 : 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  closeButton: {
    width: isTablet ? 44 : 40,
    height: isTablet ? 44 : 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#000',
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
  },
  flashButton: {
    width: isTablet ? 44 : 40,
    height: isTablet ? 44 : 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderButton: {
    width: isTablet ? 44 : 40,
    height: isTablet ? 44 : 40,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: isTablet ? 300 : 250,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scanFrame: {
    width: isTablet ? 300 : 250,
    height: isTablet ? 300 : 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#fff',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  qrIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 30,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  instructionsContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 25,
    alignItems: 'center',
  },
  instructionsTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  instructionsText: {
    fontSize: isTablet ? 14 : 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  rescanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  rescanButtonText: {
    color: '#333',
    fontSize: isTablet ? 14 : 12,
    fontWeight: '500',
    marginLeft: 8,
  },
  manualInputContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  manualInputContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  manualInputHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  manualInputTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  manualInputDescription: {
    fontSize: isTablet ? 16 : 14,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
  },
  switchToManualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  switchToManualText: {
    color: '#10B981',
    fontSize: isTablet ? 14 : 12,
    fontWeight: '500',
    marginLeft: 8,
  },
  switchToQRButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 30,
  },
  switchToQRText: {
    color: '#fff',
    fontSize: isTablet ? 14 : 12,
    fontWeight: '500',
    marginLeft: 8,
  },
});