import * as React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import NavBar from './components/NavBar';
import Health from './pages/Health';
import AirQuality from './pages/AirQuality';
import Tracker from './pages/Tracker';
import PeakFlowPage from './pages/PeakFlow';
import InhalerPage from './pages/Inhaler';
import CheckUpPage from './pages/CheckUp';

const Stack = createNativeStackNavigator();

function AppScreen() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>      
      <Stack.Screen name="NavBar" component={NavBar} />
      <Stack.Screen name="Health" component={Health} />
      <Stack.Screen name="AirQuality" component={AirQuality} />
      <Stack.Screen name="Tracker" component={Tracker} />
      <Stack.Screen name="PeakFlow" component={PeakFlowPage} />
      <Stack.Screen name="Inhaler" component={InhalerPage} />
      <Stack.Screen name="CheckUp" component={CheckUpPage} />
    </Stack.Navigator>
  );
}

export default AppScreen;