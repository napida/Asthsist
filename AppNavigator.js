import * as React from 'react';
import Icon from 'react-native-vector-icons/Ionicons'
import PeakFlowPage from './pages/PeakFlow';
import InhalerPage from './pages/Inhaler';
import AsthmaControlTest from './pages/AsthmaControlTest';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './pages/Home';
import HealthPage from './pages/Health';
import TrackerPage from './pages/Tracker';
import AirQualityPage from './pages/AirQuality';
import ListStatusPage from './pages/ListStatus';
import Calendar from './pages/Calendar';

const notification = () => (<Icon name="notifications-sharp" size={30} color='#F1EAE4' />)
const HomeStack = createStackNavigator();
const headerStyle = {
  headerStyle: { backgroundColor: '#517EB9' },
  headerTintColor: '#FFF',
  headerTitleStyle: { fontFamily: 'Prompt-Medium', fontSize: 25 },
}
export const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator screenOptions={headerStyle}>
      <HomeStack.Screen name='Asthsist' component={HomePage}
        options={{
          tabBarIcon: ({ color, size }) => (<Icon
            name="home-outline"
            size={size}
            color={
              'black'
            }
          />),
          headerTitle: 'Asthsist',
          headerTitleAlign: 'center',
          headerRight: notification,
          headerRightContainerStyle: { paddingHorizontal: 12 },
        }}
      />
      <HomeStack.Screen name="PeakFlow" component={PeakFlowPage} />
      <HomeStack.Screen name="Inhaler" component={InhalerPage} />
      <HomeStack.Screen name="Calendar" component={Calendar} />
      <HomeStack.Screen name="Asthma Control Test" component={AsthmaControlTest} />
    </HomeStack.Navigator>
  );
}
const ListStatusStack = createStackNavigator();
export const ListStatusStackScreen = () => {
  return (
    <ListStatusStack.Navigator screenOptions={headerStyle}>
      <ListStatusStack.Screen name="List Status" component={ListStatusPage} />
      <ListStatusStack.Screen name="Health" component={HealthPage} />
      <ListStatusStack.Screen name="Air Quality" component={AirQualityPage} />
      <ListStatusStack.Screen name="Tracker" component={TrackerPage} />
      <ListStatusStack.Screen name="PeakFlow" component={PeakFlowPage} />
      <ListStatusStack.Screen name="Calendar" component={Calendar} />
    </ListStatusStack.Navigator>
  );
}

const CalendarStack = createStackNavigator();
export const CalendarStackScreen = () => {
  return (
    <CalendarStack.Navigator screenOptions={headerStyle}>
      <CalendarStack.Screen name="Calendar" component={Calendar} />
      <CalendarStack.Screen name="Tracker" component={TrackerPage} />
    </CalendarStack.Navigator>
  );
}