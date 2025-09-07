import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { CreateProductRequest, Product, ProductCategory } from '../../types/Product';
import { tlToKurus } from '../../utils/priceFormatter';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: CreateProductRequest) => void;
  onCancel: () => void;
}

const categories: { value: ProductCategory; label: string }[] = [
  { value: 'for-you', label: 'For You' },
  { value: 'new', label: 'New' },
  { value: 'milk-coffee', label: 'Milk Coffee' },
  { value: 'iced-drinks', label: 'Iced Drinks' },
  { value: 'hot-drinks', label: 'Hot Drinks' },
  { value: 'desserts', label: 'Desserts' },
  { value: 'food', label: 'Food' },
];

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: '',
    description: '',
    price: 0, // Will be in kuruş
    category: 'for-you',
    imageUrl: '',
    badge: undefined,
    isActive: true,
    isPopular: false,
    isNew: false,
    nutritionalInfo: {
      energy: 0,
      proteins: 0,
      fats: 0,
      carbs: 0,
    },
  });

  const [priceInput, setPriceInput] = useState('0'); // For user input in TL

  const [badgeText, setBadgeText] = useState('');
  const [badgePosition, setBadgePosition] = useState<'topLeft' | 'topRight' | 'none'>('none');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price, // Already in kuruş
        category: product.category,
        imageUrl: product.imageUrl || '',
        badge: product.badge,
        isActive: product.isActive,
        isPopular: product.isPopular,
        isNew: product.isNew,
        nutritionalInfo: product.nutritionalInfo || {
          energy: 0,
          proteins: 0,
          fats: 0,
          carbs: 0,
        },
      });
      setPriceInput((product.price / 100).toString()); // Convert kuruş to TL for display
      setBadgeText(product.badge?.text || '');
      setBadgePosition(product.badge?.position || 'none');
    }
  }, [product]);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Product name is required');
      return;
    }

    const priceInTL = parseFloat(priceInput) || 0;
    if (priceInTL <= 0) {
      Alert.alert('Error', 'Price must be greater than 0');
      return;
    }

    const submitData: CreateProductRequest = {
      ...formData,
      price: tlToKurus(priceInTL), // Convert TL to kuruş
      badge: badgeText.trim() ? {
        text: badgeText.trim(),
        position: badgePosition,
      } : undefined,
    };

    onSubmit(submitData);
  };

  const updateFormData = (field: keyof CreateProductRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNutritionalInfo = (field: keyof NonNullable<CreateProductRequest['nutritionalInfo']>, value: number) => {
    setFormData(prev => ({
      ...prev,
      nutritionalInfo: {
        ...prev.nutritionalInfo!,
        [field]: value,
      },
    }));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => updateFormData('name', text)}
              placeholder="Enter product name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => updateFormData('description', text)}
              placeholder="Enter product description"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price (₺) *</Text>
            <TextInput
              style={styles.input}
              value={priceInput}
              onChangeText={setPriceInput}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.value}
                  style={[
                    styles.categoryButton,
                    formData.category === category.value && styles.selectedCategoryButton
                  ]}
                  onPress={() => updateFormData('category', category.value)}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    formData.category === category.value && styles.selectedCategoryButtonText
                  ]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Image URL</Text>
            <TextInput
              style={styles.input}
              value={formData.imageUrl}
              onChangeText={(text) => updateFormData('imageUrl', text)}
              placeholder="https://example.com/image.jpg"
            />
          </View>
        </View>

        {/* Badge */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badge</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Badge Text</Text>
            <TextInput
              style={styles.input}
              value={badgeText}
              onChangeText={setBadgeText}
              placeholder="e.g., Enhanced, New, Popular"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Badge Position</Text>
            <View style={styles.positionButtons}>
              {(['topLeft', 'topRight', 'none'] as const).map((position) => (
                <TouchableOpacity
                  key={position}
                  style={[
                    styles.positionButton,
                    badgePosition === position && styles.selectedPositionButton
                  ]}
                  onPress={() => setBadgePosition(position)}
                >
                  <Text style={[
                    styles.positionButtonText,
                    badgePosition === position && styles.selectedPositionButtonText
                  ]}>
                    {position === 'topLeft' ? 'Top Left' : 
                     position === 'topRight' ? 'Top Right' : 'None'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          
          <View style={styles.switchGroup}>
            <Text style={styles.switchLabel}>Active</Text>
            <Switch
              value={formData.isActive}
              onValueChange={(value) => updateFormData('isActive', value)}
            />
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.switchLabel}>Popular</Text>
            <Switch
              value={formData.isPopular}
              onValueChange={(value) => updateFormData('isPopular', value)}
            />
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.switchLabel}>New</Text>
            <Switch
              value={formData.isNew}
              onValueChange={(value) => updateFormData('isNew', value)}
            />
          </View>
        </View>

        {/* Nutritional Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutritional Information</Text>
          
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionInput}>
              <Text style={styles.label}>Energy (kcal)</Text>
              <TextInput
                style={styles.input}
                value={formData.nutritionalInfo?.energy.toString() || '0'}
                onChangeText={(text) => updateNutritionalInfo('energy', parseFloat(text) || 0)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.nutritionInput}>
              <Text style={styles.label}>Proteins (g)</Text>
              <TextInput
                style={styles.input}
                value={formData.nutritionalInfo?.proteins.toString() || '0'}
                onChangeText={(text) => updateNutritionalInfo('proteins', parseFloat(text) || 0)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.nutritionInput}>
              <Text style={styles.label}>Fats (g)</Text>
              <TextInput
                style={styles.input}
                value={formData.nutritionalInfo?.fats.toString() || '0'}
                onChangeText={(text) => updateNutritionalInfo('fats', parseFloat(text) || 0)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.nutritionInput}>
              <Text style={styles.label}>Carbs (g)</Text>
              <TextInput
                style={styles.input}
                value={formData.nutritionalInfo?.carbs.toString() || '0'}
                onChangeText={(text) => updateNutritionalInfo('carbs', parseFloat(text) || 0)}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>
              {product ? 'Update Product' : 'Create Product'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  form: {
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  selectedCategoryButton: {
    backgroundColor: '#666',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedCategoryButtonText: {
    color: '#fff',
  },
  positionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  positionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  selectedPositionButton: {
    backgroundColor: '#666',
  },
  positionButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedPositionButtonText: {
    color: '#fff',
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  nutritionInput: {
    width: (width - 80) / 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#666',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
