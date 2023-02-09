import { View, Text, StyleSheet  } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import React from 'react'
import BottomNavBar from './components/BottomNavBar';
import AppNavigator from './AppNavigator'

const App = () => {
  return (
    <NavigationContainer>
      <BottomNavBar />
      {/* <AppNavigator /> */}
    </NavigationContainer>
  )
}

export default App