import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { cafeVideoService, VideoConfig } from '../../services/CafeVideoService';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface CafeVideoConfigPanelProps {
  cafeId: string;
  cafeName: string;
  currentConfig?: VideoConfig;
  onConfigUpdate?: (config: VideoConfig) => void;
  onBack?: () => void;
}

export default function CafeVideoConfigPanel({
  cafeId,
  cafeName,
  currentConfig,
  onConfigUpdate,
  onBack,
}: CafeVideoConfigPanelProps) {
  const [selectedConfig, setSelectedConfig] = useState<VideoConfig>(currentConfig || {});
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const presets = cafeVideoService.getVideoPresets();

  const handlePresetSelect = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      setSelectedConfig(preset.config);
      setSelectedPreset(presetId);
    }
  };

  const handleSave = async () => {
    const validation = cafeVideoService.validateVideoConfig(selectedConfig);
    
    if (!validation.isValid) {
      Alert.alert('Invalid Configuration', validation.errors.join('\n'));
      return;
    }

    const success = await cafeVideoService.updateVideoConfig(cafeId, selectedConfig);
    
    if (success) {
      Alert.alert('Success', 'Video configuration updated successfully!');
      onConfigUpdate?.(selectedConfig);
    } else {
      Alert.alert('Error', 'Failed to update video configuration');
    }
  };

  const handleCustomConfig = () => {
    Alert.alert(
      'Custom Configuration',
      'Custom video configuration will be available in future updates. For now, please use the presets.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Video Configuration</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Cafe Info */}
      <View style={styles.cafeInfo}>
        <Ionicons name="cafe" size={24} color="#666" />
        <Text style={styles.cafeName}>{cafeName}</Text>
      </View>

      {/* Current Configuration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Configuration</Text>
        <View style={styles.configCard}>
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>Video Source:</Text>
            <Text style={styles.configValue}>
              {selectedConfig.videoUrl ? 'Server URL' : 
               selectedConfig.localVideoPath ? 'Local File' : 'Default'}
            </Text>
          </View>
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>Position:</Text>
            <Text style={styles.configValue}>
              {selectedConfig.videoPosition || 'center'}
            </Text>
          </View>
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>Fallback Colors:</Text>
            <View style={styles.colorPreview}>
              {selectedConfig.fallbackColors?.map((color, index) => (
                <View
                  key={index}
                  style={[styles.colorDot, { backgroundColor: color }]}
                />
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Video Presets */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Video Presets</Text>
        <Text style={styles.sectionDescription}>
          Choose a preset configuration for your cafe's main screen video
        </Text>
        
        {presets.map((preset) => (
          <TouchableOpacity
            key={preset.id}
            style={[
              styles.presetCard,
              selectedPreset === preset.id && styles.selectedPresetCard
            ]}
            onPress={() => handlePresetSelect(preset.id)}
          >
            <View style={styles.presetHeader}>
              <Text style={styles.presetName}>{preset.name}</Text>
              {selectedPreset === preset.id && (
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              )}
            </View>
            
            <View style={styles.presetDetails}>
              <View style={styles.presetRow}>
                <Text style={styles.presetLabel}>Position:</Text>
                <Text style={styles.presetValue}>{preset.config.videoPosition}</Text>
              </View>
              <View style={styles.presetRow}>
                <Text style={styles.presetLabel}>Colors:</Text>
                <View style={styles.colorPreview}>
                  {preset.config.fallbackColors?.map((color, index) => (
                    <View
                      key={index}
                      style={[styles.colorDot, { backgroundColor: color }]}
                    />
                  ))}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Custom Configuration */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.customButton} onPress={handleCustomConfig}>
          <Ionicons name="settings" size={20} color="#666" />
          <Text style={styles.customButtonText}>Custom Configuration</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Save Button */}
      <View style={styles.saveSection}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="save" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>Save Configuration</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  backButton: {
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
  cafeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cafeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  configCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  configLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  configValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  colorPreview: {
    flexDirection: 'row',
    gap: 4,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  presetCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  selectedPresetCard: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  presetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  presetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  presetDetails: {
    gap: 8,
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  presetLabel: {
    fontSize: 14,
    color: '#666',
  },
  presetValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  customButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  saveSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
});
