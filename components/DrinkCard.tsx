import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;
const isTablet = width >= 768;
const isLandscape = width > Dimensions.get('window').height;

// Responsive card width calculation
const getCardWidth = () => {
  if (isTablet) {
    if (isLandscape) {
      return (width - 120) / 4; // 4 cards per row in landscape with more spacing
    } else {
      return (width - 100) / 3; // 3 cards per row in portrait with more spacing
    }
  }
  return (width - 48) / 2; // 2 cards per row on phones
};

const cardWidth = getCardWidth();

export type BadgePosition = 'topLeft' | 'topRight' | 'none';

interface DrinkCardProps {
  id: string;
  name: string;
  price: string;
  badge?: string | null;
  badgePosition: BadgePosition;
  imageUrl?: string;
  onPress?: () => void;
  onAddToCart?: () => void;
}

export default function DrinkCard({
  id,
  name,
  price,
  badge,
  badgePosition,
  imageUrl,
  onPress,
  onAddToCart,
}: DrinkCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        {/* Product Image */}
        {imageUrl ? (
          <Image 
            source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl} 
            style={styles.productImage}
            resizeMode="cover"
            onError={() => {
              console.log('Image failed to load, showing placeholder');
            }}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="cafe" size={isTablet ? 80 : 50} color="#6B7280" />
          </View>
        )}
        
        {/* Badge */}
        {badge && badgePosition !== 'none' && (
          <View
            style={[
              styles.badge,
              badgePosition === 'topLeft' ? styles.badgeLeft : styles.badgeRight,
            ]}
          >
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>
          <View style={styles.descriptionContainer}>
            <Ionicons name="information-circle-outline" size={isTablet ? 16 : isSmallScreen ? 12 : 14} color="#9CA3AF" />
            <Text style={styles.description}>Tap for details</Text>
          </View>
        </View>
        
        <View style={styles.priceRow}>
          <View style={styles.priceContainer}>
            <Ionicons name="pricetag-outline" size={isTablet ? 18 : isSmallScreen ? 12 : 14} color="#6B7280" />
            <Text style={styles.price}>{price}</Text>
          </View>
          {onAddToCart && (
            <TouchableOpacity 
              style={styles.addToCartButton} 
              onPress={(e) => {
                e.stopPropagation();
                onAddToCart();
              }}
            >
              <Ionicons name="add" size={isTablet ? 24 : isSmallScreen ? 14 : 16} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    height: isTablet 
      ? (isLandscape ? 320 : 360) 
      : isSmallScreen ? 260 : 280,
    backgroundColor: '#fff',
    borderRadius: isTablet ? 24 : isSmallScreen ? 10 : 12,
    padding: isTablet ? 24 : isSmallScreen ? 10 : 14,
    marginBottom: isTablet ? 28 : isSmallScreen ? 12 : 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: isTablet ? 8 : isSmallScreen ? 1 : 2,
    },
    shadowOpacity: isTablet ? 0.15 : isSmallScreen ? 0.03 : 0.05,
    shadowRadius: isTablet ? 16 : isSmallScreen ? 2 : 4,
    elevation: isTablet ? 10 : isSmallScreen ? 1 : 2,
    borderWidth: isTablet ? 1 : 0,
    borderColor: isTablet ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: isTablet ? 20 : 16,
  },
  productImage: {
    height: isTablet 
      ? (isLandscape ? 140 : 180) 
      : isSmallScreen ? 100 : 120,
    width: '100%',
    borderRadius: isTablet ? 20 : isSmallScreen ? 8 : 12,
  },
  imagePlaceholder: {
    height: isTablet 
      ? (isLandscape ? 140 : 180) 
      : isSmallScreen ? 100 : 120,
    backgroundColor: 'rgba(128, 128, 128, 0.08)',
    borderRadius: isTablet ? 20 : isSmallScreen ? 8 : 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: isTablet ? 1 : 0,
    borderColor: isTablet ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
  },
  badge: {
    position: 'absolute',
    top: isTablet ? 12 : 8,
    paddingHorizontal: isTablet ? 12 : 8,
    paddingVertical: isTablet ? 6 : 4,
    backgroundColor: '#10B981',
    borderRadius: isTablet ? 12 : 8,
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeLeft: {
    left: 8,
  },
  badgeRight: {
    right: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: isTablet ? 14 : 12,
    fontWeight: '700',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: isTablet ? 20 : isSmallScreen ? 14 : 16,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: isTablet ? 28 : isSmallScreen ? 18 : 22,
    marginBottom: isTablet ? 8 : isSmallScreen ? 4 : 6,
    marginTop: isTablet ? 8 : isSmallScreen ? 2 : 4,
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isTablet ? 0 : 0,
  },
  description: {
    fontSize: isTablet ? 14 : isSmallScreen ? 10 : 12,
    color: '#9CA3AF',
    marginLeft: isTablet ? 6 : isSmallScreen ? 3 : 4,
    fontStyle: 'italic',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: isTablet ? -20 : -15,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginTop: isTablet ? -25 : -22,
  },
  price: {
    fontSize: isTablet ? 22 : isSmallScreen ? 16 : 18,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: isTablet ? 8 : isSmallScreen ? 4 : 6,
  },
  addToCartButton: {
    padding: isTablet ? 12 : isSmallScreen ? 6 : 8,
    marginHorizontal: isTablet ? 8 : isSmallScreen ? 4 : 6,
    marginTop: isTablet ? -35 : isSmallScreen ? -20 : -25,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    borderRadius: isTablet ? 24 : isSmallScreen ? 16 : 20,
    width: isTablet ? 48 : isSmallScreen ? 32 : 40,
    height: isTablet ? 48 : isSmallScreen ? 32 : 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(107, 114, 128, 0.2)',
  },
});
