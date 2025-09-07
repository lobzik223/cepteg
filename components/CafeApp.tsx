import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Cafe, cafeService } from '../services/CafeService';
import { cafeStorageService, TenantData } from '../services/CafeStorageService';
import { OnboardingService } from '../services/OnboardingService';
import HomeView from './HomeView';
import OnboardingView from './OnboardingView';
import ProfileView from './ProfileView';
import { QRScannerView } from './QRScannerView';
import { QRTestPanel } from './QRTestPanel';
import SplashScreen from './SplashScreen';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

type AppState = 'onboarding' | 'qr-scanner' | 'splash' | 'home' | 'loading' | 'qr-test' | 'profile';

export const CafeApp: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [appState, setAppState] = useState<AppState>('loading');
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [preloadedData, setPreloadedData] = useState<any>(null);

  // Get configuration from app.config.js
  const config = Constants.expoConfig?.extra || {};
  const bypassQR = config.BYPASS_QR === "true";

  // Bootstrap: Initialize app based on configuration
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check if onboarding was completed
      const onboardingCompleted = await OnboardingService.isOnboardingCompleted();
      
      if (!onboardingCompleted) {
        setAppState('onboarding');
        return;
      }

      // Check if we have deep link parameters
      if (params.cafeId && params.cafeName) {
        const cafeData = {
          cafeId: params.cafeId as string,
          cafeName: params.cafeName as string,
          location: params.location as string || '',
          apiEndpoint: params.apiEndpoint as string || config.API_BASE || 'http://localhost:3000/api'
        };
        
        await handleQRScan(cafeData);
        return;
      }

      // Check if we have a saved tenant
      const savedTenant = await cafeStorageService.getCurrentTenant();
      
      if (savedTenant) {
        // Use saved tenant - this will restore full cafe data including categories
        const cafe = cafeStorageService.createCafeFromTenant(savedTenant);
        console.log(`🔄 Restoring saved cafe: ${cafe.name} with ${cafe.categories?.length || 0} categories`);
        setSelectedCafe(cafe);
        setAppState('splash');
        
        // Show splash for 2 seconds then go to home
        setTimeout(() => {
          setAppState('home');
        }, 2000);
        return;
      }

      // Check if we should bypass QR scanner
      if (bypassQR) {
        // Development mode: create default tenant and save it
        const defaultTenant = cafeStorageService.createDefaultTenantFromConfig(config);
        await cafeStorageService.saveCurrentTenant(defaultTenant);
        
        const cafe = cafeStorageService.createCafeFromTenant(defaultTenant);
        console.log(`🚀 Bypass mode: loading ${cafe.name} with ${cafe.categories?.length || 0} categories`);
        setSelectedCafe(cafe);
        setAppState('splash');
        
        // Show splash for 2 seconds then go to home
        setTimeout(() => {
          setAppState('home');
        }, 2000);
        return;
      }

      // Production mode: show QR scanner
      setAppState('qr-scanner');
      
    } catch (error) {
      console.error('Error initializing app:', error);
      // Fallback to QR scanner
      setAppState('qr-scanner');
    }
  };

  const handleQRScan = async (cafeData: any) => {
    setIsValidating(true);
    
    try {
      // Validate cafe in our global network
      const validation = await cafeService.validateCafe(cafeData.cafeId);
      
      if (!validation.isValid) {
        Alert.alert(
          'Cafe Not Connected',
          'This cafe is not connected to our network. Please contact the cafe administrator.',
          [
            {
              text: 'Try Again',
              onPress: () => setAppState('qr-scanner'),
            },
          ]
        );
        return;
      }

      // Save full cafe data and tenant to storage
      await cafeStorageService.saveSelectedCafe(validation.cafe);
      
      const tenantData: TenantData = {
        id: validation.cafe.id,
        name: validation.cafe.name,
        logo: validation.cafe.logoUrl,
        apiEndpoint: validation.cafe.apiEndpoint
      };
      await cafeStorageService.saveCurrentTenant(tenantData);
      
      console.log(`💾 Saved cafe: ${validation.cafe.name} with ${validation.cafe.categories?.length || 0} categories`);

      setSelectedCafe(validation.cafe);
      setAppState('splash');
      
      // Show splash for 2 seconds then go to home
      setTimeout(() => {
        setAppState('home');
      }, 2000);
      
    } catch (error) {
      Alert.alert(
        'Connection Error',
        error instanceof Error ? error.message : 'Failed to connect to cafe',
        [
          {
            text: 'Try Again',
            onPress: () => setAppState('qr-scanner'),
          },
        ]
      );
    } finally {
      setIsValidating(false);
    }
  };

  const handleCloseQRScanner = () => {
    Alert.alert(
      'Exit Application',
      'Are you sure you want to exit?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Exit',
          style: 'destructive',
          onPress: () => {
            // In a real app, you might want to close the app
            setAppState('qr-scanner');
          },
        },
      ]
    );
  };

  const handleBackToScanner = async () => {
    // Clear saved data
    await cafeStorageService.clearSelectedCafe();
    await cafeStorageService.clearCurrentTenant();
    
    setSelectedCafe(null);
    // Reset onboarding and go back to it
    await OnboardingService.resetOnboarding();
    setAppState('onboarding');
  };

  const handleProfilePress = () => {
    setAppState('profile');
  };

  const handleOnboardingComplete = async () => {
    await OnboardingService.markOnboardingCompleted();
    setAppState('qr-scanner');
  };



  const renderQRScannerIntro = () => (
    <View style={styles.introContainer}>
      <View style={styles.introContent}>
        {/* Logo/Icon */}
        <View style={styles.logoContainer}>
          <Ionicons name="globe" size={isTablet ? 80 : 60} color="#666" />
        </View>
        
        {/* Title */}
        <Text style={styles.introTitle}>Welcome!</Text>
        <Text style={styles.introSubtitle}>Cafe and Restaurant Network</Text>
        
        {/* Description */}
        <Text style={styles.introDescription}>
          Scan the QR code on the table to access the menu and order dishes
        </Text>
        
        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Ionicons name="restaurant" size={24} color="#666" />
            <Text style={styles.featureText}>Fresh Menu</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="flash" size={24} color="#666" />
            <Text style={styles.featureText}>Quick Order</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="card" size={24} color="#666" />
            <Text style={styles.featureText}>Easy Payment</Text>
          </View>
        </View>
        
        {/* Scan Button */}
        <TouchableOpacity 
          style={styles.scanButton} 
          onPress={() => setAppState('qr-scanner')}
        >
          <Ionicons name="qr-code" size={24} color="#fff" />
          <Text style={styles.scanButtonText}>Scan QR Code</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.testButton} 
          onPress={() => setAppState('qr-test')}
        >
          <Ionicons name="flask" size={24} color="#666" />
          <Text style={styles.testButtonText}>Test QR Codes</Text>
        </TouchableOpacity>
        
        {/* Manual Entry Option */}
        <TouchableOpacity 
          style={styles.manualButton}
          onPress={() => {
                Alert.alert(
      'Manual Input',
      'Enter cafe ID manually for testing',
      [
        { text: 'Cancel', style: 'cancel' },
                {
                  text: 'AKAFE',
                  onPress: () => {
                    handleQRScan({
                      cafeId: 'demo_cafe_001',
                      cafeName: 'AKAFE',
                      location: 'Moscow, Arbat St. 1',
                      apiEndpoint: 'http://localhost:3000/api'
                    });
                  }
                },
                {
                  text: 'Coffee House',
                  onPress: () => {
                    handleQRScan({
                      cafeId: 'demo_cafe_002',
                      cafeName: 'Coffee House',
                      location: 'St. Petersburg, Nevsky Prospect 50',
                      apiEndpoint: 'http://localhost:3001/api'
                    });
                  }
                },
                {
                  text: 'Brew & Bean',
                  onPress: () => {
                    handleQRScan({
                      cafeId: 'demo_cafe_003',
                      cafeName: 'Brew & Bean',
                      location: 'Kazan, Bauman St. 15',
                      apiEndpoint: 'http://localhost:3002/api'
                    });
                  }
                }
              ]
            );
          }}
        >
          <Ionicons name="create" size={20} color="#666" />
          <Text style={styles.manualButtonText}>Enter Cafe ID Manually</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isValidating || appState === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#666" />
        <Text style={styles.loadingText}>
          {appState === 'loading' ? 'Loading...' : 'Connecting to cafe...'}
        </Text>
      </View>
    );
  }

  switch (appState) {
    case 'onboarding':
      return (
        <OnboardingView onComplete={handleOnboardingComplete} />
      );
    case 'qr-scanner':
      return (
        <QRScannerView 
          onCafeScanned={handleQRScan}
          onClose={async () => {
            await OnboardingService.resetOnboarding();
            setAppState('onboarding');
          }}
        />
      );
    
    case 'splash':
      return (
        <SplashScreen 
          cafe={selectedCafe}
          onFinish={(data) => {
            setPreloadedData(data);
            setAppState('home');
          }}
        />
      );
    
    case 'home':
      return (
        <HomeView 
          cafe={selectedCafe}
          onBackToScanner={handleBackToScanner}
          onProfilePress={handleProfilePress}
          preloadedData={preloadedData}
        />
      );

    case 'profile':
      return (
        <ProfileView 
          onBackPress={() => setAppState('home')}
        />
      );
    
    case 'qr-test':
      return (
        <QRTestPanel 
          onCafeSelected={handleQRScan}
          onClose={() => setAppState('qr-scanner')}
        />
      );
    
    default:
      return renderQRScannerIntro();
  }
};

const styles = StyleSheet.create({
  introContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  introContent: {
    alignItems: 'center',
    maxWidth: 400,
  },
  logoContainer: {
    width: isTablet ? 120 : 100,
    height: isTablet ? 120 : 100,
    borderRadius: 60,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  introTitle: {
    fontSize: isTablet ? 32 : 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  introSubtitle: {
    fontSize: isTablet ? 18 : 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  introDescription: {
    fontSize: isTablet ? 16 : 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    fontSize: isTablet ? 14 : 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#666',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
    marginBottom: 20,
  },
  testButtonText: {
    color: '#666',
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 10,
  },
  manualButtonText: {
    color: '#666',
    fontSize: isTablet ? 14 : 12,
    fontWeight: '500',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: isTablet ? 16 : 14,
    color: '#666',
    marginTop: 20,
  },
});
