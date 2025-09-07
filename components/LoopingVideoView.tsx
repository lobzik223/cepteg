import { ResizeMode, Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;
const isLargeScreen = width > 414;
const isTablet = width >= 768;
const isLandscape = width > height;

export default function LoopingVideoView() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  return (
    <View style={styles.container}>
      {/* Fallback background - always show */}
      <LinearGradient
        colors={['#E8F4FD', '#D1E7DD', '#C3E9C0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fallbackBackground}
      />
      
      {/* Video - only show if loaded successfully */}
      {!videoError && (
        <Video
          style={[styles.video, { opacity: videoLoaded ? 1 : 0 }]}
          source={require('../assets/coffee_video.mp4')}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          isMuted
          useNativeControls={false}
          onError={(error) => {
            console.log('Video error:', error);
            setVideoError(true);
          }}
          onLoad={() => {
            console.log('Video loaded successfully');
            setVideoLoaded(true);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: isTablet 
      ? (isLandscape ? width + 1000 : width + 900) 
      : width + 400, // Increase width for offset
    height: '100%',
    overflow: 'hidden',
    marginLeft: isTablet 
      ? (isLandscape ? -200 : -150) 
      : -300, // Shift left to show the glass
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
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
