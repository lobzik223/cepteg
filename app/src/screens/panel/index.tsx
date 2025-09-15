import { Ionicons } from '@expo/vector-icons';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Categories from './Categories';
import Dashboard from './Dashboard';
import Orders from './Orders';
import Products from './Products';
import Tables from './Tables';
import Users from './Users';

const Drawer = createDrawerNavigator();

export default function Panel() {
  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <View style={styles.container}>
      <Drawer.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: '#f8f9fa' },
          headerTintColor: '#111',
          drawerType: 'permanent',
          drawerStyle: { width: drawerOpen ? 240 : 70, backgroundColor: '#fff' },
        }}
        drawerContent={(props) => (
          <CustomDrawerContent {...props} drawerOpen={drawerOpen} />
        )}
      >
        <Drawer.Screen name="Dashboard" component={Dashboard} />
        <Drawer.Screen name="Categories" component={Categories} />
        <Drawer.Screen name="Products" component={Products} />
        <Drawer.Screen name="Tables" component={Tables} />
        <Drawer.Screen name="Orders" component={Orders} />
        <Drawer.Screen name="Users" component={Users} />
      </Drawer.Navigator>

      {/* Menü daralt / genişlet butonu */}
      <TouchableOpacity
        style={styles.toggle}
        onPress={() => setDrawerOpen(!drawerOpen)}
      >
        <Ionicons name="menu" size={24} color="#111" />
      </TouchableOpacity>
    </View>
  );
}

function CustomDrawerContent({
  drawerOpen,
  navigation,
  state,
}: DrawerContentComponentProps & { drawerOpen: boolean }) {
  const items = [
    { label: 'Dashboard', icon: 'grid-outline' },
    { label: 'Categories', icon: 'list-outline' },
    { label: 'Products', icon: 'pricetag-outline' },
    { label: 'Tables', icon: 'restaurant-outline' },
    { label: 'Orders', icon: 'cart-outline' },
    { label: 'Users', icon: 'people-outline' },
  ];

  // hangi route seçili?
  const activeRoute = state.routeNames[state.index];

  return (
    <DrawerContentScrollView contentContainerStyle={styles.drawerContent}>
      <Text style={styles.brand}>{drawerOpen ? 'Admin Panel' : 'AP'}</Text>

      {items.map((it) => {
        const focused = activeRoute === it.label;
        return (
          <DrawerItem
            key={it.label}
            label={drawerOpen ? it.label : ''}
            icon={() => (
              <Ionicons
                name={it.icon as any}
                size={22}
                color={focused ? '#3b82f6' : '#6b7280'} // aktif olan mavi, diğerleri gri
              />
            )}
            labelStyle={[
              styles.label,
              focused && { color: '#3b82f6', fontWeight: '700' },
            ]}
            style={[
              styles.drawerItem,
              focused && { backgroundColor: '#e0f2fe' }, // aktif arka plan hafif mavi
            ]}
            onPress={() => navigation.navigate(it.label)}
          />
        );
      })}

      <View style={styles.footer}>
        <Text style={styles.footerText}>© {new Date().getFullYear()}</Text>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  toggle: {
    position: 'absolute',
    top: 15,
    left: 15,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  drawerContent: {
    flex: 1,
  },
  brand: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
    marginBottom: 20,
  },
  drawerItem: {
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 2,
  },
  label: {
    color: '#111',
    fontWeight: '600',
    fontSize: 15,
  },
  footer: {
    marginTop: 'auto',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerText: {
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'center',
  },
});
