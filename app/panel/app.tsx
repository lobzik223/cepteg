import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Panel from '../panel';
import Login from '../panel/login';
import { OnboardingView } from '../panel/OnboardingView';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Admin" component={Login} />
        <Stack.Screen name="Onboarding" component={OnboardingView} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Panel" component={Panel} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
