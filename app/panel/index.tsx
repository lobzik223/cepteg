import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Redirect, router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../_src/context/AuthContext';

import Categories from './Categories';
import Dashboard from './Dashboard';
import Orders from './Orders';
import Products from './Products';
import Tables from './Tables';
import Users from './Users';
import Cafes from './cafes';

const Drawer = createDrawerNavigator();

export default function Panel() {
  const { user,ready } = useAuth();
   const [drawerOpen, setDrawerOpen] = useState(true);
  console.log('user',user)

  const menuItems = [
     { name: 'Dashboard', icon: 'grid-outline', component: Dashboard },
     { name: 'Categories', icon: 'list-outline', component: Categories },
     { name: 'Products', icon: 'pricetag-outline', component: Products },
     { name: 'Tables', icon: 'restaurant-outline', component: Tables },
     { name: 'Orders', icon: 'cart-outline', component: Orders },
     { name: 'Users', icon: 'people-outline', component: Users },
     { name: 'Cafes', icon: 'cafe-outline', component: Cafes, roles: ['CEPEG_ADMIN'] },
   ];

  const normalizedRole = (user?.role ?? 'GUEST').trim().toUpperCase();
const filteredMenuItems = menuItems.filter(it =>
    !it.roles || it.roles.some(r => r.trim().toUpperCase() === normalizedRole)
  );

  // ✅ Her koşulda var olan bir başlangıç ekranı seç (Dashboard varsa onu, yoksa ilkini)
  const initialRouteName =
    filteredMenuItems.find(it => it.name === 'Dashboard')?.name ??
    filteredMenuItems[0]?.name ??
    'Dashboard';

  // role değişince Drawer yeniden mount olsun (guest -> CEPEG_ADMIN)
 const drawerKey = ready ? `drawer-${normalizedRole || 'guest'}` : 'drawer-loading';

  // Auth guard: kullanıcı yoksa deklaratif yönlendirme
  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <SafeAreaView style={s.wrapper}>
      <Drawer.Navigator initialRouteName={initialRouteName}
        key={drawerKey}
        screenOptions={{
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#111',
          drawerType: 'permanent',
          drawerStyle: {
            width: drawerOpen ? 240 : 72,
            backgroundColor: '#fff',
          },
          headerLeft: () => null,
        }}
        drawerContent={(props) => (
          <CustomDrawerContent
            {...props}
            menuItems={filteredMenuItems}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
          />
        )}
      >
        {filteredMenuItems.map((item) => (
          <Drawer.Screen
            key={item.name}
            name={item.name}
            component={item.component}
            options={{
              drawerIcon: ({ color, size }) => (
                <Ionicons name={item.icon as any} size={size} color={color} />
              ),
            }}
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
  const { logout } = useAuth();
  const activeRoute = state?.routeNames?.[state?.index ?? 0];

  return (
    <DrawerContentScrollView contentContainerStyle={s.drawerScroll} scrollEnabled>
      <View style={s.brandRow}>
        <Text style={s.brandText}>{drawerOpen ? '☕ Cafe Admin' : 'CA'}</Text>
        <TouchableOpacity style={s.toggleBtn} onPress={() => setDrawerOpen((v: boolean) => !v)}>
          <Ionicons name="menu" size={22} color="#111" />
        </TouchableOpacity>
      </View>

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
            style={[s.drawerItem, focused && { backgroundColor: '#dbeafe' }]}
            labelStyle={[s.drawerLabel, focused && { color: '#2563eb', fontWeight: '700' }]}
            onPress={() => navigation.navigate(it.name)}
          />
        );
      })}

      <View style={s.footer}>
        <TouchableOpacity style={s.logoutBtn} onPress={() => { logout(); router.replace('/login' as any); }}>
          <Ionicons name="log-out-outline" size={18} color="#ef4444" />
          <Text style={s.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
        <Text style={s.footerText}>© {new Date().getFullYear()} CafeApp</Text>
      </View>
    </DrawerContentScrollView>
  );
}

/** --- Stil --- */
const s = StyleSheet.create({
  wrapper: { flex: 1 },
  skeletonSidebar: {
   backgroundColor: '#f3f4f6',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
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
  toggleBtn: { padding: 6, borderRadius: 8, backgroundColor: '#f3f4f6' },
  drawerItem: { marginHorizontal: 8, marginVertical: 2, borderRadius: 8 },
  drawerLabel: { fontSize: 15, color: '#111', fontWeight: '600' },
  footer: { marginTop: 'auto', paddingVertical: 14, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  footerText: { textAlign: 'center', color: '#6b7280', fontSize: 12 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10 },
  logoutText: { color: '#ef4444', fontWeight: '700' },
});
