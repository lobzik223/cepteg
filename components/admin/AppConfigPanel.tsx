import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { appConfigService } from '../../services/AppConfigService';
import { AppConfig, PromotionalCard } from '../../types/AppConfig';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface AppConfigPanelProps {
  onBack: () => void;
}

export default function AppConfigPanel({ onBack }: AppConfigPanelProps) {
  const [currentView, setCurrentView] = useState<'main' | 'promotional' | 'settings'>('main');
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);
  const [promotionalCards, setPromotionalCards] = useState<PromotionalCard[]>([]);
  const [loading, setLoading] = useState(false);

  // App settings form
  const [appName, setAppName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('');
  const [secondaryColor, setSecondaryColor] = useState('');
  const [currency, setCurrency] = useState('');
  const [currencySymbol, setCurrencySymbol] = useState('');

  // Promotional card form
  const [promoTitle, setPromoTitle] = useState('');
  const [promoDescription, setPromoDescription] = useState('');
  const [promoPrice, setPromoPrice] = useState('');
  const [promoDiscount, setPromoDiscount] = useState('');
  const [promoButtonText, setPromoButtonText] = useState('');
  const [promoIsActive, setPromoIsActive] = useState(true);
  const [promoCafeId, setPromoCafeId] = useState('demo_cafe_001');
  const [promoCafeName, setPromoCafeName] = useState('AKAFE');

  const loadData = async () => {
    setLoading(true);
    try {
      const config = await appConfigService.getAppConfig();
      const cards = await appConfigService.getPromotionalCards();
      
      setAppConfig(config);
      setPromotionalCards(cards);
      
      // Set form values
      setAppName(config.appName);
      setBusinessName(config.businessName);
      setPrimaryColor(config.primaryColor);
      setSecondaryColor(config.secondaryColor);
      setCurrency(config.currency);
      setCurrencySymbol(config.currencySymbol);
    } catch (error) {
      Alert.alert('Error', 'Failed to load app configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!appConfig) return;
    
    setLoading(true);
    try {
      await appConfigService.updateAppConfig({
        appName,
        businessName,
        primaryColor,
        secondaryColor,
        currency,
        currencySymbol,
      });
      
      Alert.alert('Success', 'App settings updated successfully');
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Failed to update app settings');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePromotionalCard = async () => {
    if (!promoTitle.trim()) {
      Alert.alert('Error', 'Please enter a title for the promotional card');
      return;
    }

    setLoading(true);
    try {
      await appConfigService.createPromotionalCard({
        cafeId: promoCafeId,
        cafeName: promoCafeName,
        title: promoTitle,
        description: promoDescription || undefined,
        price: promoPrice ? parseInt(promoPrice) * 100 : undefined, // Convert to kuruş
        discount: promoDiscount ? parseInt(promoDiscount) : undefined,
        buttonText: promoButtonText || undefined,
        isActive: promoIsActive,
        position: 'top',
        order: promotionalCards.length + 1,
      });
      
      Alert.alert('Success', 'Promotional card created successfully');
      
      // Reset form
      setPromoTitle('');
      setPromoDescription('');
      setPromoPrice('');
      setPromoDiscount('');
      setPromoButtonText('');
      setPromoIsActive(true);
      
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Failed to create promotional card');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePromotionalCard = async (id: string) => {
    Alert.alert(
      'Delete Promotional Card',
      'Are you sure you want to delete this promotional card?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await appConfigService.deletePromotionalCard(id);
              Alert.alert('Success', 'Promotional card deleted successfully');
              loadData();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete promotional card');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const renderMainView = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={isTablet ? 28 : 24} color="#4B5563" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Configuration</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setCurrentView('settings')}
          >
            <Ionicons name="settings-outline" size={isTablet ? 24 : 20} color="#4B5563" />
            <Text style={styles.menuItemText}>General Settings</Text>
            <Ionicons name="chevron-forward" size={isTablet ? 20 : 16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Management</Text>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setCurrentView('promotional')}
          >
            <Ionicons name="card-outline" size={isTablet ? 24 : 20} color="#4B5563" />
            <Text style={styles.menuItemText}>Promotional Cards</Text>
            <Ionicons name="chevron-forward" size={isTablet ? 20 : 16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Configuration</Text>
          {appConfig && (
            <View style={styles.configInfo}>
              <Text style={styles.configText}>App Name: {appConfig.appName}</Text>
              <Text style={styles.configText}>Business: {appConfig.businessName}</Text>
              <Text style={styles.configText}>Currency: {appConfig.currencySymbol}</Text>
              <Text style={styles.configText}>Promotional Cards: {promotionalCards.length}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );

  const renderSettingsView = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentView('main')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={isTablet ? 28 : 24} color="#4B5563" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>General Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formSection}>
          <Text style={styles.label}>App Name</Text>
          <TextInput
            style={styles.input}
            value={appName}
            onChangeText={setAppName}
            placeholder="Enter app name"
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Business Name</Text>
          <TextInput
            style={styles.input}
            value={businessName}
            onChangeText={setBusinessName}
            placeholder="Enter business name"
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Primary Color</Text>
          <TextInput
            style={styles.input}
            value={primaryColor}
            onChangeText={setPrimaryColor}
            placeholder="#4B5563"
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Secondary Color</Text>
          <TextInput
            style={styles.input}
            value={secondaryColor}
            onChangeText={setSecondaryColor}
            placeholder="#9CA3AF"
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Currency</Text>
          <TextInput
            style={styles.input}
            value={currency}
            onChangeText={setCurrency}
            placeholder="TRY"
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Currency Symbol</Text>
          <TextInput
            style={styles.input}
            value={currencySymbol}
            onChangeText={setCurrencySymbol}
            placeholder="₺"
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveSettings}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Settings'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderPromotionalView = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentView('main')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={isTablet ? 28 : 24} color="#4B5563" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Promotional Cards</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Create New Card</Text>
          
          <View style={styles.formSection}>
            <Text style={styles.label}>Cafe ID *</Text>
            <TextInput
              style={styles.input}
              value={promoCafeId}
              onChangeText={setPromoCafeId}
              placeholder="demo_cafe_001"
            />
            <Text style={styles.helperText}>AKAFE: 6 categories | Coffee House: 4 categories | Brew & Bean: 4 categories</Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Cafe Name *</Text>
            <TextInput
              style={styles.input}
              value={promoCafeName}
              onChangeText={setPromoCafeName}
              placeholder="AKAFE"
            />
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              value={promoTitle}
              onChangeText={setPromoTitle}
              placeholder="Enter promotional title"
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              value={promoDescription}
              onChangeText={setPromoDescription}
              placeholder="Enter description"
              multiline
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Price (TL)</Text>
            <TextInput
              style={styles.input}
              value={promoPrice}
              onChangeText={setPromoPrice}
              placeholder="120"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Discount (%)</Text>
            <TextInput
              style={styles.input}
              value={promoDiscount}
              onChangeText={setPromoDiscount}
              placeholder="50"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Button Text</Text>
            <TextInput
              style={styles.input}
              value={promoButtonText}
              onChangeText={setPromoButtonText}
              placeholder="Apply"
            />
          </View>

          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreatePromotionalCard}
            disabled={loading}
          >
            <Text style={styles.createButtonText}>
              {loading ? 'Creating...' : 'Create Card'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Existing Cards</Text>
          {promotionalCards.map((card) => (
            <View key={card.id} style={styles.cardItem}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardCafe}>{card.cafeName}</Text>
                <Text style={styles.cardStatus}>
                  {card.isActive ? 'Active' : 'Inactive'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeletePromotionalCard(card.id)}
              >
                <Ionicons name="trash-outline" size={isTablet ? 20 : 16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  switch (currentView) {
    case 'settings':
      return renderSettingsView();
    case 'promotional':
      return renderPromotionalView();
    default:
      return renderMainView();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 16 : 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: isTablet ? 16 : 12,
  },
  headerTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: isTablet ? 20 : 16,
  },
  section: {
    marginVertical: isTablet ? 20 : 16,
  },
  sectionTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: isTablet ? 16 : 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: isTablet ? 16 : 12,
    paddingHorizontal: isTablet ? 16 : 12,
    backgroundColor: '#F9FAFB',
    borderRadius: isTablet ? 12 : 8,
    marginBottom: isTablet ? 12 : 8,
  },
  menuItemText: {
    flex: 1,
    fontSize: isTablet ? 18 : 16,
    color: '#4B5563',
    marginLeft: isTablet ? 16 : 12,
  },
  configInfo: {
    backgroundColor: '#F9FAFB',
    padding: isTablet ? 16 : 12,
    borderRadius: isTablet ? 12 : 8,
  },
  configText: {
    fontSize: isTablet ? 16 : 14,
    color: '#6B7280',
    marginBottom: isTablet ? 8 : 4,
  },
  formSection: {
    marginBottom: isTablet ? 20 : 16,
  },
  label: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: isTablet ? 8 : 6,
  },
  helperText: {
    fontSize: isTablet ? 12 : 10,
    color: '#6B7280',
    marginTop: isTablet ? 4 : 2,
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: isTablet ? 12 : 8,
    paddingHorizontal: isTablet ? 16 : 12,
    paddingVertical: isTablet ? 12 : 10,
    fontSize: isTablet ? 16 : 14,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#4B5563',
    paddingVertical: isTablet ? 16 : 12,
    borderRadius: isTablet ? 12 : 8,
    alignItems: 'center',
    marginTop: isTablet ? 20 : 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#10B981',
    paddingVertical: isTablet ? 16 : 12,
    borderRadius: isTablet ? 12 : 8,
    alignItems: 'center',
    marginTop: isTablet ? 20 : 16,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: isTablet ? 12 : 10,
    paddingHorizontal: isTablet ? 16 : 12,
    backgroundColor: '#F9FAFB',
    borderRadius: isTablet ? 12 : 8,
    marginBottom: isTablet ? 8 : 6,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: isTablet ? 4 : 2,
  },
  cardCafe: {
    fontSize: isTablet ? 12 : 10,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: isTablet ? 4 : 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardStatus: {
    fontSize: isTablet ? 14 : 12,
    color: '#6B7280',
    marginTop: isTablet ? 4 : 2,
  },
  deleteButton: {
    padding: isTablet ? 8 : 6,
  },
});
