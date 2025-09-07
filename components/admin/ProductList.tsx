import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { productService } from '../../services/ProductService';
import { Product } from '../../types/Product';
import { formatPrice } from '../../utils/priceFormatter';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface ProductListProps {
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onCreateNew: () => void;
  onOpenConfig?: () => void;
  onOpenQRGenerator?: () => void;
}

export default function ProductList({ onEditProduct, onDeleteProduct, onCreateNew, onOpenConfig, onOpenQRGenerator }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getProducts();
      setProducts(response.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <View style={styles.productInfo}>
        <View style={styles.productImage}>
          {item.imageUrl ? (
            <Text style={styles.imageText}>📷</Text>
          ) : (
            <Ionicons name="cafe" size={isTablet ? 40 : 30} color="#999" />
          )}
        </View>
        
        <View style={styles.productDetails}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
          <View style={styles.productBadges}>
            {item.isPopular && (
              <View style={[styles.badge, styles.popularBadge]}>
                <Text style={styles.badgeText}>Popular</Text>
              </View>
            )}
            {item.isNew && (
              <View style={[styles.badge, styles.newBadge]}>
                <Text style={styles.badgeText}>New</Text>
              </View>
            )}
            {!item.isActive && (
              <View style={[styles.badge, styles.inactiveBadge]}>
                <Text style={styles.badgeText}>Inactive</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.productActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => onEditProduct(item)}
        >
          <Ionicons name="pencil" size={isTablet ? 20 : 16} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onDeleteProduct(item.id)}
        >
          <Ionicons name="trash" size={isTablet ? 20 : 16} color="#ff4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#666" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Products ({products.length})</Text>
        <View style={styles.headerButtons}>
          {onOpenQRGenerator && (
            <TouchableOpacity style={styles.configButton} onPress={onOpenQRGenerator}>
              <Ionicons name="qr-code" size={isTablet ? 20 : 16} color="#4B5563" />
            </TouchableOpacity>
          )}
          {onOpenConfig && (
            <TouchableOpacity style={styles.configButton} onPress={onOpenConfig}>
              <Ionicons name="settings" size={isTablet ? 20 : 16} color="#4B5563" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.addButton} onPress={onCreateNew}>
            <Ionicons name="add" size={isTablet ? 24 : 20} color="#fff" />
            <Text style={styles.addButtonText}>Add Product</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={fetchProducts}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  configButton: {
    padding: isTablet ? 12 : 8,
    marginRight: isTablet ? 12 : 8,
    backgroundColor: '#F3F4F6',
    borderRadius: isTablet ? 12 : 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#666',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  listContainer: {
    padding: 20,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  productImage: {
    width: isTablet ? 60 : 50,
    height: isTablet ? 60 : 50,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  imageText: {
    fontSize: isTablet ? 24 : 20,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  productBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  popularBadge: {
    backgroundColor: '#E3F2FD',
  },
  newBadge: {
    backgroundColor: '#E8F5E8',
  },
  inactiveBadge: {
    backgroundColor: '#FFEBEE',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
  },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: isTablet ? 40 : 36,
    height: isTablet ? 40 : 36,
    borderRadius: isTablet ? 20 : 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#F5F5F5',
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#666',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
