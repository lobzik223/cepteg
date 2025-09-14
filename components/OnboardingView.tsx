import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

interface OnboardingViewProps {
  onComplete: () => void;
}


interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: 'cafe' | 'pricetag' | 'globe';
  color: string;
  backgroundImage?: any;
}

//test branch
export default function OnboardingView({ onComplete }: OnboardingViewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const slides: Slide[] = [
    {
      id: 1,
      title: 'Convenient Orders',
      subtitle: 'Order in advance at any cafe or restaurant',
      description: 'No more waiting in line. Place your order in advance and pick it up at a convenient time.',
      icon: 'cafe',
      color: '#8B5CF6',
      backgroundImage: require('../assets/images/ba41979f79e8dcc9ae5858850eb5a47a.jpg'),
    },
    {
      id: 2,
      title: 'Promocodes & Discounts',
      subtitle: 'Special offers from partners',
      description: 'Get exclusive discounts, promocodes and special offers from your favorite establishments.',
      icon: 'pricetag',
      color: '#10B981',
      backgroundImage: require('../assets/images/454248c892d14ff7e8cd99d1df641787.jpg'),
    },
    {
      id: 3,
      title: 'Global Network',
      subtitle: 'Expanding worldwide',
      description: 'We are expanding globally! After pressing "Start", you will be taken to scan the QR code of a cafe that is connected to our app. Access menus from cafes and restaurants around the world.',
      icon: 'globe',
      color: '#3B82F6',
      backgroundImage: require('../assets/images/25e96aa23181debb60fc90c9f34c32d0.jpg'),
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollViewRef.current?.scrollTo({
        x: nextSlide * width,
        animated: true,
      });
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {slides.map((slide, index) => (
          <View key={slide.id} style={styles.slide}>
            {/* Background with photo or color */}
            <View style={styles.backgroundPlaceholder}>
              {slide.backgroundImage ? (
                <>
                  <Image 
                    source={slide.backgroundImage} 
                    style={styles.backgroundImage}
                    resizeMode="cover"
                  />
                  <View style={styles.backgroundOverlay}>
                    <View style={styles.backgroundPattern}>
                      <Ionicons name={slide.icon} size={120} color={slide.color + '40'} />
                    </View>
                  </View>
                </>
              ) : (
                <View style={[styles.backgroundPattern, { backgroundColor: slide.color + '20' }]}>
                  <Ionicons name={slide.icon} size={120} color={slide.color + '40'} />
                </View>
              )}
            </View>

            {/* Header with skip button - overlaid on background */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Ionicons name="globe" size={24} color="#fff" />
                <Text style={styles.appName}>Cepteg</Text>
              </View>
              <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.slideContent}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                <Ionicons name={slide.icon} size={isTablet ? 48 : 40} color="#fff" />
              </View>

              <Text style={styles.slideTitle}>{slide.title}</Text>
              <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
              <Text style={styles.slideDescription}>{slide.description}</Text>
            </View>

            {/* Bottom section with pagination and button - overlaid on background */}
            <View style={styles.bottomSection}>
              {/* Pagination dots */}
              <View style={styles.pagination}>
                {slides.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === currentSlide && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>

              {/* Action button */}
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>
                  {currentSlide === slides.length - 1 ? 'Start' : 'Continue'}
                </Text>
                <Ionicons 
                  name={currentSlide === slides.length - 1 ? 'play' : 'arrow-forward'} 
                  size={20} 
                  color="#fff" 
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    height: height,
    position: 'relative',
  },
  backgroundPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundPattern: {
    opacity: 0.1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 120,
    paddingBottom: 180,
  },
  iconContainer: {
    width: isTablet ? 100 : 80,
    height: isTablet ? 100 : 80,
    borderRadius: isTablet ? 50 : 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  slideTitle: {
    fontSize: isTablet ? 32 : 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: isTablet ? 40 : 36,
  },
  slideSubtitle: {
    fontSize: isTablet ? 20 : 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
    lineHeight: isTablet ? 28 : 24,
  },
  slideDescription: {
    fontSize: isTablet ? 18 : 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: isTablet ? 26 : 22,
    maxWidth: isTablet ? 500 : 300,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#333',
    width: 24,
  },
  nextButton: {
    backgroundColor: '#333',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});
