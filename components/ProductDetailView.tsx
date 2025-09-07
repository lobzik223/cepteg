import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Product } from '../types/Product';
import { formatPrice } from '../utils/priceFormatter';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;
const isLandscape = width > height;

interface ProductDetailViewProps {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetailView({ visible, product, onClose }: ProductDetailViewProps) {
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedMilk, setSelectedMilk] = useState('Cow Milk');
  const [selectedTemperature, setSelectedTemperature] = useState('Standard');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  // Default options if product doesn't have customization options
  const defaultSizes = [
            { id: 'S', label: 'S', volume: '250 ml', priceModifier: -3 },
        { id: 'M', label: 'M', volume: '350 ml', priceModifier: 0 },
        { id: 'L', label: 'L', volume: '450 ml', priceModifier: 5 },
  ];

  const defaultMilkOptions = [
    { id: 'cow', name: 'Cow Milk', icon: 'water', priceModifier: 0 },
    { id: 'oat', name: 'Oat Milk', icon: 'leaf', priceModifier: 2 },
    { id: 'almond', name: 'Almond Milk', icon: 'nutrition', priceModifier: 2 },
    { id: 'soy', name: 'Soy Milk', icon: 'flower', priceModifier: 2 },
  ];

  const defaultTemperatureOptions = [
    { id: 'hot', name: 'Hot', icon: 'flame' },
    { id: 'standard', name: 'Standard', icon: 'thermometer' },
    { id: 'cold', name: 'Cold', icon: 'snow' },
  ];

  const defaultAddOns = [
    { id: 'cheese-foam', name: 'Cheese Foam & Mousse', icon: 'add-circle', price: 5 },
    { id: 'syrup', name: 'Syrup', icon: 'add-circle', price: 3 },
    { id: 'extra-shot', name: 'Extra Shot', icon: 'add-circle', price: 4 },
    { id: 'whipped-cream', name: 'Whipped Cream', icon: 'add-circle', price: 2 },
  ];

  // Use product's customization options or defaults
  const sizes = product?.customizationOptions?.sizes || defaultSizes;
  const milkOptions = product?.customizationOptions?.milkTypes || defaultMilkOptions;
  const temperatureOptions = product?.customizationOptions?.temperatures || defaultTemperatureOptions;
  const addOns = product?.customizationOptions?.addOns || defaultAddOns;

