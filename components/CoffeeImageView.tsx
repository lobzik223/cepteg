import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function CoffeeImageView() {
  return (
    <View style={styles.container}>
      {/* Simple beautiful coffee photo */}
      <View style={styles.imageContainer}>
        {/* Main coffee cup */}
        <View style={styles.coffeeCup}>
          <View style={styles.cupBody} />
          <View style={styles.cupHandle} />
        </View>
        
        {/* Decorative spheres */}
        <View style={styles.spheres}>
          <View style={styles.whiteSphere} />
          <View style={styles.silverSphere} />
          <View style={styles.greenSphere} />
        </View>
        
        {/* Indicator dots */}
        <View style={styles.dots}>
          <View style={styles.dot1} />
          <View style={styles.dot2} />
          <View style={styles.dot3} />
        </View>
      </View>
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
    backgroundColor: '#F5F5DC', // Beige background
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  coffeeCup: {
    position: 'relative',
    width: 100,
    height: 80,
  },
  cupBody: {
    width: 80,
    height: 60,
    backgroundColor: '#8B4513',
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#654321',
  },
  cupHandle: {
    position: 'absolute',
    right: -15,
    top: 15,
    width: 12,
    height: 30,
    borderWidth: 3,
    borderColor: '#654321',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  spheres: {
    position: 'absolute',
    bottom: 120,
    flexDirection: 'row',
    gap: 20,
  },
  whiteSphere: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  silverSphere: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(192, 192, 192, 0.8)',
  },
  greenSphere: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(34, 139, 34, 0.7)',
  },
  dots: {
    position: 'absolute',
    bottom: 80,
    flexDirection: 'row',
    gap: 8,
  },
  dot1: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  dot2: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCCCCC',
  },
  dot3: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
});
