import { ResizeMode, Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function VideoBackground() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  return (
    <View style={styles.container}>
      {/* Beautiful background - always show */}
      <LinearGradient
        colors={['#E8F4FD', '#D1E7DD', '#C3E9C0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      >
        {/* Decorative elements */}
        <View style={styles.coffeeElements}>
          <View style={[styles.coffeeBean, { top: 100, left: 50 }]} />
          <View style={[styles.coffeeBean, { top: 200, right: 60 }]} />
          <View style={[styles.coffeeBean, { top: 300, left: 80 }]} />
          <View style={[styles.coffeeBean, { top: 400, right: 40 }]} />
          
          {/* Central cup */}
          <View style={styles.centerCoffee}>
            <View style={styles.coffeeHandle} />
            <View style={styles.steam} />
          </View>
        </View>
      </LinearGradient>

      {/* Video over background - if it loads */}
      {!videoError && (
        <Video
          style={[styles.video, { opacity: videoLoaded ? 1 : 0 }]}
          source={require('../assets/coffee_video.mp4')}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          isMuted
          useNativeControls={false}
          onLoad={() => {
            console.log('Video loaded successfully');
            setVideoLoaded(true);
          }}
          onError={(error) => {
            console.log('Video error:', error);
            setVideoError(true);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: 600,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: -16,
    marginTop: -100,
    position: 'relative',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  coffeeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  coffeeBean: {
    position: 'absolute',
    width: 20,
    height: 12,
    backgroundColor: 'rgba(139, 69, 19, 0.3)',
    borderRadius: 10,
    transform: [{ rotate: '45deg' }],
  },
  centerCoffee: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 80,
    height: 60,
    backgroundColor: 'rgba(139, 69, 19, 0.8)',
    borderRadius: 12,
    transform: [{ translateX: -40 }, { translateY: -30 }],
  },
  coffeeHandle: {
    position: 'absolute',
    right: -15,
    top: 15,
    width: 12,
    height: 30,
    borderWidth: 3,
    borderColor: 'rgba(139, 69, 19, 0.8)',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  steam: {
    position: 'absolute',
    top: -10,
    left: 20,
    width: 40,
    height: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 8,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});
