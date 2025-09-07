import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function VideoPlayerFallback() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#E8F4FD', '#D1E7DD', '#C3E9C0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      >
        {/* Decorative elements */}
        <View style={styles.coffeeElements}>
                      {/* Coffee beans */}
          <View style={[styles.coffeeBean, { top: 80, left: 40, transform: [{ rotate: '25deg' }] }]} />
          <View style={[styles.coffeeBean, { top: 150, right: 50, transform: [{ rotate: '-15deg' }] }]} />
          <View style={[styles.coffeeBean, { top: 250, left: 60, transform: [{ rotate: '45deg' }] }]} />
          <View style={[styles.coffeeBean, { top: 350, right: 80, transform: [{ rotate: '60deg' }] }]} />
          <View style={[styles.coffeeBean, { top: 450, left: 100, transform: [{ rotate: '-30deg' }] }]} />
          
                      {/* Central composition */}
          <View style={styles.centerContainer}>
            <View style={styles.mainCoffeeContainer}>
                              {/* Large cup */}
              <View style={styles.mainCoffee}>
                <View style={styles.coffeeHandle} />
                <View style={styles.coffeeSurface} />
              </View>
              
                              {/* Steam */}
              <View style={styles.steamContainer}>
                <View style={[styles.steam, { left: 15, animationDelay: 0 }]} />
                <View style={[styles.steam, { left: 25, animationDelay: 0.5 }]} />
                <View style={[styles.steam, { left: 35, animationDelay: 1 }]} />
              </View>
              
              {/* Text */}
              <Text style={styles.coffeeText}>☕ Coffee Experience</Text>
            </View>
          </View>
          
                      {/* Additional elements */}
          <View style={[styles.smallCup, { bottom: 120, left: 40 }]} />
          <View style={[styles.smallCup, { bottom: 180, right: 30 }]} />
        </View>
      </LinearGradient>
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
    flex: 1,
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
    width: 16,
    height: 10,
    backgroundColor: 'rgba(101, 67, 33, 0.4)',
    borderRadius: 8,
  },
  centerContainer: {
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: [{ translateX: -60 }, { translateY: -60 }],
  },
  mainCoffeeContainer: {
    alignItems: 'center',
  },
  mainCoffee: {
    width: 100,
    height: 75,
    backgroundColor: 'rgba(101, 67, 33, 0.9)',
    borderRadius: 15,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  coffeeHandle: {
    position: 'absolute',
    right: -20,
    top: 20,
    width: 15,
    height: 35,
    borderWidth: 4,
    borderColor: 'rgba(101, 67, 33, 0.9)',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  coffeeSurface: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    height: 12,
    backgroundColor: 'rgba(139, 69, 19, 0.8)',
    borderRadius: 6,
  },
  steamContainer: {
    position: 'relative',
    width: 100,
    height: 30,
    marginTop: -10,
  },
  steam: {
    position: 'absolute',
    width: 4,
    height: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 2,
    top: 0,
  },
  coffeeText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(101, 67, 33, 0.8)',
    textAlign: 'center',
  },
  smallCup: {
    position: 'absolute',
    width: 40,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});
