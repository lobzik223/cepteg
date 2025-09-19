import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PromoCodeImage } from '../data/demoPromoCodes';
import { usePromoCodes } from '../hooks/usePromoCodes';

interface PromoCodesSectionProps {
  cafeId: string;
  onPromoCodeImagePress?: (image: PromoCodeImage) => void;
}

const { width } = Dimensions.get('window');
const isTablet = width >= 768;


// High quality image component
const HighQualityImage: React.FC<{ source: any; style: any }> = ({ source, style }) => {
  return (
    <Image
      source={source}
      style={style}
      resizeMode="cover"
      fadeDuration={0}
    />
  );
};

export const PromoCodesSection: React.FC<PromoCodesSectionProps> = ({
  cafeId,
  onPromoCodeImagePress,
}) => {
  const { promoCodeImages, loading, error } = usePromoCodes(cafeId);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Debug logging
  console.log('PromoCodesSection - cafeId:', cafeId);
  console.log('PromoCodesSection - promoCodeImages:', promoCodeImages);
  console.log('PromoCodesSection - loading:', loading);
  console.log('PromoCodesSection - error:', error);

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

  if (promoCodeImages.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="pricetag-outline" size={isTablet ? 32 : 24} color="#9CA3AF" />
        <Text style={styles.emptyText}>No available promo codes</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <FlatList
        data={promoCodeImages}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        snapToInterval={width - (isTablet ? 20 : 16)} // Полная ширина экрана минус отступы
        snapToAlignment="start"
        decelerationRate="fast"
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        onScroll={(event) => {
          const slideWidth = width - (isTablet ? 20 : 16);
          const slideIndex = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
          setCurrentSlide(Math.max(0, Math.min(slideIndex, promoCodeImages.length - 1)));
        }}
        onMomentumScrollEnd={(event) => {
          const slideWidth = width - (isTablet ? 20 : 16);
          const slideIndex = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
          setCurrentSlide(Math.max(0, Math.min(slideIndex, promoCodeImages.length - 1)));
        }}
        renderItem={({ item: promoImage }) => (
          <TouchableOpacity
            style={styles.imageCard}
            onPress={() => onPromoCodeImagePress?.(promoImage)}
          >
            <HighQualityImage
              source={promoImage.imageUrl}
              style={styles.promoImage}
            />
          </TouchableOpacity>
        )}
      />

      {/* Индикаторы слайдера */}
      {promoCodeImages.length > 1 && (
        <View style={styles.sliderIndicators}>
          {promoCodeImages.map((item, index) => (
            <View
              key={`indicator-${item.id}`}
              style={[
                styles.indicator,
                currentSlide === index && styles.activeIndicator
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: isTablet ? 20 : 16,
    paddingHorizontal: isTablet ? 20 : 16,
  },
  scrollView: {
    marginLeft: -(isTablet ? 20 : 16), // Компенсируем padding контейнера
  },
  scrollContent: {
    paddingHorizontal: isTablet ? 20 : 16,
  },
  imageCard: {
    width: width - (isTablet ? 40 : 32), // Полная ширина экрана минус отступы
    height: isTablet ? 280 : 240,
    marginRight: isTablet ? 20 : 16,
    borderRadius: isTablet ? 22 : 18,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  promoImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5', // Фон на случай загрузки
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
  sliderIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: isTablet ? 16 : 12,
    paddingHorizontal: isTablet ? 20 : 16,
  },
  indicator: {
    width: isTablet ? 8 : 6,
    height: isTablet ? 8 : 6,
    borderRadius: isTablet ? 4 : 3,
    backgroundColor: '#D1D5DB',
    marginHorizontal: isTablet ? 6 : 4,
    opacity: 0.5,
  },
  activeIndicator: {
    backgroundColor: '#376138',
    opacity: 1,
    transform: [{ scale: 1.3 }],
    width: isTablet ? 10 : 8,
    height: isTablet ? 10 : 8,
    borderRadius: isTablet ? 5 : 4,
  },
});