  // Use product's nutritional info or defaults
  const nutritionalInfo = product?.nutritionalInfo ? [
    { label: 'Energy', value: `${product.nutritionalInfo.energy} kcal` },
    { label: 'Proteins', value: `${product.nutritionalInfo.proteins} g` },
    { label: 'Fats', value: `${product.nutritionalInfo.fats} g` },
    { label: 'Carbs', value: `${product.nutritionalInfo.carbs} g` },
  ] : [
    { label: 'Energy', value: '156 kcal' },
    { label: 'Proteins', value: '8.0 g' },
    { label: 'Fats', value: '8.1 g' },
    { label: 'Carbs', value: '12.7 g' },
  ];

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnId) 
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const getPrice = () => {
    if (!product) return formatPrice(0);
    
    let basePrice = product.price; // price is in kuruş
    
    // Add size modifier (convert TL to kuruş)
    const selectedSizeOption = sizes.find(size => size.id === selectedSize);
    if (selectedSizeOption) {
      basePrice += (selectedSizeOption.priceModifier || 0) * 100; // Convert TL to kuruş
    }
    
    // Add milk modifier (convert TL to kuruş)
    const selectedMilkOption = milkOptions.find(milk => milk.name === selectedMilk);
    if (selectedMilkOption) {
      basePrice += (selectedMilkOption.priceModifier || 0) * 100; // Convert TL to kuruş
    }
    
    // Add add-ons (convert TL to kuruş)
    selectedAddOns.forEach(addOnId => {
      const addOn = addOns.find(a => a.id === addOnId);
      if (addOn) {
        basePrice += (addOn.price || 0) * 100; // Convert TL to kuruş
      }
    });
    
    return formatPrice(basePrice);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Video Widget Placeholder */}
          <View style={styles.videoSection}>
            <View style={styles.videoPlaceholder}>
              <Ionicons name="play-circle" size={70} color="#9CA3AF" />
              <Text style={styles.videoText}>Video Widget</Text>
            </View>
            <Text style={styles.videoTitle}>How we make {product?.name || 'this drink'}</Text>
          </View>

          {/* Close Button Overlay */}
          <TouchableOpacity onPress={onClose} style={styles.closeButtonOverlay}>
            <Ionicons name="close" size={26} color="#374151" />
          </TouchableOpacity>

          {/* Customization Options */}
          <View style={styles.customizationSection}>
            <Text style={styles.sectionTitle}>Customization</Text>
            
            {/* Milk Type */}
            <View style={styles.optionGroup}>
              <Text style={styles.optionLabel}>Milk Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
                {milkOptions.map((milk) => (
                  <TouchableOpacity
                    key={milk.id}
                    style={[
                      styles.optionCard,
                      selectedMilk === milk.name && styles.selectedOptionCard
                    ]}
                    onPress={() => setSelectedMilk(milk.name)}
                  >
                    <Ionicons 
                      name={milk.icon as any} 
                      size={28} 
                      color={selectedMilk === milk.name ? '#FFFFFF' : '#6B7280'} 
                    />
                    <Text style={[
                      styles.optionText,
                      selectedMilk === milk.name && styles.selectedOptionText
                    ]}>
                      {milk.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Temperature */}
            <View style={styles.optionGroup}>
              <Text style={styles.optionLabel}>Temperature</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
                {temperatureOptions.map((temp) => (
                  <TouchableOpacity
                    key={temp.id}
                    style={[
                      styles.optionCard,
                      selectedTemperature === temp.name && styles.selectedOptionCard
                    ]}
                    onPress={() => setSelectedTemperature(temp.name)}
                  >
                    <Ionicons 
                      name={temp.icon as any} 
                      size={28} 
                      color={selectedTemperature === temp.name ? '#FFFFFF' : '#6B7280'} 
                    />
                    <Text style={[
                      styles.optionText,
                      selectedTemperature === temp.name && styles.selectedOptionText
                    ]}>
                      {temp.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Add-ons */}
            <View style={styles.optionGroup}>
              <Text style={styles.optionLabel}>Add-ons</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
                {addOns.map((addOn) => (
                  <TouchableOpacity
                    key={addOn.id}
                    style={[
                      styles.optionCard,
                      selectedAddOns.includes(addOn.id) && styles.selectedOptionCard
                    ]}
                    onPress={() => toggleAddOn(addOn.id)}
                  >
                    <Ionicons 
                      name={addOn.icon as any} 
                      size={28} 
                      color={selectedAddOns.includes(addOn.id) ? '#FFFFFF' : '#6B7280'} 
                    />
                    <Text style={[
                      styles.optionText,
                      selectedAddOns.includes(addOn.id) && styles.selectedOptionText
                    ]}>
                      {addOn.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Nutritional Information */}
          <View style={styles.nutritionSection}>
            <View style={styles.nutritionCard}>
              {nutritionalInfo.map((info, index) => (
                <View key={info.label} style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{info.value}</Text>
                  <Text style={styles.nutritionLabel}>{info.label}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.compositionButton}>
              <Text style={styles.compositionText}>Composition</Text>
            </TouchableOpacity>
          </View>

          {/* Product Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionText}>
              {product?.description || "Classic coffee drink based on espresso, with cow's milk and velvety foam. A balanced combination of coffee strength and milk softness makes it rich and at the same time delicate."}
            </Text>
          </View>

          {/* Related Products */}
          {product?.relatedProducts && product.relatedProducts.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.sectionTitle}>Together Tastier</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.relatedScroll}>
                {product.relatedProducts.map((relatedProduct) => (
                  <View key={relatedProduct.id} style={styles.relatedCard}>
                    <View style={styles.relatedImagePlaceholder}>
                      <Ionicons name="restaurant" size={50} color="#9CA3AF" />
                    </View>
                    <Text style={styles.relatedText}>{relatedProduct.name}</Text>
                    <Text style={styles.relatedPrice}>{formatPrice(relatedProduct.price)}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Bottom Spacer */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Bottom Action Bar */}
        <View style={styles.bottomBar}>
          <View style={styles.sizeSelection}>
            {sizes.map((size) => (
              <TouchableOpacity
                key={size.id}
                style={[
                  styles.sizeButton,
                  selectedSize === size.id && styles.selectedSizeButton
                ]}
                onPress={() => setSelectedSize(size.id)}
              >
                <Text style={[
                  styles.sizeText,
                  selectedSize === size.id && styles.selectedSizeText
                ]}>
                  {size.label}
                </Text>
                {selectedSize === size.id && (
                  <Text style={styles.sizeVolume}>{size.volume}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={22} color="#FFFFFF" />
            <Text style={styles.addButtonText}>{getPrice()}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  closeButtonOverlay: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  scrollView: {
    flex: 1,
  },

  videoSection: {
    paddingHorizontal: 24,
    paddingTop: 16,
    marginBottom: 32,
  },
  videoPlaceholder: {
    height: isTablet ? 520 : 480,
    backgroundColor: '#E8EAED',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  videoText: {
    fontSize: 17,
    color: '#6B7280',
    marginTop: 12,
    fontWeight: '500',
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  customizationSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 24,
    letterSpacing: 0.3,
  },
  optionGroup: {
    marginBottom: 28,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
    letterSpacing: 0.2,
  },
  optionsScroll: {
    flexDirection: 'row',
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    marginRight: 16,
    alignItems: 'center',
    minWidth: 110,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedOptionCard: {
    backgroundColor: '#4B5563',
    borderColor: '#4B5563',
    shadowColor: '#4B5563',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  optionText: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  nutritionSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  nutritionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  nutritionLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  compositionButton: {
    backgroundColor: '#F8F9FA',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  compositionText: {
    fontSize: 17,
    color: '#4B5563',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  descriptionSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  descriptionText: {
    fontSize: 17,
    color: '#374151',
    lineHeight: 26,
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  relatedSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  relatedScroll: {
    flexDirection: 'row',
  },
  relatedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: isTablet ? 20 : 18,
    marginRight: isTablet ? 24 : 20,
    width: isTablet ? 200 : 180,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  relatedImagePlaceholder: {
    width: isTablet ? 140 : 120,
    height: isTablet ? 140 : 120,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isTablet ? 16 : 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  relatedText: {
    fontSize: isTablet ? 17 : 16,
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: isTablet ? 8 : 6,
    fontWeight: '600',
    letterSpacing: 0.1,
    lineHeight: isTablet ? 22 : 20,
  },
  relatedPrice: {
    fontSize: isTablet ? 19 : 18,
    fontWeight: '700',
    color: '#4B5563',
    letterSpacing: 0.2,
  },
  bottomSpacer: {
    height: 100,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  sizeSelection: {
    flexDirection: 'row',
    gap: 12,
  },
  sizeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedSizeButton: {
    backgroundColor: '#4B5563',
    borderColor: '#4B5563',
    shadowColor: '#4B5563',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  sizeText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.2,
  },
  selectedSizeText: {
    color: '#FFFFFF',
  },
  sizeVolume: {
    fontSize: 10,
    color: '#fff',
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4B5563',
    paddingHorizontal: 28,
    paddingVertical: 18,
    borderRadius: 28,
    gap: 10,
    shadowColor: '#4B5563',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
