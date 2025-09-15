import { Ionicons } from '@expo/vector-icons';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem
} from '@react-navigation/drawer';
import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import Categories from './Categories';
import Dashboard from './Dashboard';
import Orders from './Orders';
import Products from './Products';
import Tables from './Tables';
import Users from './Users';

const Drawer = createDrawerNavigator();

export default function Panel() {
  const [drawerOpen, setDrawerOpen] = useState(true);

  const menuItems = [
    { name: 'Dashboard', icon: 'grid-outline', component: Dashboard },
    { name: 'Categories', icon: 'list-outline', component: Categories },
    { name: 'Products', icon: 'pricetag-outline', component: Products },
    { name: 'Tables', icon: 'restaurant-outline', component: Tables },
    { name: 'Orders', icon: 'cart-outline', component: Orders },
    { name: 'Users', icon: 'people-outline', component: Users },
  ];

  return (
    <SafeAreaView style={s.wrapper}>
      <Drawer.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#111',
          drawerType: 'permanent',
          drawerStyle: {
            width: drawerOpen ? 240 : 72,
            backgroundColor: '#fff',
          },
          headerLeft: () => null, // default hamburger'ı kaldır
        }}
        drawerContent={(props) => (
          <CustomDrawerContent
            {...props}
            menuItems={menuItems}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
          />
        )}
      >
        {menuItems.map((item) => (
          <Drawer.Screen
            key={item.name}
            name={item.name}
            component={item.component}
          />
        ))}
      </Drawer.Navigator>
    </SafeAreaView>
  );
}

/** --- Özel Drawer --- */
function CustomDrawerContent({
  drawerOpen,
  setDrawerOpen,
  state,
  navigation,
  menuItems,
}: any) {
  const activeRoute = state.routeNames[state.index];

  return (
    <DrawerContentScrollView
      contentContainerStyle={s.drawerScroll}
      scrollEnabled={true}
    >
      {/* Üst başlık ve menü daralt/expand butonu */}
      <View style={s.brandRow}>
        <Text style={s.brandText}>
          {drawerOpen ? '☕ Cafe Admin' : 'CA'}
        </Text>
        <TouchableOpacity
          style={s.toggleBtn}
          onPress={() => setDrawerOpen((v: boolean) => !v)}
        >
          <Ionicons name="menu" size={22} color="#111" />
        </TouchableOpacity>
      </View>

      {/* Menü linkleri */}
      {menuItems.map((it: any) => {
        const focused = activeRoute === it.name;
        return (
          <DrawerItem
            key={it.name}
            label={drawerOpen ? it.name : ''}
            icon={() => (
              <Ionicons
                name={it.icon as any}
                size={22}
                color={focused ? '#2563eb' : '#6b7280'}
              />
            )}
            style={[
              s.drawerItem,
              focused && { backgroundColor: '#dbeafe' },
            ]}
            labelStyle={[
              s.drawerLabel,
              focused && { color: '#2563eb', fontWeight: '700' },
            ]}
            onPress={() => navigation.navigate(it.name)}
          />
        );
      })}

      {/* Footer */}
      <View style={s.footer}>
        <Text style={s.footerText}>© {new Date().getFullYear()} CafeApp</Text>
      </View>
    </DrawerContentScrollView>
  );
}

/** --- Stil --- */
const s = StyleSheet.create({
  wrapper: { flex: 1 },
  drawerScroll: { flex: 1, paddingTop: 0 },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  brandText: { fontSize: 18, fontWeight: '800', color: '#111' },
  toggleBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  drawerItem: {
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 8,
  },
  drawerLabel: {
    fontSize: 15,
    color: '#111',
    fontWeight: '600',
  },
  footer: {
    marginTop: 'auto',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 12,
  },
});
