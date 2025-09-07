import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { usePromoCodes } from '../hooks/usePromoCodes';
import { PromoCodeCard } from './PromoCodeCard';

interface PromoCodesSectionProps {
  cafeId: string;
  onPromoCodePress?: (promoCode: any) => void;
  onPromoCodeApply?: (promoCode: any) => void;
}

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;
const isTablet = width >= 768;

export const PromoCodesSection: React.FC<PromoCodesSectionProps> = ({
  cafeId,
  onPromoCodePress,
  onPromoCodeApply,
}) => {
  const { promoCodes, loading, error } = usePromoCodes(cafeId);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#6B7280" />
        <Text style={styles.loadingText}>Loading promo codes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={isTablet ? 24 : 20} color="#EF4444" />
        <Text style={styles.errorText}>Failed to load promo codes</Text>
      </View>
    );
  }

  if (promoCodes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="pricetag-outline" size={isTablet ? 32 : 24} color="#9CA3AF" />
        <Text style={styles.emptyText}>No available promo codes</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="pricetag-outline" size={isTablet ? 20 : 18} color="#6B7280" />
          <Text style={styles.title}>Promo Codes & Offers</Text>
        </View>
        <Text style={styles.subtitle}>
          {promoCodes.length} {promoCodes.length === 1 ? 'offer' : 'offers'}
        </Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {promoCodes.map((promoCode) => (
          <PromoCodeCard
            key={promoCode.id}
            promoCode={promoCode}
            onPress={() => onPromoCodePress?.(promoCode)}
            onApply={() => onPromoCodeApply?.(promoCode)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: isTablet ? 20 : 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isTablet ? 16 : 12,
    paddingHorizontal: isTablet ? 20 : 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: isTablet ? 28 : isSmallScreen ? 20 : 22,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: isTablet ? 8 : 6,
  },
  subtitle: {
    fontSize: isTablet ? 14 : 12,
    color: '#6B7280',
  },
  scrollView: {
    marginLeft: isTablet ? 8 : 4,
  },
  scrollContent: {
    paddingRight: isTablet ? 20 : 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isTablet ? 40 : 30,
  },
  loadingText: {
    fontSize: isTablet ? 16 : 14,
    color: '#6B7280',
    marginLeft: isTablet ? 12 : 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isTablet ? 40 : 30,
  },
  errorText: {
    fontSize: isTablet ? 16 : 14,
    color: '#EF4444',
    marginLeft: isTablet ? 12 : 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isTablet ? 40 : 30,
  },
  emptyText: {
    fontSize: isTablet ? 16 : 14,
    color: '#9CA3AF',
    marginTop: isTablet ? 12 : 8,
  },
});
