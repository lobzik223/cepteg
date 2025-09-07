import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera'; // <-- YENİ
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface QRScannerViewProps {
  onCafeScanned: (cafeData: any) => void;
  onClose?: () => void;
}

export const QRScannerView: React.FC<QRScannerViewProps> = ({
  onCafeScanned,
  onClose,
}) => {
  const [permission, requestPermission] = useCameraPermissions(); // <-- YENİ
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [cafeCode, setCafeCode] = useState('');

  const hasPermission =
    permission?.granted === true ? true : permission ? false : null;

  const requestCameraPermission = async () => {
    setIsRequestingPermission(true);
    const res = await requestPermission();
    setIsRequestingPermission(false);
  };

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    setScanned(true);
    try {
      const cafeData = JSON.parse(data);
      if (!cafeData.cafeId || !cafeData.cafeName) throw new Error('Invalid cafe data');
      onCafeScanned(cafeData);
    } catch {
      Alert.alert(
        'Scanning Error',
        'QR code does not contain cafe information. Make sure you are scanning the correct code.',
        [{ text: 'Try Again', onPress: () => setScanned(false) }]
      );
    }
  };

  const toggleFlash = () => setFlashOn((v) => !v);

  const handleCafeCodeSubmit = () => {
    if (!cafeCode.trim()) {
      Alert.alert('Error', 'Please enter cafe code');
      return;
    }
    const cafeDataMap: Record<string, any> = {
      akafe: {
        cafeId: 'demo_cafe_001',
        cafeName: 'AKAFE',
        location: 'Moscow, Arbat St. 1',
        apiEndpoint: 'http://localhost:3000/api',
      },
      coffee: {
        cafeId: 'demo_cafe_002',
        cafeName: 'Coffee House',
        location: 'St. Petersburg, Nevsky Prospect 50',
        apiEndpoint: 'http://localhost:3001/api',
      },
      brew: {
        cafeId: 'demo_cafe_003',
        cafeName: 'Brew & Bean',
        location: 'Kazan, Bauman St. 15',
        apiEndpoint: 'http://localhost:3002/api',
      },
    };
    const cafeData = cafeDataMap[cafeCode.toLowerCase()];
    if (cafeData) onCafeScanned(cafeData);
    else {
      Alert.alert(
        'Cafe Not Found',
        'Available codes:\n• akafe - AKAFE (6 categories)\n• coffee - Coffee House (4 categories)\n• brew - Brew & Bean (4 categories)',
        [{ text: 'OK' }]
      );
    }
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />

        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={isTablet ? 32 : 24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>QR Code Scanning</Text>
          <View style={styles.placeholderButton} />
        </View>

        <View style={styles.permissionContainer}>
          <Ionicons name="qr-code" size={isTablet ? 80 : 60} color="#000" />
          <Text style={styles.permissionTitle}>Ready to Scan</Text>
          <Text style={styles.permissionText}>
            Press the button below to start QR code scanning
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestCameraPermission}
            disabled={isRequestingPermission}
          >
            {isRequestingPermission ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.permissionButtonText}>Start Scanning</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Text style={styles.cafeCodeTitle}>Enter Cafe Code</Text>
          <Text style={styles.cafeCodeDescription}>Available codes: akafe, coffee, brew</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.cafeCodeInput}
              value={cafeCode}
              onChangeText={setCafeCode}
              placeholder="Example: akafe"
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleCafeCodeSubmit}>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />

        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={isTablet ? 32 : 24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>QR Code Scanning</Text>
          <View style={styles.placeholderButton} />
        </View>

        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={isTablet ? 80 : 60} color="#000" />
          <Text style={styles.permissionTitle}>No Camera Access</Text>
          <Text style={styles.permissionText}>
            Camera permission is required to scan QR codes
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
            <Text style={styles.permissionButtonText}>Allow Access</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Text style={styles.cafeCodeTitle}>Enter Cafe Code</Text>
          <Text style={styles.cafeCodeDescription}>Available codes: akafe, coffee, brew</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.cafeCodeInput}
              value={cafeCode}
              onChangeText={setCafeCode}
              placeholder="Example: akafe"
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleCafeCodeSubmit}>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={isTablet ? 32 : 24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QR Code Scanning</Text>
        <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
          <Ionicons name={flashOn ? 'flash' : 'flash-off'} size={isTablet ? 28 : 24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          enableTorch={flashOn}                             // <-- YENİ
          barcodeScannerSettings={{ barcodeTypes: ['qr', 'ean13', 'code128'] }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
        {/* Overlay eski haliyle */}
        <View style={styles.overlay}>
          <View style={styles.overlayTop} />
          <View style={styles.overlayMiddle}>
            <View style={styles.overlaySide} />
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              <View style={styles.qrIconContainer}>
                <Ionicons name="qr-code" size={isTablet ? 80 : 60} color="#fff" />
              </View>
            </View>
            <View style={styles.overlaySide} />
          </View>
          <View style={styles.overlayBottom} />
        </View>
      </View>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Point camera at cafe QR code</Text>
        <Text style={styles.instructionsText}>
          QR code must contain cafe information to access the menu
        </Text>

        {scanned && (
          <TouchableOpacity style={styles.rescanButton} onPress={() => setScanned(false)}>
            <Ionicons name="refresh" size={20} color="#333" />
            <Text style={styles.rescanButtonText}>Scan Again</Text>
          </TouchableOpacity>
        )}

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Text style={styles.cafeCodeTitle}>Enter Cafe Code</Text>
        <Text style={styles.cafeCodeDescription}>Available codes: akafe (6), coffee (4), brew (4)</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.cafeCodeInput}
            value={cafeCode}
            onChangeText={setCafeCode}
            placeholder="Example: akafe"
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleCafeCodeSubmit}>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 40,
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
  },
  submitButton: {
    width: 50,
    height: 50,
    backgroundColor: '#333',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
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
});
