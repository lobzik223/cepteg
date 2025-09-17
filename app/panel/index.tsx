import { createDrawerNavigator } from '@react-navigation/drawer';
import { Redirect } from 'expo-router';
import React from 'react';
import { useAuth } from '../../_src/context/AuthContext';


const Drawer = createDrawerNavigator();

export default function Panel() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

}

