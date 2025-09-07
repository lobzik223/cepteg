import { ResizeMode, Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function VideoPlayer() {
  return (
    <View style={styles.container}>
      {/* Beautiful background with coffee theme */}
      <LinearGradient
        colors={['#E8F4FD', '#D1E7DD', '#C3E9C0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      >
        {/* Decorative elements to simulate coffee theme */}
        <View style={styles.coffeeElements}>
          <View style={[styles.coffeeBean, { top: 100, left: 50 }]} />
          <View style={[styles.coffeeBean, { top: 200, right: 60 }]} />
          <View style={[styles.coffeeBean, { top: 300, left: 80 }]} />
          <View style={[styles.coffeeCup, { bottom: 150, right: 50 }]} />
          
          {/* Central coffee cup */}
          <View style={styles.centerCoffeeContainer}>
            <View style={styles.centerCoffee}>
              <View style={styles.coffeeHandle} />
              <View style={styles.steam} />
            </View>
          </View>
        </View>
      </LinearGradient>

              {/* Try simple video without complex logic */}
      <Video
        style={styles.video}
        source={require('../assets/videos/coffee_video.mp4')}
        resizeMode={ResizeMode.COVER}
        shouldPlay={true}
        isLooping={true}
        isMuted={true}
        useNativeControls={false}
      />
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
  coffeeCup: {
    position: 'absolute',
    width: 60,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  centerCoffeeContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -40 }, { translateY: -40 }],
  },
  centerCoffee: {
    width: 80,
    height: 60,
    backgroundColor: 'rgba(139, 69, 19, 0.8)',
    borderRadius: 12,
    position: 'relative',
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
});
