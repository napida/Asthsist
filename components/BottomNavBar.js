import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {CalendarStackScreen, HomeStackScreen, ListStatusStackScreen, SettingStackScreen} from '../AppNavigator';
// import SettingsScreen from '../pages/Setting'

const Tab = createBottomTabNavigator();
const backButton = () => (<Icon name="chevron-back" size={30} color='#FFF' />)
const notification = () => (<Icon name="notifications-off-sharp" size={30} color='#F1EAE4'/>)

function BottomNavBar() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                tabBarHideOnKeyboard: true,
                tabBarStyle: { backgroundColor: '#517EB9', height: 60 },
                tabBarInactiveTintColor: '#FFF',
                tabBarActiveTintColor: '#F5E1A4',
                headerStyle: { backgroundColor: '#517EB9' },
                headerTintColor: '#FFF',
                headerTitleStyle: { fontFamily: 'Prompt-Medium', fontSize: 25 },
                headerShown: false,
            }}>
            <Tab.Screen
                name='Home Tab'
                component={HomeStackScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (<Icon
                        name="home-outline"
                        size={size}
                        color={color}
                    />) 
                }}/>
            <Tab.Screen
                name='List Status Tab'
                component={ListStatusStackScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons
                        name="list-status"
                        size={size}
                        color={color}
                    />),
                }} />
            <Tab.Screen
                name='Calendar Tab'
                component={CalendarStackScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (<Icon
                        name="calendar-outline"
                        size={size}
                        color={color}
                    />),
                }} />
            <Tab.Screen
                name='Settings Tab'
                component={SettingStackScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (<Icon
                        name="settings-outline"
                        size={size}
                        color={color}
                    />),
                }} />
        </Tab.Navigator>
    );
}

export default BottomNavBar