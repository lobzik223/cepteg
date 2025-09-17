import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Redirect, router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../_src/context/AuthContext';

export default function PanelLayout() {
  const { user, ready } = useAuth();
  const [open, setOpen] = useState(true);

  if (!ready) return null;
  if (!user) return <Redirect href="/login" />;

  const role = String(user.role ?? 'GUEST').trim().toUpperCase();
  const isAdmin = role === 'CEPEG_ADMIN';

  // Drawer içinde TÜM ekranlar TANIMLI kalır (initialRouteName hatası böylece biter)
  // Menüde görünürlük ayrı kontrol edilir (drawerContent).

  return (
    <Drawer
      initialRouteName="dashboard" // <= app/panel/dashboard.tsx ile birebir
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#111',
        drawerType: 'permanent',
        drawerStyle: { width: open ? 240 : 72, backgroundColor: '#fff' },
        headerLeft: () => null,
      }}
      drawerContent={(props) => (
        <CustomDrawerContent {...props} open={open} setOpen={setOpen} isAdmin={isAdmin} />
      )}
    >
      <Drawer.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          drawerIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="categories"
        options={{
          title: 'Categories',
          drawerIcon: ({ color, size }) => <Ionicons name="list-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="products"
        options={{
          title: 'Products',
          drawerIcon: ({ color, size }) => <Ionicons name="pricetag-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="tables"
        options={{
          title: 'Tables',
          drawerIcon: ({ color, size }) => <Ionicons name="restaurant-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="orders"
        options={{
          title: 'Orders',
          drawerIcon: ({ color, size }) => <Ionicons name="cart-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="users"
        options={{
          title: 'Users',
          drawerIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="cafes"
        options={{
          title: 'Cafes',
          // Admin değilse menüde gizle (ekran TANIMLI kalsın!)
          drawerItemStyle: isAdmin ? undefined : { display: 'none' },
          drawerIcon: ({ color, size }) => <Ionicons name="cafe-outline" size={size} color={color} />,
        }}
      />
    </Drawer>
  );
}

function CustomDrawerContent(props: any) {
  const { open, setOpen, isAdmin, state, navigation } = props;
  const { logout } = useAuth();

  // Menü öğelerini tek yerde tanımla (görünürlüğü burada filtrele)
  const items = useMemo(
    () => [
      { name: 'dashboard',  title: 'Dashboard',  icon: 'grid-outline' },
      { name: 'categories', title: 'Categories', icon: 'list-outline' },
      { name: 'products',   title: 'Products',   icon: 'pricetag-outline' },
      { name: 'tables',     title: 'Tables',     icon: 'restaurant-outline' },
      { name: 'orders',     title: 'Orders',     icon: 'cart-outline' },
      { name: 'users',      title: 'Users',      icon: 'people-outline' },
      ...(isAdmin ? [{ name: 'cafes', title: 'Cafes', icon: 'cafe-outline' }] : []),
    ],
    [isAdmin]
  );

  const active = state?.routeNames?.[state?.index ?? 0];

  return (
    <DrawerContentScrollView contentContainerStyle={s.drawerScroll} scrollEnabled>
      <View style={s.brandRow}>
        <Text style={s.brandText}>{open ? '☕ Cafe Admin' : 'CA'}</Text>
        <TouchableOpacity style={s.toggleBtn} onPress={() => setOpen((v: boolean) => !v)}>
          <Ionicons name="menu" size={22} color="#111" />
        </TouchableOpacity>
      </View>

      {items.map((it) => {
        const focused = active === it.name;
        return (
          <DrawerItem
            key={it.name}
            label={open ? it.title : ''}
            icon={() => (
              <Ionicons name={it.icon as any} size={22} color={focused ? '#2563eb' : '#6b7280'} />
            )}
            style={[s.drawerItem, focused && { backgroundColor: '#dbeafe' }]}
            labelStyle={[s.drawerLabel, focused && { color: '#2563eb', fontWeight: '700' }]}
            onPress={() => navigation.navigate(it.name)}
          />
        );
      })}

      <View style={s.footer}>
        <TouchableOpacity
          style={s.logoutBtn}
          onPress={async () => { await logout(); router.replace('/login'); }}
        >
          <Ionicons name="log-out-outline" size={18} color="#ef4444" />
          <Text style={s.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
        <Text style={s.footerText}>© {new Date().getFullYear()} CafeApp</Text>
      </View>
    </DrawerContentScrollView>
  );
}

const s = StyleSheet.create({
  drawerScroll: { flex: 1, paddingTop: 0 },
  brandRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb',
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
