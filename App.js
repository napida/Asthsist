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
import RegisterSuccessfulPage from './pages/RegisterSuccessful';
import PushNotification from 'react-native-push-notification';
import BackgroundFetch from 'react-native-background-fetch';

const sendNotification = (title, message) => {
  PushNotification.localNotification({
    channelId: 'your-channel-id', // Add the channelId here
    title,
    message,
    playSound: true,
    soundName: 'default',
  });
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

const isSameDate = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
const colourRed = '#FF0000';
const getfontColour = (key, value) => {

  // Add conditions based on the key and value to check if they are in the red zone
  if (key === 'bpmAvg' && value >= 100) {
    return colourRed;
  }
  if (key === 'spO2' && value < 95) {
    return colourRed;
  }
  if (key === 'temperature' && (value > 30 || value < 10)) {
    return colourRed;
  }
  if (key === 'humidity' && (value > 60 || value < 25)) {
    return colourRed;
  }

  // Check AQI values
  if (key === 'pm25' && value >= 55) {
    return colourRed;
  }
  if (key === 'pm10' && value >= 155) {
    return colourRed;
  }
  if (key === 'o3' && value >= 200) {
    return colourRed;
  }
  if (key === 'no2' && value >= 400) {
    return colourRed;
  }
  if (key === 'so2' && value >= 160) {
    return colourRed;
  }
  if (key === 'co' && value >= 10) {
    return colourRed;
  }
  return null;
};

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

  useEffect(() => {
    if (user) {
      configureBackgroundFetch();
    }
  }, [user]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'your-channel-id',
          channelName: 'Your Channel Name',
          importance: 4,
          vibrationPattern: [100, 200, 300, 400, 500],
          playSound: true,
        },
        created => console.log(`createChannel returned '${created}'`),
      );
    }

    PushNotification.configure({
      onNotification: function (notification) {
        console.log('Notification:', notification);
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
    });
  }, []);
  const configureBackgroundFetch = async () => {
    console.log('[CheckPoint1] ');
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, // Fetch interval in minutes
        stopOnTerminate: false,
        startOnBoot: true,
        enableHeadless: true,
      },
      async () => {
        console.log('[BackgroundFetch] Headless Task');
        await fetchDataAndScheduleNotification();
        console.log('[CheckPoint6] ');
        BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
        console.log('[CheckPoint7] ');
      },
      (error) => {
        console.log('[BackgroundFetch] Error', error);
      }
    );

    BackgroundFetch.status((status) => {
      switch (status) {
        case BackgroundFetch.STATUS_RESTRICTED:
          console.log('BackgroundFetch restricted');
          break;
        case BackgroundFetch.STATUS_DENIED:
          console.log('BackgroundFetch denied');
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
          console.log('BackgroundFetch is enabled');
          break;
      }
    });
  };

  const fetchDataAndScheduleNotification = async () => {
    const { title, message } = await fetchData();
    console.log('[CheckPoint2] ');
    console.log('[title] ', title);
    console.log('[message] ', message);

    if (title && message) {
      PushNotification.localNotificationSchedule({
        title,
        message,
        date: new Date(Date.now() + 60 * 1000),
        allowWhileIdle: true,
      });
    }
  };

  if (initializing) {
    return null;
  }

  return (
    <NavigationContainer>
      {user ? (
        <BottomNavBar />
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          <Stack.Screen name="RegisterSuccessful" component={RegisterSuccessfulPage} options={{ headerShown: false }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

// The rest of your fetch functions should be here (fetchAQIData, fetchIOTData, fetchData)
const fetchAQIData = async () => {
  console.log('[CheckPoint3] ');
  const response = await fetch(
    'https://api.waqi.info/feed/here/?token=a1b89043d4f7de03fe168ee473acc6c6c6aae8c9'
  );
  const data = await response.json();
  console.log('data ', data);


  const storeAqiInDatabase = (aqi, timestamp, co, no2, o3, pm10, pm25, so2) => {
    const aqiRef = db.ref(`aqi/${firebase.auth().currentUser.uid}`);
    aqiRef.set({
      value: aqi,
      time: new Date(timestamp).toISOString(),
      co: co,
      no2: no2,
      o3: o3,
      pm10: pm10,
      pm25: pm25,
      so2: so2
    });
  };

  const aqiData = data.data;

  storeAqiInDatabase(
    aqiData.aqi,
    aqiData.time.iso,
    aqiData.iaqi.co.v,
    aqiData.iaqi.no2.v,
    aqiData.iaqi.o3.v,
    aqiData.iaqi.pm10.v,
    aqiData.iaqi.pm25.v,
    aqiData.iaqi.so2.v
  );
  
  console.log('data.data.iaqi ', aqiData.iaqi);
  return aqiData.iaqi;
};

const fetchIOTData = async () => {
  console.log('[CheckPoint4] ');
  const response = await fetch(
    'https://api.thinger.io/v1/users/Rnunaunfairy2544/buckets/kar/data?authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJEZXZpY2VDYWxsYmFja19hc3Roc2lzdG1vYmlsZSIsInN2ciI6ImFwLXNvdXRoZWFzdC5hd3MudGhpbmdlci5pbyIsInVzciI6IlJudW5hdW5mYWlyeTI1NDQifQ.U6_SCVtAhAB6Wz0i5Y3zlZHMSmANs2MsWIIyubMNxJo'
  );
  const data = await response.json();
  console.log('data ', data);
  return data;
};

const fetchData = async () => {
  try {
    console.log('[CheckPoint5] ');
    const aqiData = await fetchAQIData();
    const iotData = await fetchIOTData();
    console.log('aqiData ', aqiData);
    console.log('iotData ', iotData);
    
    let title, message;
    console.log('aqiData.pm25 ', aqiData.pm25);
    console.log('aqiData.pm25.v ', aqiData.pm25.v);

    for (const key in aqiData) {
      const value = aqiData[key].v;
      console.log('key ', key);
      console.log('value ', value);
      if (getfontColour(key, value) === colourRed) {
        sendNotification(`High ${key.toUpperCase()} level`, `The ${key.toUpperCase()} level is ${value}, which is in the red zone.`);
      }
    }
    // Check IOT data
    const latestIOT = iotData[iotData.length - 1];
    const iotDate = new Date(latestIOT.ts); // Assuming the timestamp is in seconds
    console.log('iotDate', iotDate);
    const currentDate = new Date();
    console.log('currentDate', currentDate);
    if (isSameDate(iotDate, currentDate)) {

      if (latestIOT.val.fingerStatus === true) {
        if (getfontColour('bpmAvg', latestIOT.val.bpmAvg) === colourRed) {
          sendNotification(`High Heartrate level`, `The Heartrate level is ${latestIOT.val.bpmAvg.toFixed(2)}, which is in the red zone.`);
        }
        if (getfontColour('spO2', latestIOT.val.spO2) === colourRed) {
          sendNotification(`High spO2 level`, `The spO2 level is ${latestIOT.val.spO2.toFixed(2)}, which is in the red zone.`);
        }
      }
      if (getfontColour('temperature', latestIOT.val.temperature) === colourRed) {
        sendNotification(`High temperature level`, `The temperature level is ${latestIOT.val.temperature.toFixed(2)}, which is in the red zone.`);
      }
      if (getfontColour('humidity', latestIOT.val.humidity) === colourRed) {
        sendNotification(`High humidity level`, `The humidity level is ${latestIOT.val.humidity.toFixed(2)}, which is in the red zone.`);
      }
    }
    return { title, message };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { title: null, message: null };
  }
};

export default App;
