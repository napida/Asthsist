// import { View, Text, StyleSheet  } from 'react-native'
// import { NavigationContainer } from '@react-navigation/native';
// import React from 'react'
// import BottomNavBar from './components/BottomNavBar';
// import AppNavigator from './AppNavigator'

// const App = () => {
//   return (
//     <NavigationContainer>
//       <BottomNavBar />
//       {/* <AppNavigator /> */}
//     </NavigationContainer>
//   )
// }

// export default App

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomNavBar from './components/BottomNavBar';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import Login from './pages/Login';
import firebaseConfig from './database/firebaseDB'
import Register from './pages/Register';


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Stack = createStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) {
    return null;
  }

  return (
    <NavigationContainer>
      {user ? (
        <BottomNavBar />
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
          <Stack.Screen name="Register" component={Register} options={{headerShown:false}}/>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default App;
