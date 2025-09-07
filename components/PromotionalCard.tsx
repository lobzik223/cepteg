import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { PromotionalCard as PromotionalCardType } from '../types/AppConfig';
import { formatPrice } from '../utils/priceFormatter';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface PromotionalCardProps {
  card: PromotionalCardType;
  onPress?: () => void;
}

export default function PromotionalCard({ card, onPress }: PromotionalCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Default actions based on buttonAction
      switch (card.buttonAction) {
        case 'apply_discount':
          console.log('Applying discount:', card.discount);
          break;
        case 'navigate':
          console.log('Navigating to:', card.buttonLink);
          break;
        case 'external_link':
          console.log('Opening external link:', card.buttonLink);
          break;
        default:
          console.log('Promotional card pressed:', card.title);
      }
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: card.backgroundColor || '#F8F9FA',
        }
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {/* Cafe name badge */}
        <View style={styles.cafeBadge}>
          <Text style={styles.cafeName}>{card.cafeName}</Text>
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[
            styles.title,
            { color: card.textColor || '#4B5563' }
          ]}>
            {card.title}
          </Text>
          
          {card.description && (
            <Text style={[
              styles.description,
              { color: card.textColor || '#6B7280' }
            ]}>
              {card.description}
            </Text>
          )}
          
          {card.price && (
            <View style={styles.priceContainer}>
              <Ionicons 
                name="cafe-outline" 
                size={isTablet ? 20 : 16} 
                color={card.textColor || '#6B7280'} 
              />
              <Text style={[
                styles.price,
                { color: card.textColor || '#4B5563' }
              ]}>
                {formatPrice(card.price)}
              </Text>
            </View>
          )}
          
          {card.discount && (
            <Text style={[
              styles.discount,
              { color: card.textColor || '#EF4444' }
            ]}>
              {card.discountText || `-${card.discount}%`}
            </Text>
          )}
        </View>
        
        {card.buttonText && (
          <TouchableOpacity
            style={styles.button}
            onPress={handlePress}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>
              {card.buttonText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: isTablet ? 16 : 12,
    padding: isTablet ? 20 : 16,
    marginRight: isTablet ? 16 : 12,
    minWidth: isTablet ? 280 : 240,
    maxWidth: isTablet ? 320 : 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
    marginBottom: isTablet ? 16 : 12,
  },
  title: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
    marginBottom: isTablet ? 8 : 6,
    lineHeight: isTablet ? 24 : 22,
  },
  description: {
    fontSize: isTablet ? 16 : 14,
    marginBottom: isTablet ? 12 : 8,
    lineHeight: isTablet ? 22 : 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isTablet ? 8 : 6,
  },
  price: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '700',
    marginLeft: isTablet ? 8 : 6,
  },
  discount: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#4B5563',
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 12 : 10,
    borderRadius: isTablet ? 12 : 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
  },
  cafeBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: isTablet ? 12 : 8,
    paddingVertical: isTablet ? 6 : 4,
    borderRadius: isTablet ? 12 : 8,
    alignSelf: 'flex-start',
    marginBottom: isTablet ? 12 : 8,
  },
  cafeName: {
    fontSize: isTablet ? 12 : 10,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
