import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { productService } from '../../services/ProductService';
import { CreateProductRequest, Product } from '../../types/Product';
import AppConfigPanel from './AppConfigPanel';
import CafeVideoConfigPanel from './CafeVideoConfigPanel';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import { QRCodeGenerator } from './QRCodeGenerator';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface AdminPanelProps {
  onClose: () => void;
}

type AdminView = 'list' | 'create' | 'edit' | 'config' | 'qr-generator' | 'video-config';

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [currentView, setCurrentView] = useState<AdminView>('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const handleCreateProduct = async (productData: CreateProductRequest) => {
    try {
      await productService.createProduct(productData);
      Alert.alert('Success', 'Product created successfully!');
      setReloadKey(k => k + 1); // Trigger list refresh
      setCurrentView('list');
    } catch (error) {
      Alert.alert('Error', 'Failed to create product');
      console.error('Error creating product:', error);
    }
  };

  const handleUpdateProduct = async (id: string, productData: Partial<CreateProductRequest>) => {
    try {
      await productService.updateProduct(id, { id, ...productData });
      Alert.alert('Success', 'Product updated successfully!');
      setReloadKey(k => k + 1); // Trigger list refresh
      setCurrentView('list');
      setEditingProduct(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to update product');
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await productService.deleteProduct(id);
              Alert.alert('Success', 'Product deleted successfully!');
              setReloadKey(k => k + 1); // Trigger list refresh
            } catch (error) {
              Alert.alert('Error', 'Failed to delete product');
              console.error('Error deleting product:', error);
            }
          },
        },
      ]
    );
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setCurrentView('edit');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'list':
        return (
          <ProductList
            key={reloadKey} // Force re-render when reloadKey changes
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onCreateNew={() => setCurrentView('create')}
            onOpenConfig={() => setCurrentView('config')}
            onOpenQRGenerator={() => setCurrentView('qr-generator')}
          />
        );
      case 'create':
        return (
          <ProductForm
            onSubmit={handleCreateProduct}
            onCancel={() => setCurrentView('list')}
          />
        );
      case 'edit':
        return (
          <ProductForm
            product={editingProduct}
            onSubmit={(data) => editingProduct && handleUpdateProduct(editingProduct.id, data)}
            onCancel={() => {
              setCurrentView('list');
              setEditingProduct(null);
            }}
          />
        );
      case 'config':
        return (
          <AppConfigPanel
            onBack={() => setCurrentView('list')}
          />
        );
      case 'qr-generator':
        return (
          <QRCodeGenerator />
        );
      case 'video-config':
        return (
          <CafeVideoConfigPanel
            cafeId="demo_cafe_001" // For demo, can be made dynamic
            cafeName="AKAFE"
            onBack={() => setCurrentView('list')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, currentView === 'list' && styles.activeNavButton]}
          onPress={() => setCurrentView('list')}
        >
          <Ionicons 
            name="list" 
            size={isTablet ? 24 : 20} 
            color={currentView === 'list' ? '#fff' : '#666'} 
          />
          <Text style={[
            styles.navButtonText,
            currentView === 'list' && styles.activeNavButtonText
          ]}>
            Products
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, currentView === 'create' && styles.activeNavButton]}
          onPress={() => setCurrentView('create')}
        >
          <Ionicons 
            name="add-circle" 
            size={isTablet ? 24 : 20} 
            color={currentView === 'create' ? '#fff' : '#666'} 
          />
          <Text style={[
            styles.navButtonText,
            currentView === 'create' && styles.activeNavButtonText
          ]}>
            Add Product
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, currentView === 'video-config' && styles.activeNavButton]}
          onPress={() => setCurrentView('video-config')}
        >
          <Ionicons 
            name="videocam" 
            size={isTablet ? 24 : 20} 
            color={currentView === 'video-config' ? '#fff' : '#666'} 
          />
          <Text style={[
            styles.navButtonText,
            currentView === 'video-config' && styles.activeNavButtonText
          ]}>
            Video Config
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSpacer: {
    width: 40,
  },
  navigation: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  activeNavButton: {
    backgroundColor: '#666',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginLeft: 8,
  },
  activeNavButtonText: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
});
