import { ResizeMode, Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Cafe } from '../services/CafeService';
import { cafeVideoService } from '../services/CafeVideoService';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;
const isLargeScreen = width > 414;
const isTablet = width >= 768;
const isLandscape = width > height;

interface CafeVideoViewProps {
  cafe: Cafe | null;
}

export default function CafeVideoView({ cafe }: CafeVideoViewProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Get video configuration from cafe
  const videoConfig = cafe?.videoConfig;
  const fallbackColors = videoConfig?.fallbackColors || ['#E8F4FD', '#D1E7DD', '#C3E9C0'];
  const videoPosition = videoConfig?.videoPosition || 'center';

  // Determine video source
  const getVideoSource = () => {
    if (!videoConfig) {
      // Default video for cafes without config
      return require('../assets/coffee_video.mp4');
    }

    if (videoConfig.videoUrl) {
      // Server video URL
      return { uri: videoConfig.videoUrl };
    }

    if (videoConfig.localVideoPath) {
      // Local video path for demo cafes - use static mapping
      const videoMap: Record<string, any> = {
        'coffee_video.mp4': require('../assets/coffee_video.mp4'),
        'coffee_house_video.mp4': require('../assets/coffee_house_video.mp4'),
        'brew_bean_video.mp4': require('../assets/brew_bean_video.mp4'),
      };

      const videoSource = videoMap[videoConfig.localVideoPath];
      if (videoSource) {
        return videoSource;
      } else {
        console.warn(`Video not found: ${videoConfig.localVideoPath}, using default`);
        return require('../assets/coffee_video.mp4');
      }
    }

    // Fallback to default video
    return require('../assets/coffee_video.mp4');
  };

  const videoSource = getVideoSource();

  // Get container styles based on video position using service
  const getContainerStyles = () => {
    const positionStyle = cafeVideoService.getVideoPositionStyle(
      videoPosition,
      isTablet,
      isLandscape,
      width,
      height
    );

    return {
      ...positionStyle,
      height: '100%',
      overflow: 'hidden' as const,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    };
  };

  return (
    <View style={getContainerStyles()}>
      {/* Fallback background with cafe-specific colors */}
      <LinearGradient
        colors={fallbackColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fallbackBackground}
      />
      
      {/* Video - only show if loaded successfully */}
      {!videoError && (
        <Video
          style={[styles.video, { opacity: videoLoaded ? 1 : 0 }]}
          source={videoSource}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          isMuted
          useNativeControls={false}
          onError={(error) => {
            console.log(`Video error for ${cafe?.name}:`, error);
            setVideoError(true);
          }}
          onLoad={() => {
            console.log(`Video loaded successfully for ${cafe?.name}`);
            setVideoLoaded(true);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fallbackBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});
