import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import HomeScreen from '../pages/Home';
import SettingsScreen from '../pages/Setting'
import CalendarScreen from '../pages/Calendar';
import ListStatusScreen from '../pages/ListStatus';
import { BackHandler, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const backButton = () => (<Icon name="chevron-back" size={30} color='#FFF' />)
const notification = () => (<Icon name="notifications-off-sharp" size={30} color='#F1EAE4'/>)
const NavBar = () => {
    
// useFocusEffect(
//     React.useCallback(() => {
//         const onBackPress = () => {
//             navigation.navigate('ThirdPage');
//             // Return true to stop default back navigaton
//             // Return false to keep default back navigaton
//             return true;
//         };

//         // Add Event Listener for hardwareBackPress
//         BackHandler.addEventListener(
//             'hardwareBackPress',
//             onBackPress
//         );

//         return () => {
//             // Once the Screen gets blur Remove Event Listener
//             BackHandler.removeEventListener(
//                 'hardwareBackPress',
//                 onBackPress
//             );
//         };
//     }, []),
// );
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: { backgroundColor: '#517EB9', height: 60 },
                tabBarInactiveTintColor: '#FFF',
                tabBarActiveTintColor: '#F5E1A4',
                headerStyle: { backgroundColor: '#517EB9' },
                headerTintColor: '#FFF',
                headerTitleStyle: { fontFamily: 'Prompt-Medium', fontSize: 25 }
            }}>
            <Tab.Screen
                name='Home'
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (<Icon
                        name="home-outline"
                        size={size}
                        color={color}
                    />),
                    headerTitle: 'Asthsist',
                    headerTitleAlign: 'center',
                    headerRight: notification,
                    headerRightContainerStyle: { paddingHorizontal: 12 },
                    // headerShown:false
                }} />
            <Tab.Screen
                name='ListStatus'
                component={ListStatusScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons
                        name="list-status"
                        size={size}
                        color={color}
                    />),
                    headerLeft: backButton,
                }} />
            <Tab.Screen
                name='Calendar'
                component={CalendarScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (<Icon
                        name="calendar-outline"
                        size={size}
                        color={color}
                    />),
                    headerLeft: backButton,
                }} />
            <Tab.Screen
                name='Settings'
                component={SettingsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (<Icon
                        name="settings-outline"
                        size={size}
                        color={color}
                    />),
                    headerLeft: backButton,
                }} />
        </Tab.Navigator>
    );
}

export default NavBar