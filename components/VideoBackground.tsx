import { ResizeMode, Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface VideoBackgroundProps {
  readonly videoSource: any;
  readonly children?: React.ReactNode;
  readonly style?: any;
  readonly fallbackColors?: string[];
}

export default function VideoBackground({ 
  videoSource, 
  children, 
  style,
  fallbackColors = ['#F8FAFC', '#E5E7EB']
}: VideoBackgroundProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<Video>(null);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
    setHasError(false);
  };

  const handleVideoError = (error: any) => {
    console.warn('Video failed to load:', error);
    setHasError(true);
    setIsVideoLoaded(false);
  };

  return (
    <View style={[styles.container, style]}>
      {!hasError ? (
        <Video
          ref={videoRef}
          source={videoSource}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          isMuted
          onLoad={handleVideoLoad}
          onError={handleVideoError}
        />
      ) : null}
      
      {/* Fallback gradient if video fails or isn't loaded yet */}
      {(!isVideoLoaded || hasError) && (
        <LinearGradient
          colors={fallbackColors}
          style={styles.fallbackGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )}
      
      {/* Overlay for better text readability */}
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.05)']}
        style={styles.overlay}
      />
      
      {/* Content */}
      {children && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  video: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '110%',
  },
  fallbackGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    position: 'relative',
    zIndex: 1,
    flex: 1,
  },
});