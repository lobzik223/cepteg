// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '../_src/context/AuthContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  if (!loaded) return null;

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {/* Root Stack sadece sayfaların başlık/opsiyonlarını yönetir */}
        <Stack screenOptions={{ headerShown: false }}>
          {/* DİKKAT: Grup adı parantezli olmalı */}
          <Stack.Screen name="(panel)" />
          <Stack.Screen name="login" />
          <Stack.Screen name="+not-found" options={{ headerShown: true, title: 'Not Found' }} />
        </Stack>

        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </AuthProvider>
  );
}
