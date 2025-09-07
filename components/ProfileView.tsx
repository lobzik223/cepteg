import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface ProfileViewProps {
  onBackPress: () => void;
}

interface SettingsRowProps {
  icon: string;
  title: string;
  subtitle: string;
  hasChevron?: boolean;
  onPress?: () => void;
}

interface SettingsToggleRowProps {
  icon: string;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

interface StatCardProps {
  icon: string;
  title: string;
  value: string;
  color: string;
}

function SettingsRow({ icon, title, subtitle, hasChevron = true, onPress }: SettingsRowProps) {
  return (
    <TouchableOpacity style={styles.settingsRow} onPress={onPress} disabled={!onPress}>
      <View style={styles.settingsRowContent}>
        <Ionicons name={icon as any} size={isTablet ? 26 : 20} color="#666" style={styles.settingsIcon} />
        <View style={styles.settingsTextContainer}>
          <Text style={styles.settingsTitle}>{title}</Text>
          <Text style={styles.settingsSubtitle}>{subtitle}</Text>
        </View>
        {hasChevron && (
          <Ionicons name="chevron-forward" size={isTablet ? 18 : 14} color="#999" />
        )}
      </View>
    </TouchableOpacity>
  );
}

function SettingsToggleRow({ icon, title, subtitle, value, onValueChange }: SettingsToggleRowProps) {
  return (
    <View style={styles.settingsRow}>
      <View style={styles.settingsRowContent}>
        <Ionicons name={icon as any} size={isTablet ? 26 : 20} color="#666" style={styles.settingsIcon} />
        <View style={styles.settingsTextContainer}>
          <Text style={styles.settingsTitle}>{title}</Text>
          <Text style={styles.settingsSubtitle}>{subtitle}</Text>
        </View>
        <Switch 
          value={value} 
          onValueChange={onValueChange}
          trackColor={{ false: '#E5E5E5', true: '#007AFF' }}
          thumbColor={value ? '#fff' : '#f4f3f4'}
        />
      </View>
    </View>
  );
}

function StatCard({ icon, title, value, color }: StatCardProps) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statIconContainer}>
        <Ionicons name={icon as any} size={isTablet ? 30 : 24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function ProfileView({ onBackPress }: ProfileViewProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Minimal Background */}
      <View style={styles.minimalBackground} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" size={isTablet ? 30 : 24} color="#333" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="settings-outline" size={isTablet ? 30 : 24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User profile */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarGradient}>
              <Ionicons name="person" size={isTablet ? 60 : 50} color="#666" />
            </View>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Coffee Lover</Text>
            <Text style={styles.userEmail}>coffee.lover@example.com</Text>
            <View style={styles.userBadge}>
              <Ionicons name="star" size={isTablet ? 20 : 16} color="#999" />
              <Text style={styles.badgeText}>Premium Member</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={isTablet ? 20 : 16} color="#666" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Statistics */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Activity</Text>
          <View style={styles.statsContainer}>
            <StatCard
              icon="cafe"
              title="Orders"
              value="24"
              color="#666"
            />
            <StatCard
              icon="star"
              title="Reviews"
              value="12"
              color="#666"
            />
            <StatCard
              icon="heart"
              title="Favorites"
              value="8"
              color="#666"
            />
          </View>
        </View>

        {/* Main settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsGroup}>
            <SettingsRow
              icon="card-outline"
              title="Payment Methods"
              subtitle="Manage your cards"
              onPress={() => {}}
            />
            <View style={styles.separator} />
            <SettingsRow
              icon="time-outline"
              title="Order History"
              subtitle="View past orders"
              onPress={() => {}}
            />
            <View style={styles.separator} />
            <SettingsRow
              icon="heart-outline"
              title="Favorites"
              subtitle="Your favorite drinks"
              onPress={() => {}}
            />
            <View style={styles.separator} />
            <SettingsRow
              icon="gift-outline"
              title="Rewards"
              subtitle="Earn points and rewards"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingsGroup}>
            <SettingsToggleRow
              icon="notifications-outline"
              title="Push Notifications"
              subtitle="Order updates & offers"
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
            <View style={styles.separator} />
            <SettingsToggleRow
              icon="location-outline"
              title="Location Services"
              subtitle="Find nearby cafes"
              value={locationEnabled}
              onValueChange={setLocationEnabled}
            />
          </View>
        </View>

        {/* About app */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.settingsGroup}>
            <SettingsRow
              icon="help-circle-outline"
              title="Help & Support"
              subtitle="Get help with the app"
              onPress={() => {}}
            />
            <View style={styles.separator} />
            <SettingsRow
              icon="information-circle-outline"
              title="App Version"
              subtitle="1.0.0"
              hasChevron={false}
            />
            <View style={styles.separator} />
            <SettingsRow
              icon="log-out-outline"
              title="Sign Out"
              subtitle="Sign out of your account"
              onPress={() => {}}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  minimalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backText: {
    fontSize: 17,
    color: '#333',
    marginLeft: 4,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  headerAction: {
    flex: 1,
    alignItems: 'flex-end',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    marginTop: 80,
    marginHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    marginLeft: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  editButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statsSection: {
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statContent: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  settingsGroup: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingsRow: {
    backgroundColor: '#fff',
  },
  settingsRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  settingsIcon: {
    width: 24,
    marginRight: 16,
  },
  settingsTextContainer: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  settingsSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 60,
  },
});
