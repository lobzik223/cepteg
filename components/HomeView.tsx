import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppConfig } from '../hooks/useAppConfig';
import { useProducts } from '../hooks/useProducts';
import { Cafe } from '../services/CafeService';
import { Product, ProductCategory } from '../types/Product';
import { formatPrice } from '../utils/priceFormatter';
import CafeVideoView from './CafeVideoView';
import CheckoutModal from './CheckoutModal';
import DrinkCard from './DrinkCard';
import { MyOrderSection } from './MyOrderSection';
import ProductDetailView from './ProductDetailView';
import ProfileModal from './ProfileModal';
import { PromoCodesSection } from './PromoCodesSection';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;
const isLargeScreen = width > 414;
const isTablet = width >= 768;
const isLandscape = width > height;

interface HomeViewProps {
  onProfilePress?: () => void;
  cafe?: Cafe | null;
  onBackToScanner?: () => void;
  preloadedData?: any;
}

export default function HomeView({ onProfilePress, cafe, onBackToScanner, preloadedData }: HomeViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('for-you');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDetailVisible, setIsProductDetailVisible] = useState(false);
  const [cartItems, setCartItems] = useState<{product: Product, quantity: number}[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartAnimation] = useState(new Animated.Value(0));
  const [pulseAnimation] = useState(new Animated.Value(1));
  const [showCart, setShowCart] = useState(false);
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<{product: Product, quantity: number}[]>([]);
  
  console.log('HomeView render - currentOrder:', currentOrder);
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  
  // Ref для ScrollView и раздела "Мой заказ"
  const scrollViewRef = useRef<ScrollView>(null);
  const myOrderSectionRef = useRef<View>(null);

  // Category mapping for display and API
  // Dynamic category display names - can be extended from API
  const getCategoryDisplayName = (category: ProductCategory): string => {
    const displayNames: Record<string, string> = {
      'for-you': 'For You',
      'new': 'New',
      'milk-coffee': 'Milk Coffee',
      'iced-coffee': 'Iced Coffee',
      'iced-drinks': 'Iced Drinks',
      'cold-drinks': 'Cold Drinks',
      'hot-drinks': 'Hot Drinks',
      'desserts': 'Desserts',
      'food': 'Food',
      'kebabs': 'Kebabs',
      'appetizers': 'Appetizers',
      'main-dishes': 'Main Dishes',
      'salads': 'Salads',
      'beverages': 'Beverages',
      'coffee': 'Coffee',
      'tea': 'Tea',
      'juices': 'Juices',
      'smoothies': 'Smoothies',
      'snacks': 'Snacks',
      'breakfast': 'Breakfast',
      'lunch': 'Lunch',
      'dinner': 'Dinner',
    };
    
    return displayNames[category] || category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
  };

  // Use dynamic categories from selected cafe or preloaded data
  const categories: ProductCategory[] = preloadedData?.categories || (cafe?.categories as ProductCategory[]) || ['for-you', 'new'];
  
  // Use API hook to fetch products based on selected category
  const { 
    products: categoryProducts,
    loading, 
    error, 
    refetch 
  } = useProducts({ category: selectedCategory, autoFetch: !preloadedData, cafeId: cafe?.id });

  // For backward compatibility, keep popular and new products
  const { 
    popularProducts, 
    newProducts, 
    refetchPopular, 
    refetchNew 
  } = useProducts({ cafeId: cafe?.id });

  // Use preloaded products if available
  const finalCategoryProducts = preloadedData?.products || categoryProducts;
  const finalNewProducts = preloadedData?.products || newProducts;

  // App configuration
  const { 
    appConfig,
    loading: configLoading,
    error: configError
  } = useAppConfig();

  const handleCategoryPress = (category: ProductCategory) => {
    setSelectedCategory(category);
  };

  const handleProductPress = (product: Product) => {
    // Показываем модальное окно только для демо-кафе
    if (cafe?.id?.startsWith('demo_cafe_')) {
      setSelectedProduct(product);
      setIsProductDetailVisible(true);
    }
  };

  const handleCloseProductDetail = () => {
    setIsProductDetailVisible(false);
    setSelectedProduct(null);
  };

  const handleProfilePress = () => {
    setIsProfileModalVisible(true);
  };

  // Cart functions
  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { product, quantity: 1 }];
      }
    });

    // Cart appearance animation
    if (cartItems.length === 0) {
      cartAnimation.setValue(0);
      Animated.spring(cartAnimation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      // Update animation
      Animated.sequence([
        Animated.timing(cartAnimation, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(cartAnimation, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();
    }
    
    setShowCart(true);
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item.product.id !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };


  const handleOrderSuccess = () => {
    console.log('handleOrderSuccess called, cartItems:', cartItems);
    // Сохраняем заказ перед очисткой корзины
    const orderItems = [...cartItems];
    setCurrentOrder(orderItems);
    console.log('currentOrder set to:', orderItems);
    setCartItems([]);
    setCartTotal(0);
    setIsCheckoutModalVisible(false);
    
    // Автоматический скролл после небольшой задержки
    setTimeout(() => {
      if (orderItems.length > 0) {
        // Если есть заказ - скроллим к разделу "Мой заказ"
        try {
          myOrderSectionRef.current?.measureLayout(
            scrollViewRef.current as any,
            (x, y) => {
              scrollViewRef.current?.scrollTo({
                y: Math.max(0, y - 50), // Небольшой отступ сверху, но не меньше 0
                animated: true,
              });
            },
            () => {
              // Fallback если measureLayout не работает
              scrollViewRef.current?.scrollTo({
                y: 400,
                animated: true,
              });
            }
          );
        } catch {
          // Дополнительный fallback
          scrollViewRef.current?.scrollTo({
            y: 400,
            animated: true,
          });
        }
      } else {
        // Если нет заказа - скроллим наверх
        scrollViewRef.current?.scrollTo({
          y: 0,
          animated: true,
        });
      }
    }, 500);
  };


  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item.product.id !== productId)
    );
  };

  const openCartModal = () => {
    if (cartItems.length === 0) {
      return; // Don't open if cart is empty
    }
    
    // Press animation
    Animated.sequence([
      Animated.timing(cartAnimation, {
        toValue: 0.7,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(cartAnimation, {
        toValue: 1.1,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(cartAnimation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();

    // Always open checkout modal - authentication check will happen inside
    setIsCheckoutModalVisible(true);
  };

  // Calculate cart total
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    );
    setCartTotal(total);
  }, [cartItems]);

  // Clear cart when cafe changes
  useEffect(() => {
    clearCart();
    setShowCart(false);
  }, [cafe?.id]);

  // Auto-hide cart after 5 seconds
  useEffect(() => {
    if (showCart && cartItems.length > 0) {
      const timer = setTimeout(() => {
        setShowCart(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showCart, cartItems.length]);

  // Pulsing animation for cart
  useEffect(() => {
    if (cartItems.length > 0) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      
      return () => pulse.stop();
    }
  }, [cartItems.length]);

  // Initial cart appearance animation
  useEffect(() => {
    cartAnimation.setValue(0);
    Animated.spring(cartAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 80,
      friction: 6,
      delay: 500,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView ref={scrollViewRef} style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Video background with overlay elements */}
        <View style={styles.videoContainer}>
          <CafeVideoView cafe={cafe || null} />
        </View>
        
        {/* Overlay elements on top of video */}
        <View style={styles.overlayContainer}>
          <View style={styles.headerRow}>
            {/* Back button and cafe name */}
            <View style={styles.logoContainer}>
              {onBackToScanner && (
                <TouchableOpacity onPress={onBackToScanner} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={isTablet ? 32 : 24} color="#FFFFFF" />
                </TouchableOpacity>
              )}
              <View style={styles.cafeInfoContainer}>
                <Ionicons name="cafe" size={isTablet ? 40 : 32} color="#FFFFFF" />
                <View style={styles.cafeTextContainer}>
                  <Text style={styles.logoText}>{cafe?.name || 'Coffee Cafe'}</Text>
                  {cafe?.location && (
                    <Text style={styles.locationText}>{cafe.location}</Text>
                  )}
                </View>
              </View>
            </View>
            
            {/* Profile button */}
            <TouchableOpacity onPress={handleProfilePress} style={styles.profileButton}>
              <Ionicons name="person-circle-outline" size={isTablet ? 44 : 36} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>



        {/* My Order section */}
        {currentOrder.length > 0 && (
          <View ref={myOrderSectionRef}>
            <MyOrderSection
              orderItems={currentOrder}
              orderNumber="#12345"
              orderStatus="accepted"
              cafeName={cafe?.name || 'Cafe'}
              cafeAddress={cafe?.location || 'Address not specified'}
            />
          </View>
        )}

        {/* Promo codes section */}
        {cafe?.id && (
          <PromoCodesSection
            cafeId={cafe.id}
            onPromoCodePress={(promoCode) => {
              console.log('Promo code pressed:', promoCode.title);
              // Handle promo code press - could show details or apply
            }}
            onPromoCodeApply={(promoCode) => {
              console.log('Promo code apply:', promoCode.title);
              // Handle promo code application
            }}
          />
        )}

        {/* Content area */}
        <View style={styles.contentContainer}>


          {/* Categories - AKAFE now has 6 categories */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategoryButton
                ]}
                onPress={() => handleCategoryPress(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.selectedCategoryText
                  ]}
                >
                  {getCategoryDisplayName(category)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Category products - AKAFE: 6 categories total */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {getCategoryDisplayName(selectedCategory)}
            </Text>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#666" />
                <Text style={styles.loadingText}>Loading drinks...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={refetch}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : finalCategoryProducts.length > 0 ? (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.drinksHorizontalScroll}
                contentContainerStyle={styles.drinksScrollContent}
              >
                {finalCategoryProducts.map((drink: Product) => (
                  <View key={drink.id} style={styles.drinkCardContainer}>
                    <DrinkCard 
                      id={drink.id}
                      name={drink.name}
                      price={formatPrice(drink.price)}
                      badge={drink.badge?.text || null}
                      badgePosition={drink.badge?.position || 'none'}
                      imageUrl={drink.imageUrl}
                      onPress={() => handleProductPress(drink)}
                      onAddToCart={() => addToCart(drink)}
                    />
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.emptyStateContainer}>
                <Ionicons name="cafe-outline" size={isTablet ? 80 : 60} color="#9CA3AF" />
                <Text style={styles.emptyStateTitle}>No products in this category</Text>
                <Text style={styles.emptyStateText}>
                  Add products to &quot;{getCategoryDisplayName(selectedCategory)}&quot; category through the admin panel
                </Text>
              </View>
            )}
          </View>

          {/* New offers */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>New For You</Text>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#666" />
                <Text style={styles.loadingText}>Loading drinks...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={refetchNew}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : finalNewProducts.length > 0 ? (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.drinksHorizontalScroll}
                contentContainerStyle={styles.drinksScrollContent}
              >
                {finalNewProducts.map((drink: Product) => (
                  <View key={drink.id} style={styles.drinkCardContainer}>
                    <DrinkCard 
                      id={drink.id}
                      name={drink.name}
                      price={formatPrice(drink.price)}
                      badge={drink.badge?.text || null}
                      badgePosition={drink.badge?.position || 'none'}
                      imageUrl={drink.imageUrl}
                      onPress={() => handleProductPress(drink)}
                      onAddToCart={() => addToCart(drink)}
                    />
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.emptyStateContainer}>
                <Ionicons name="sparkles-outline" size={isTablet ? 80 : 60} color="#9CA3AF" />
                <Text style={styles.emptyStateTitle}>No new products</Text>
                <Text style={styles.emptyStateText}>
                  Add new products through the admin panel
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailView
          visible={isProductDetailVisible}
          product={selectedProduct}
          onClose={handleCloseProductDetail}
          onAddToCart={(product, quantity, customizations) => {
            addToCart(product);
          }}
        />
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        visible={isCheckoutModalVisible}
        onClose={() => setIsCheckoutModalVisible(false)}
        cartItems={cartItems}
        onOrderSuccess={handleOrderSuccess}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        cafeId={cafe?.id}
      />


      {/* Profile Modal */}
      <ProfileModal
        visible={isProfileModalVisible}
        onClose={() => setIsProfileModalVisible(false)}
      />

      {/* Floating Cart Widget - Always Visible */}
      <Animated.View 
        style={[
          styles.floatingCartWidget,
          {
            transform: [
              {
                scale: cartAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.1],
                })
              },
              {
                scale: cartItems.length > 0 ? pulseAnimation : 1
              }
            ]
          }
        ]}
      >
        <TouchableOpacity style={styles.floatingCartButton} onPress={openCartModal}>
          <LinearGradient
            colors={cartItems.length > 0 ? ['#6B7280', '#4B5563'] : ['#9E9E9E', '#757575', '#616161']}
            style={styles.floatingCartGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="cart" size={isTablet ? 24 : 20} color="#fff" />
          </LinearGradient>
          {/* Показ содержимого корзины */}
          {cartItems.length > 0 && (
            <View style={styles.cartPreview}>
              <Text style={styles.cartPreviewText}>
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Full Screen Cart Modal */}
      {isCartModalVisible && (
        <View style={styles.cartModalOverlay}>
          <View style={styles.cartModal}>
            {/* Header with minimal design */}
            <View style={styles.cartModalHeader}>
              <View style={styles.cartModalHeaderContent}>
                <View style={styles.cartModalTitleContainer}>
                  <Ionicons name="cart" size={28} color="#333" />
                  <Text style={styles.cartModalTitle}>Cart</Text>
                </View>
                <TouchableOpacity 
                  style={styles.cartModalCloseButton}
                  onPress={() => setIsCartModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              {/* Cart summary in header */}
              <View style={styles.cartSummaryHeader}>
                <Text style={styles.cartSummaryText}>
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </Text>
                <Text style={styles.cartTotalHeader}>{formatPrice(cartTotal)}</Text>
              </View>
            </View>
            
            {/* Cart items list */}
            <ScrollView style={styles.cartItemsList} showsVerticalScrollIndicator={false}>
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <View key={item.product.id} style={styles.cartItem}>
                    <View style={styles.cartItemImageContainer}>
                      <View style={styles.cartItemImagePlaceholder}>
                        <Ionicons name="cafe" size={24} color="#999" />
                      </View>
                    </View>
                    
                    <View style={styles.cartItemInfo}>
                      <Text style={styles.cartItemName}>{item.product.name}</Text>
                      <Text style={styles.cartItemPrice}>
                        {formatPrice(item.product.price)}
                      </Text>
                    </View>
                    
                    <View style={styles.cartItemActions}>
                      <TouchableOpacity 
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Ionicons name="remove" size={18} color="#666" />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity 
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Ionicons name="add" size={18} color="#666" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyCartContainer}>
                  <Ionicons name="cart-outline" size={64} color="#ccc" />
                  <Text style={styles.emptyCartText}>Cart is empty</Text>
                  <Text style={styles.emptyCartSubtext}>Add items to your order</Text>
                </View>
              )}
            </ScrollView>
            
            {/* Footer with checkout */}
            <View style={styles.cartModalFooter}>
              <View style={styles.cartTotalRow}>
                <Text style={styles.cartTotalLabel}>Total to pay:</Text>
                <Text style={styles.cartTotalAmount}>{formatPrice(cartTotal)}</Text>
              </View>
              
                             <TouchableOpacity 
                 style={[
                   styles.checkoutButtonLarge,
                   cartItems.length === 0 && styles.checkoutButtonDisabled
                 ]}
                 disabled={cartItems.length === 0}
               >
                 <View style={styles.checkoutButtonGradient}>
                   <Ionicons name="card" size={20} color="#fff" />
                   <Text style={styles.checkoutButtonText}>Place Order</Text>
                 </View>
               </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  videoContainer: {
    height: isTablet 
      ? (isLandscape ? 600 : 750) 
      : isSmallScreen ? 500 : isLargeScreen ? 650 : 600,
    position: 'relative',
    marginHorizontal: isTablet ? -100 : -16,
    marginTop: isTablet ? -40 : -40,
    width: isTablet ? width + 1000 : width + 600, 
    marginLeft: isTablet ? -25 : 0, 
    overflow: 'hidden',
    borderRadius: isTablet ? 32 : 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    justifyContent: 'flex-start',
    pointerEvents: 'box-none',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 70 : 20,
    paddingTop: isTablet ? 25 : 20, 
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: isTablet ? 15 : 10,
    padding: 5,
  },
  cafeInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cafeTextContainer: {
    marginLeft: isTablet ? 12 : 8,
  },
  logoText: {
    fontSize: isTablet ? 34 : isSmallScreen ? 18 : 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  locationText: {
    fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  profileButton: {
    padding: 8,
    pointerEvents: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 20,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: isTablet ? 40 : 16,
    paddingTop: isTablet ? 60 : 30,
    paddingBottom: 100,
  },
  promoBanners: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  promoCard: {
    flex: 1,
    minHeight: isTablet ? 140 : isSmallScreen ? 100 : 120,
    padding: isTablet ? 20 : isSmallScreen ? 12 : 16,
    borderRadius: isTablet ? 20 : 16,
    justifyContent: 'space-between',
  },
  promoCard1: {
    backgroundColor: '#F8F8F8',
  },
  promoCard2: {
    backgroundColor: '#F0F0F0',
  },
  promoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  applyButton: {
    backgroundColor: '#666',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesContainer: {
    marginBottom: isTablet ? 28 : 20,
  },
  categoryButton: {
    paddingHorizontal: isTablet ? 28 : 20,
    paddingVertical: isTablet ? 16 : 10,
    backgroundColor: '#F5F5F5',
    borderRadius: isTablet ? 28 : 20,
    marginRight: isTablet ? 16 : 12,
  },
  selectedCategoryButton: {
    backgroundColor: '#666',
  },
  categoryText: {
    fontSize: isTablet ? 20 : 16,
    fontWeight: '500',
    color: '#333',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: isTablet ? 28 : isSmallScreen ? 20 : 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: isTablet ? 24 : 16,
  },
  drinksHorizontalScroll: {
    marginHorizontal: isTablet ? -40 : -16, 
  },
  drinksScrollContent: {
    paddingHorizontal: isTablet ? 40 : 16,
    gap: isTablet ? 20 : 16,
  },
  drinkCardContainer: {
    width: isTablet ? 220 : 180, 
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
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
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isTablet ? 60 : 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: isTablet ? 20 : 16,
    marginBottom: isTablet ? 12 : 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: isTablet ? 18 : 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: isTablet ? 26 : 24,
    maxWidth: isTablet ? 400 : 300,
  },
  // Floating Cart Widget Styles
  floatingCartWidget: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    zIndex: 1000,
  },
  floatingCartButton: {
    width: isTablet ? 60 : 50,
    height: isTablet ? 60 : 50,
    borderRadius: isTablet ? 30 : 25,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  floatingCartGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: isTablet ? 30 : 25,
    position: 'relative',
  },
  cartPreview: {
    position: 'absolute',
    bottom: -25,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  cartPreviewText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },

  // Cart Modal Styles
  cartModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 2000,
  },
  cartModal: {
    backgroundColor: '#fff',
    flex: 1,
    width: '100%',
    height: '100%',
  },
  cartModalHeader: {
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#fff',
  },
  cartModalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  cartModalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  cartModalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartSummaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cartSummaryText: {
    fontSize: 16,
    color: '#666',
  },
  cartTotalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cartItemsList: {
    maxHeight: 400,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cartItemImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartItemImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  cartItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 20,
    minWidth: 20,
    textAlign: 'center',
  },
  emptyCartContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyCartText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyCartSubtext: {
    fontSize: 16,
    color: '#ccc',
  },
  cartModalFooter: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  cartTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cartTotalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cartTotalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  checkoutButtonLarge: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  checkoutButtonDisabled: {
    opacity: 0.6,
  },
  checkoutButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#333',
    borderRadius: 25,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});
