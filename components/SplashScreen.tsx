import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { Cafe } from '../services/CafeService';
import { dataPreloadService, PreloadProgress } from '../services/DataPreloadService';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

interface SplashScreenProps {
  onFinish: (preloadedData?: any) => void;
  cafe?: Cafe | null;
}

export default function SplashScreen({ onFinish, cafe }: SplashScreenProps) {
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  const progressOpacity = useSharedValue(0);
  const [loadingProgress, setLoadingProgress] = useState<PreloadProgress>({
    stage: 'video',
    progress: 0,
    message: 'Initializing...',
  });
  const [preloadedData, setPreloadedData] = useState<any>(null);

  useEffect(() => {
    // Start logo animation
    logoScale.value = withTiming(1.0, { duration: 1000 });
    logoOpacity.value = withTiming(1.0, { duration: 1000 });

    // Start data preloading
    preloadData();
  }, []);

  const preloadData = async () => {
    try {
      if (cafe) {
        // Preload real cafe data
        const result = await dataPreloadService.preloadCafeData(cafe, (progress) => {
          setLoadingProgress(progress);
          progressOpacity.value = withTiming(1.0, { duration: 300 });
        });

        if (result.success && result.data) {
          setPreloadedData(result.data);
        }
      } else {
        // Preload demo data for the selected cafe
        const cafeId = cafe?.id || 'demo_cafe_002';
        const result = await dataPreloadService.preloadDemoData(cafeId, (progress) => {
          setLoadingProgress(progress);
          progressOpacity.value = withTiming(1.0, { duration: 300 });
        });

        if (result.success && result.data) {
          setPreloadedData(result.data);
        }
      }

      // Wait a bit more for smooth transition
      setTimeout(() => {
        logoOpacity.value = withTiming(0, { duration: 500 }, () => {
          runOnJS(onFinish)(preloadedData);
        });
      }, 1000);
    } catch (error) {
      console.error('Error preloading data:', error);
      // Still finish loading even if preload fails
      setTimeout(() => {
        logoOpacity.value = withTiming(0, { duration: 500 }, () => {
          runOnJS(onFinish)();
        });
      }, 1000);
    }
  };

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progressOpacity.value,
  }));

  return (
    <LinearGradient
      colors={['#059669', '#10B981', '#34D399']} // Deep green to bright green gradient
      style={styles.container}
    >
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        {cafe?.logoUrl ? (
          <View style={styles.logoImageContainer}>
            <Ionicons 
              name="cafe" 
              size={isTablet ? 100 : 80} 
              color="white" 
              style={styles.logoShadow}
            />
          </View>
        ) : (
          <Ionicons 
            name="cafe" 
            size={isTablet ? 100 : 80} 
            color="white" 
            style={styles.logoShadow}
          />
        )}
        {cafe?.name && (
          <Text style={styles.cafeName}>{cafe.name}</Text>
        )}
        {cafe?.location && (
          <Text style={styles.cafeLocation}>{cafe.location}</Text>
        )}
      </Animated.View>

      {/* Loading Progress */}
      <Animated.View style={[styles.progressContainer, progressAnimatedStyle]}>
        <Text style={styles.progressStage}>
          {dataPreloadService.getStageDisplayName(loadingProgress.stage)}
        </Text>
        <Text style={styles.progressMessage}>
          {loadingProgress.message}
        </Text>
        
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${loadingProgress.progress}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressPercentage}>
            {loadingProgress.progress}%
          </Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width,
    height,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  cafeName: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cafeLocation: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  logoImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    position: 'absolute',
    bottom: isTablet ? 100 : 80,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  progressStage: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressMessage: {
    fontSize: isTablet ? 14 : 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressBarContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBarBackground: {
    width: '100%',
    height: isTablet ? 8 : 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: isTablet ? 4 : 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: isTablet ? 4 : 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  progressPercentage: {
    fontSize: isTablet ? 14 : 12,
    fontWeight: '600',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
