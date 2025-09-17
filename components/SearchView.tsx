import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
    Dimensions,
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Cafe } from '../services/CafeService';
import VideoBackground from './VideoBackground';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface SearchViewProps {
  networkName: string;
  cafes: Cafe[];
  onCafeSelected: (cafe: Cafe) => void;
  onClose: () => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  networkName,
  cafes,
  onCafeSelected,
  onClose,
}) => {
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter cafes based on search query
  const filteredCafes = useMemo(() => {
    if (!searchQuery.trim()) return cafes;
    
    const query = searchQuery.toLowerCase();
    return cafes.filter(cafe => 
      cafe.name.toLowerCase().includes(query) ||
      cafe.location.toLowerCase().includes(query) ||
      cafe.description?.toLowerCase().includes(query)
    );
  }, [cafes, searchQuery]);

  const handleCafeSelect = (cafe: Cafe) => {
    setSelectedCafe(cafe);
    onCafeSelected(cafe);
  };

  const renderCafeItem = ({ item }: { item: Cafe }) => (
    <TouchableOpacity
      style={[
        styles.cafeItem,
        selectedCafe?.id === item.id && styles.selectedCafeItem
      ]}
      onPress={() => handleCafeSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cafeInfo}>
        <View style={styles.cafeHeader}>
          <View style={styles.cafeIconContainer}>
            <Ionicons name="cafe" size={isTablet ? 28 : 22} color="#8B5CF6" />
          </View>
          <View style={styles.cafeDetails}>
            <Text style={styles.cafeName}>{item.name}</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={14} color="#6B7280" />
              <Text style={styles.cafeLocation}>{item.location}</Text>
            </View>
            {item.description && (
              <Text style={styles.cafeDescription} numberOfLines={2}>
                {item.description}
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.cafeStats}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons name="grid-outline" size={14} color="#6B7280" />
            </View>
            <Text style={styles.statText}>{item.categories?.length || 0} categories</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statIconContainer, styles.activeIconContainer]}>
              <Ionicons name="checkmark-circle" size={14} color="#10B981" />
            </View>
            <Text style={[styles.statText, styles.activeText]}>Active</Text>
          </View>
        </View>
      </View>
      
      {selectedCafe?.id === item.id && (
        <View style={styles.selectedIndicator}>
          <View style={styles.selectedIconContainer}>
            <Ionicons name="checkmark-circle" size={20} color="#8B5CF6" />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={isTablet ? 32 : 24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Choose Location</Text>
          <Text style={styles.headerSubtitle}>{networkName} Network</Text>
        </View>
        <View style={styles.placeholderButton} />
      </View>

      {/* Network Info */}
      <VideoBackground
        videoSource={require('../assets/videoforlocation.mp4')}
        style={styles.networkInfo}
        fallbackColors={['#F8FAFC', '#E5E7EB']}
      >
        <View style={styles.networkIcon}>
          <Ionicons name="business" size={isTablet ? 40 : 32} color="#FFFFFF" />
        </View>
        <View style={styles.networkDetails}>
          <Text style={styles.networkName}>{networkName}</Text>
          <Text style={styles.networkStats}>
            {filteredCafes.length} of {cafes.length} location{cafes.length !== 1 ? 's' : ''} available
          </Text>
        </View>
      </VideoBackground>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, city, or description..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Cafes List */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Available Locations</Text>
        <FlatList
          data={filteredCafes}
          renderItem={renderCafeItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search" size={isTablet ? 60 : 48} color="#D1D5DB" />
              <Text style={styles.emptyStateTitle}>No locations found</Text>
              <Text style={styles.emptyStateText}>
                Try searching with different keywords or check your spelling
              </Text>
            </View>
          }
        />
      </View>

      {/* Continue Button */}
      {selectedCafe && (
        <View style={styles.continueContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => handleCafeSelect(selectedCafe)}
          >
            <Text style={styles.continueButtonText}>
              Continue to {selectedCafe.name}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    width: isTablet ? 44 : 40,
    height: isTablet ? 44 : 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#000',
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: '#6B7280',
    fontSize: isTablet ? 14 : 12,
    marginTop: 2,
  },
  placeholderButton: {
    width: isTablet ? 44 : 40,
    height: isTablet ? 44 : 40,
  },
  networkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    minHeight: 100,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: isTablet ? 16 : 14,
    color: '#1F2937',
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  networkIcon: {
    width: isTablet ? 60 : 50,
    height: isTablet ? 60 : 50,
    borderRadius: isTablet ? 30 : 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  networkDetails: {
    flex: 1,
  },
  networkName: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  networkStats: {
    fontSize: isTablet ? 14 : 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 15,
  },
  listContent: {
    paddingBottom: 100,
  },
  cafeItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedCafeItem: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F8FAFC',
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cafeInfo: {
    flex: 1,
  },
  cafeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cafeIconContainer: {
    width: isTablet ? 48 : 40,
    height: isTablet ? 48 : 40,
    borderRadius: isTablet ? 24 : 20,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cafeDetails: {
    flex: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  cafeName: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  cafeLocation: {
    fontSize: isTablet ? 14 : 12,
    color: '#6B7280',
    marginLeft: 6,
    flex: 1,
  },
  cafeDescription: {
    fontSize: isTablet ? 13 : 11,
    color: '#9CA3AF',
    lineHeight: 16,
  },
  cafeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  activeIconContainer: {
    backgroundColor: '#ECFDF5',
  },
  statText: {
    fontSize: isTablet ? 12 : 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeText: {
    color: '#10B981',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  selectedIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: isTablet ? 14 : 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  continueContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  continueButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    marginRight: 8,
  },
});
