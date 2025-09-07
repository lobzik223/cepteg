import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PromoCode } from '../types/PromoCode';

interface PromoCodeCardProps {
  promoCode: PromoCode;
  onPress?: () => void;
  onApply?: () => void;
}

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export const PromoCodeCard: React.FC<PromoCodeCardProps> = ({ 
  promoCode, 
  onPress, 
  onApply 
}) => {
  const formatDiscount = () => {
    switch (promoCode.discountType) {
      case 'percentage':
        return `-${promoCode.discountValue}%`;
      case 'fixed':
        return `-₺${promoCode.discountValue / 100}`;
      case 'free_drink':
        return 'FREE';
      default:
        return '';
    }
  };


  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {promoCode.title}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {promoCode.description}
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.discountContainer}>
            <Text style={styles.discountText}>
              {formatDiscount()}
            </Text>
          </View>
          
          {promoCode.discountType !== 'free_drink' && onApply && (
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={(e) => {
                e.stopPropagation();
                onApply();
              }}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: isTablet ? 20 : 16,
    marginHorizontal: isTablet ? 16 : 12,
    marginVertical: isTablet ? 12 : 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: isTablet ? 320 : 280,
    minHeight: isTablet ? 160 : 140,
  },
  content: {
    padding: isTablet ? 24 : 20,
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: isTablet ? 20 : 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: isTablet ? 22 : 20,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: isTablet ? 28 : 24,
    marginBottom: isTablet ? 8 : 6,
  },
  description: {
    fontSize: isTablet ? 16 : 14,
    color: '#6B7280',
    lineHeight: isTablet ? 22 : 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discountContainer: {
    flex: 1,
  },
  discountText: {
    fontSize: isTablet ? 24 : 22,
    fontWeight: '700',
    color: '#1F2937',
  },
  applyButton: {
    backgroundColor: '#374151',
    paddingHorizontal: isTablet ? 24 : 20,
    paddingVertical: isTablet ? 14 : 12,
    borderRadius: isTablet ? 10 : 8,
    marginLeft: isTablet ? 16 : 12,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
  },
});
