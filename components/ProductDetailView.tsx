import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Product } from '../types/Product';
import { formatPrice } from '../utils/priceFormatter';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallScreen = width < 375;

interface ProductDetailViewProps {
  visible: boolean;
  product: Product;
  onClose: () => void;
  onAddToCart?: (product: Product, quantity: number, customizations?: any) => void;
}

export default function ProductDetailView({ 
  visible, 
  product, 
  onClose, 
  onAddToCart 
}: ProductDetailViewProps) {
  const [selectedSize, setSelectedSize] = useState<string>('medium');
  const [quantity, setQuantity] = useState(1);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Получаем цену напрямую из карточки товара
  const getPrice = () => {
    // Берем цену напрямую из product.price (уже финальная цена с API/демо)
    return product.price;
  };

  // Получаем объем для выбранного размера из API
  const getVolume = () => {
    const selectedSizeData = product.customizationOptions?.sizes?.find(
      size => size.id === selectedSize
    );
    return selectedSizeData?.volume || '350 мл';
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, quantity, { size: selectedSize });
    }
    onClose();
  };

  const renderImageSection = () => {
    // Проверяем, является ли imageUrl строкой (для видео URL)
    const isVideoUrl = typeof product.imageUrl === 'string' && product.imageUrl.includes('.mp4');
    
    // Если есть видео URL, показываем видео
    if (isVideoUrl) {
      return (
        <View style={styles.imageContainer}>
          <Video
            style={styles.productImage}
            source={{ uri: product.imageUrl }}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            isMuted
            useNativeControls={false}
            onError={(error) => {
              console.error('Video error:', error);
              setVideoError(true);
            }}
            onLoad={() => {
              console.log('Video loaded successfully');
              setVideoLoaded(true);
            }}
          />
          {!videoLoaded && !videoError && (
            <View style={styles.imagePlaceholder}>
              <ActivityIndicator size="large" color="#666" />
              <Text style={styles.imagePlaceholderText}>Loading...</Text>
            </View>
          )}
        </View>
      );
    }

    // Показываем изображение товара
    return (
      <View style={styles.imageContainer}>
        {product.imageUrl ? (
          <Image 
            source={product.imageUrl} 
            style={styles.productImage}
            resizeMode="cover"
            onError={() => {
              console.log('Image failed to load, showing placeholder');
            }}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="cafe" size={isTablet ? 120 : 80} color="#6B7280" />
          </View>
        )}
      </View>
    );
  };

  const renderNutritionalInfo = () => {
    if (!product.nutritionalInfo) return null;

    return (
      <View style={styles.nutritionalCard}>
        <View style={styles.nutritionalRow}>
          <Text style={styles.nutritionalLabel}>Energy</Text>
          <Text style={styles.nutritionalValue}>{product.nutritionalInfo.energy} kcal</Text>
        </View>
        <View style={styles.nutritionalRow}>
          <Text style={styles.nutritionalLabel}>Proteins</Text>
          <Text style={styles.nutritionalValue}>{product.nutritionalInfo.proteins} g</Text>
        </View>
        <View style={styles.nutritionalRow}>
          <Text style={styles.nutritionalLabel}>Fats</Text>
          <Text style={styles.nutritionalValue}>{product.nutritionalInfo.fats} g</Text>
        </View>
        <View style={styles.nutritionalRow}>
          <Text style={styles.nutritionalLabel}>Carbs</Text>
          <Text style={styles.nutritionalValue}>{product.nutritionalInfo.carbs} g</Text>
        </View>
        <TouchableOpacity style={styles.ingredientsButton}>
          <Text style={styles.ingredientsText}>Ingredients</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCustomizationOptions = () => {
    if (!product.customizationOptions) return null;

    return (
      <View style={styles.customizationSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.customizationScroll}>
          {product.customizationOptions.milkTypes?.map((milk) => (
            <TouchableOpacity key={milk.id} style={styles.customizationOption}>
              <View style={styles.optionIcon}>
                {milk.imageUrl ? (
                  <Image source={{ uri: milk.imageUrl }} style={styles.optionImage} />
                ) : (
                  <Ionicons name="cafe" size={32} color="#6B7280" />
                )}
              </View>
              <Text style={styles.optionText}>{milk.name}</Text>
            </TouchableOpacity>
          ))}
          {product.customizationOptions.temperatures?.map((temp) => (
            <TouchableOpacity key={temp.id} style={styles.customizationOption}>
              <View style={styles.optionIcon}>
                {temp.imageUrl ? (
                  <Image source={{ uri: temp.imageUrl }} style={styles.optionImage} />
                ) : (
                  <Ionicons name="thermometer" size={32} color="#6B7280" />
                )}
              </View>
              <Text style={styles.optionText}>{temp.name}</Text>
            </TouchableOpacity>
          ))}
          {product.customizationOptions.addOns?.map((addon) => (
            <TouchableOpacity key={addon.id} style={styles.customizationOption}>
              <View style={styles.optionIcon}>
                {addon.imageUrl ? (
                  <Image source={{ uri: addon.imageUrl }} style={styles.optionImage} />
                ) : (
                  <Ionicons name="add-circle" size={32} color="#6B7280" />
                )}
              </View>
              <Text style={styles.optionText}>{addon.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderSuggestedPairings = () => {
    if (!product.relatedProducts || product.relatedProducts.length === 0) return null;

    return (
      <View style={styles.suggestedSection}>
        <Text style={styles.sectionTitle}>Better together</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestedScroll}>
          {product.relatedProducts.map((relatedProduct) => (
            <TouchableOpacity key={relatedProduct.id} style={styles.suggestedCard}>
              <View style={styles.suggestedImage}>
                {relatedProduct.imageUrl ? (
                  <Image source={{ uri: relatedProduct.imageUrl }} style={styles.suggestedProductImage} />
                ) : (
                  <Ionicons name="restaurant" size={40} color="#6B7280" />
                )}
              </View>
              <Text style={styles.suggestedName}>{relatedProduct.name}</Text>
              <Text style={styles.suggestedPrice}>{formatPrice(relatedProduct.price)}</Text>
              <TouchableOpacity style={styles.suggestedAddButton}>
                <Ionicons name="add" size={16} color="#666" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderSizeSelection = () => {
    if (!product.customizationOptions?.sizes) return null;

    return (
      <View style={styles.sizeSelection}>
        {product.customizationOptions.sizes.map((size) => (
          <TouchableOpacity
            key={size.id}
            style={[
              styles.sizeButton,
              selectedSize === size.id && styles.sizeButtonSelected
            ]}
            onPress={() => setSelectedSize(size.id)}
          >
            <Text style={[
              styles.sizeText,
              selectedSize === size.id && styles.sizeTextSelected
            ]}>
              {size.label.charAt(0).toUpperCase()}
            </Text>
            {selectedSize === size.id && (
              <Text style={styles.sizeVolume}>{size.volume}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Close Button - Floating */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>

        {/* Scrollable Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Product Image Section */}
          {renderImageSection()}
          {/* Product Title and Tagline */}
          <View style={styles.titleSection}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.tagline}>Customize as you like</Text>
          </View>

          {/* Customization Options */}
          {renderCustomizationOptions()}

          {/* Nutritional Info Card */}
          {renderNutritionalInfo()}

          {/* Product Description */}
          <View style={styles.descriptionCard}>
            <Text style={styles.productDescription}>
              {product.description || 'Classic coffee drink with balanced taste and aroma.'}
            </Text>
            <Text style={styles.prepareText}>How we make {product.name}</Text>
          </View>

          {/* Suggested Pairings */}
          {renderSuggestedPairings()}
        </ScrollView>

        {/* Bottom Action Bar */}
        <View style={styles.bottomBar}>
          <View style={styles.bottomLeft}>
            {renderSizeSelection()}
          </View>
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Text style={styles.addToCartText}>+ {formatPrice(product.price)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleSection: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  nutritionalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  nutritionalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nutritionalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  nutritionalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  ingredientsButton: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  ingredientsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  descriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  productName: {
    fontSize: isTablet ? 28 : 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
  prepareText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  imageContainer: {
    height: isTablet ? 450 : 400,
    backgroundColor: '#f0f0f0',
    marginTop: 0,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  imagePlaceholderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  customizationSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  customizationScroll: {
    flexDirection: 'row',
  },
  customizationOption: {
    alignItems: 'center',
    marginRight: 20,
    minWidth: 100,
  },
  optionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  optionEmoji: {
    fontSize: 32,
  },
  optionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  optionImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  suggestedSection: {
    marginBottom: 20,
  },
  suggestedScroll: {
    flexDirection: 'row',
  },
  suggestedCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  suggestedImage: {
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  suggestedName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  suggestedPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  suggestedAddButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  suggestedProductImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  bottomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sizeSelection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sizeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sizeButtonSelected: {
    backgroundColor: '#333',
  },
  sizeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  sizeTextSelected: {
    color: '#fff',
  },
  sizeVolume: {
    position: 'absolute',
    bottom: -20,
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  addToCartButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});