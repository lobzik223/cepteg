import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Image,
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
import { authService, User } from '../services/AuthService';
import { Cafe } from '../services/CafeService';
import { Product, ProductCategory } from '../types/Product';
import { formatPrice } from '../utils/priceFormatter';
import AuthModal from './AuthModal';
import CheckoutModal from './CheckoutModal';
import DrinkCard from './DrinkCard';
import { MyOrderSection } from './MyOrderSection';
import ProductDetailView from './ProductDetailView';
import ProfileModal from './ProfileModal';
import { PromoCodesSection } from './PromoCodesSection';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;
const isTablet = width >= 768;

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
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
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

  // Check auth state on component mount
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const isLoggedIn = await authService.isUserLoggedIn();
      if (isLoggedIn) {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    }
  };

  const handleProfilePress = async () => {
    try {
      const isLoggedIn = await authService.isUserLoggedIn();
      
      if (isLoggedIn) {
        // Пользователь авторизован - показываем профиль
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
        setIsProfileModalVisible(true);
      } else {
        // Пользователь не авторизован - показываем форму входа/регистрации
        setIsAuthModalVisible(true);
      }
    } catch (error) {
      console.error('Error handling profile press:', error);
      // В случае ошибки показываем форму авторизации
      setIsAuthModalVisible(true);
    }
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthModalVisible(false);
    setIsProfileModalVisible(true);
  };

  const handleProfileUpdated = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      setIsProfileModalVisible(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
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
        {/* Cepteg App Header */}
        <View style={styles.appHeader}>
          {/* Background Logo Image */}
          <View style={styles.logoBackgroundContainer}>
            <Image 
              source={require('../assets/images/logoview.png')} 
              style={styles.logoBackgroundImage}
              resizeMode="cover"
            />
          </View>
          
          {/* Overlay Content */}
          <View style={styles.headerOverlay}>
            <View style={styles.titleRow}>
              {onBackToScanner ? (
                <TouchableOpacity onPress={onBackToScanner} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={isTablet ? 32 : 28} color="#376138" />
                </TouchableOpacity>
              ) : (
                <View style={styles.backButton} />
              )}
              
              
              <TouchableOpacity onPress={handleProfilePress} style={styles.profileButton}>
                <Ionicons name="person" size={isTablet ? 32 : 28} color="#376138" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Cafe Info Section */}
        <View style={styles.cafeInfoSection}>
          <View style={styles.cafeInfoContent}>
            <View style={styles.locationIconContainer}>
              <Ionicons name="location" size={isTablet ? 36 : 28} color="#FFFFFF" />
            </View>
            <View style={styles.cafeTextContainer}>
              <Text style={styles.cafeNameText}>{cafe?.name || 'Coffee Cafe'}</Text>
              {cafe?.location && (
                <Text style={styles.cafeLocationText}>{cafe.location}</Text>
              )}
            </View>
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
            onPromoCodeImagePress={(promoImage) => {
              console.log('Promo code image pressed:', promoImage.id);
              // Handle promo code image press - could show details or apply
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
        cafeName={cafe?.name}
        cafeLocation={cafe?.location}
      />


      {/* Auth Modal */}
      <AuthModal
        visible={isAuthModalVisible}
        onClose={() => setIsAuthModalVisible(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Profile Modal */}
      <ProfileModal
        visible={isProfileModalVisible}
        onClose={() => setIsProfileModalVisible(false)}
        user={currentUser}
        onLogout={handleLogout}
        onProfileUpdated={handleProfileUpdated}
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
          <View style={[
            styles.floatingCartGradient,
            { backgroundColor: cartItems.length > 0 ? '#4CAF50' : '#757575' }
          ]}>
            <Ionicons name="bag" size={isTablet ? 28 : 20} color="#fff" />
          </View>
          {/* Счетчик товаров */}
          {cartItems.length > 0 && (
            <View style={styles.cartCounter}>
              <Text style={styles.cartCounterText}>
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
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
                   <Ionicons name="card" size={20} color={cartItems.length === 0 ? "#9CA3AF" : "#fff"} />
                   <Text style={[
                     styles.checkoutButtonText,
                     cartItems.length === 0 && { color: '#9CA3AF' }
                   ]}>
                     {cartItems.length === 0 ? 'Add items to cart' : 'Place Order'}
                   </Text>
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
  appHeader: {
    position: 'relative',
    paddingTop: isTablet ? 50 : 45,
    paddingBottom: isTablet ? 25 : 20,
    paddingHorizontal: isTablet ? 40 : 20,
    marginTop: isTablet ? -50 : -45,
    marginBottom: isTablet ? -25 : -20,
    marginHorizontal: isTablet ? -40 : -16,
    borderBottomLeftRadius: isTablet ? 40 : 35,
    borderBottomRightRadius: isTablet ? 40 : 35,
    overflow: 'hidden',
  },
  logoBackgroundContainer: {
    position: 'absolute',
    top: isTablet ? 20 : 15,
    left: 5,
    right: -5,
    bottom: 0,
    zIndex: 1,
    borderBottomLeftRadius: isTablet ? 55 : 50,
    borderBottomRightRadius: isTablet ? 65 : 60,
    overflow: 'hidden',
  },
  logoBackgroundImage: {
    width: '95%',
    height: '100%',
  },
  headerOverlay: {
    position: 'relative',
    zIndex: 2,
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    minHeight: isTablet ? 60 : 52,
  },
  cafeInfoSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: isTablet ? 12 : 8,
    paddingHorizontal: isTablet ? 20 : 10,
    marginHorizontal: isTablet ? 20 : 16,
    marginVertical: isTablet ? 8 : 6,
    borderRadius: isTablet ? 10 : 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  cafeInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: isTablet ? 0 : 0,
    paddingHorizontal: isTablet ? 0 : 0,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: isTablet ? 48 : 44,
    height: isTablet ? 48 : 44,
    borderRadius: isTablet ? 24 : 22,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0,
  },
  cafeInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIconContainer: {
    width: isTablet ? 48 : 40,
    height: isTablet ? 48 : 40,
    borderRadius: isTablet ? 24 : 20,
    backgroundColor: '#359441',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#359441',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  cafeTextContainer: {
    marginLeft: isTablet ? 16 : 12,
    flex: 1,
  },
  cafeNameText: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: '600',
    color: '#376138',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cafeLocationText: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '400',
    color: '#6B7280',
    letterSpacing: 0.3,
    lineHeight: isTablet ? 22 : 20,
  },
  logoText: {
    fontSize: isTablet ? 28 : isSmallScreen ? 16 : 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  locationText: {
    fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  profileButton: {
    width: isTablet ? 48 : 44,
    height: isTablet ? 48 : 44,
    borderRadius: isTablet ? 24 : 22,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0,
  },
  appTitle: {
    fontSize: isTablet ? 52 : 46,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1.5,
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 6 },
    textShadowRadius: 12,
    transform: [{ scaleY: 1.15 }, { scaleX: 1.05 }],
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  appSubtitle: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 1,
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
    backgroundColor: '#376138',
  },
  categoryText: {
    fontSize: isTablet ? 20 : 16,
    fontWeight: '300',
    color: '#374151',
    letterSpacing: 0.5,
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: '400',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: isTablet ? 28 : isSmallScreen ? 20 : 22,
    fontWeight: '400',
    color: '#374151',
    marginBottom: isTablet ? 24 : 16,
    letterSpacing: 0.8,
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
    fontWeight: '300',
    color: '#9CA3AF',
    marginTop: 12,
    letterSpacing: 0.3,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.3,
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
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isTablet ? 60 : 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: '400',
    color: '#6B7280',
    marginTop: isTablet ? 20 : 16,
    marginBottom: isTablet ? 12 : 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  emptyStateText: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '300',
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: isTablet ? 26 : 24,
    maxWidth: isTablet ? 400 : 300,
    letterSpacing: 0.3,
  },
  // Floating Cart Widget Styles
  floatingCartWidget: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    zIndex: 1000,
  },
  floatingCartButton: {
    width: isTablet ? 70 : 50,
    height: isTablet ? 70 : 50,
    borderRadius: isTablet ? 35 : 25,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 12,
  },
  floatingCartGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: isTablet ? 35 : 25,
    position: 'relative',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  cartCounter: {
    position: 'absolute',
    top: isTablet ? -12 : -10,
    right: isTablet ? -12 : -10,
    backgroundColor: '#FF5722',
    borderRadius: isTablet ? 18 : 15,
    paddingHorizontal: isTablet ? 8 : 6,
    paddingVertical: isTablet ? 4 : 3,
    minWidth: isTablet ? 36 : 30,
    minHeight: isTablet ? 36 : 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: isTablet ? 4 : 3,
    borderColor: '#FFFFFF',
    shadowColor: '#FF5722',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 15,
  },
  cartCounterText: {
    color: '#FFFFFF',
    fontSize: isTablet ? 14 : 12,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    includeFontPadding: false,
    lineHeight: isTablet ? 16 : 14,
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
    fontWeight: '400',
    color: '#374151',
    marginLeft: 12,
    letterSpacing: 0.8,
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
    fontWeight: '300',
    color: '#9CA3AF',
    letterSpacing: 0.3,
  },
  cartTotalHeader: {
    fontSize: 20,
    fontWeight: '400',
    color: '#374151',
    letterSpacing: 0.5,
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
    fontWeight: '400',
    color: '#374151',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '300',
    letterSpacing: 0.3,
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
    fontWeight: '400',
    color: '#374151',
    marginHorizontal: 20,
    minWidth: 20,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  emptyCartContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyCartText: {
    fontSize: 20,
    fontWeight: '400',
    color: '#9CA3AF',
    marginTop: 20,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  emptyCartSubtext: {
    fontSize: 16,
    fontWeight: '300',
    color: '#D1D5DB',
    letterSpacing: 0.3,
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
    fontWeight: '400',
    color: '#374151',
    letterSpacing: 0.5,
  },
  cartTotalAmount: {
    fontSize: 24,
    fontWeight: '500',
    color: '#374151',
    letterSpacing: 0.8,
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
