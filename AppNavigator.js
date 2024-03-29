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
import AsthmaActionPlan from './pages/AsthmaActionPlan';
import AsthmaActivityPage from './pages/AsthmaActivity';
import Setting from './pages/Setting';
import MedicinePage from './pages/Medicine';
import RegisterSuccessfulPage from './pages/RegisterSuccessful';
import Notification from './pages/Notification';
import Profile from './pages/Profile';
import ZonePage from './pages/ZonePage';
import ResultACT from './pages/ResultACT';
import Chart from './components/Graph';

const HomeStack = createStackNavigator();
const headerStyle = {
  headerStyle: { backgroundColor: '#517EB9' },
  headerTintColor: '#FFF',
  headerTitleStyle: { fontFamily: 'Prompt-Medium', fontSize: 25 },
}
export const HomeStackScreen = ({navigation}) => {
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
          headerRight: () => (
            <Icon
              name="notifications-sharp"
              size={30}
              color='#F1EAE4'
              onPress={() => navigation.navigate("Notification")}
            />),
          headerRightContainerStyle: { paddingHorizontal: 12 },
        }}
      />
      <HomeStack.Screen name="Peak Flow" component={PeakFlowPage} />
      <HomeStack.Screen name="Asthma Activity" component={AsthmaActivityPage} />
      <HomeStack.Screen name="Inhaler" component={InhalerPage} />
      <HomeStack.Screen name="Calendar" component={Calendar} />
      <HomeStack.Screen name="Asthma Control Test" component={AsthmaControlTest} />
      <HomeStack.Screen name="Asthma Action Plan" component={AsthmaActionPlan} />
      <HomeStack.Screen name="Zone" component={ZonePage} />
      <HomeStack.Screen name="Result ACT" component={ResultACT} />
      <HomeStack.Screen name="Home" component={HomePage} />
      <HomeStack.Screen name="Notification" component={Notification} />
      <HomeStack.Screen name="Chart" component={Chart} />
      <HomeStack.Screen name="Air Quality" component={AirQualityPage} />
      <HomeStack.Screen name="Health" component={HealthPage} />
      <HomeStack.Screen
        name="RegisterSuccessful" // add the RegisterSuccessful screen
        component={RegisterSuccessfulPage}
        options={{ headerShown: false }} // hide the header for the RegisterSuccessful screen
      />
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
      <ListStatusStack.Screen name="Peak Flow" component={PeakFlowPage} />
      <ListStatusStack.Screen name="Calendar" component={Calendar} />
      <ListStatusStack.Screen name="Asthma Activity" component={AsthmaActivityPage} />
      <ListStatusStack.Screen name="Inhaler" component={InhalerPage} />
      <ListStatusStack.Screen name="Medicine" component={MedicinePage} />
    </ListStatusStack.Navigator>
  );
}

const CalendarStack = createStackNavigator();
export const CalendarStackScreen = () => {
  return (
    <CalendarStack.Navigator screenOptions={headerStyle}>
      <CalendarStack.Screen name="Calendar" component={Calendar} />
      <CalendarStack.Screen name="Tracker" component={TrackerPage} />      
      <ListStatusStack.Screen name="Peak Flow" component={PeakFlowPage} />
      <ListStatusStack.Screen name="Asthma Activity" component={AsthmaActivityPage} />
      <ListStatusStack.Screen name="Inhaler" component={InhalerPage} />
      <ListStatusStack.Screen name="Medicine" component={MedicinePage} />

    </CalendarStack.Navigator>
  );
}
const SettingStack = createStackNavigator();
export const SettingStackScreen = () => {
  return (
    <SettingStack.Navigator screenOptions={headerStyle}>
      <SettingStack.Screen name="Setting" component={Setting} />
      <SettingStack.Screen name="Profile" component={Profile} />
    </SettingStack.Navigator>
  );
}