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
            <Ionicons name="cafe" size={isTablet ? 28 : 22} color="#359441" />
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
              <Ionicons name="checkmark-circle" size={14} color="#359441" />
            </View>
            <Text style={[styles.statText, styles.activeText]}>Active</Text>
          </View>
        </View>
      </View>
      
      {selectedCafe?.id === item.id && (
        <View style={styles.selectedIndicator}>
          <View style={styles.selectedIconContainer}>
            <Ionicons name="checkmark-circle" size={20} color="#359441" />
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
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={isTablet ? 32 : 28} color="#376138" />
          </TouchableOpacity>
          
          <View style={styles.headerTitle}>
            <Text style={styles.headerTitleText}>Choose Location</Text>
            <Text style={styles.headerSubtitle}>{networkName}</Text>
          </View>
          
          <TouchableOpacity style={styles.qrButton}>
            <Ionicons name="qr-code" size={isTablet ? 32 : 28} color="#376138" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Network Info */}
      <View style={styles.networkInfo}>
        <View style={styles.networkIcon}>
          <Ionicons name="business" size={isTablet ? 40 : 32} color="#FFFFFF" />
        </View>
        <View style={styles.networkDetails}>
          <Text style={styles.networkName}>{networkName}</Text>
          <Text style={styles.networkStats}>
            {filteredCafes.length} of {cafes.length} location{cafes.length !== 1 ? 's' : ''} available
          </Text>
        </View>
      </View>

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
    backgroundColor: '#fff',
    paddingTop: isTablet ? 20 : 16,
    paddingBottom: isTablet ? 20 : 16,
    paddingHorizontal: isTablet ? 24 : 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: '600',
    color: '#376138',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: isTablet ? 14 : 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  backButton: {
    width: isTablet ? 48 : 44,
    height: isTablet ? 48 : 44,
    borderRadius: isTablet ? 24 : 22,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0,
  },
  qrButton: {
    width: isTablet ? 48 : 44,
    height: isTablet ? 48 : 44,
    borderRadius: isTablet ? 24 : 22,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0,
  },
  networkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#359441',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    minHeight: 100,
    shadowColor: '#359441',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
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
    color: '#376138',
    marginTop: 20,
    marginBottom: 15,
  },
  listContent: {
    paddingBottom: 100,
  },
  cafeItem: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  selectedCafeItem: {
    borderColor: '#359441',
    backgroundColor: '#F0FDF4',
    shadowColor: '#359441',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
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
    backgroundColor: '#DCFCE7',
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
    color: '#376138',
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
    color: '#376138',
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
    color: '#376138',
    fontWeight: '500',
  },
  activeText: {
    color: '#376138',
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
    color: '#376138',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: isTablet ? 14 : 12,
    color: '#376138',
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
    backgroundColor: '#359441',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#359441',
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
