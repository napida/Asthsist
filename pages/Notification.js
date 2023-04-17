import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, FlatList, View, Text, Image, SafeAreaView, Dimensions, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { Divider } from 'react-native-elements';
import PushNotification from 'react-native-push-notification';
import moment from 'moment';

const sendNotification = (title, message) => {
  PushNotification.localNotification({
    channelId: 'your-channel-id', // Add the channelId here
    title,
    message,
    playSound: true,
    soundName: 'default',
  });
};

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

const timeSince = (date) => {
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  if (Math.floor(seconds) == 0) {
    return "now";
  }
  return Math.floor(seconds) + " seconds ago";
};


const fetchAQIData = async () => {
  const response = await fetch(
    'https://api.waqi.info/feed/here/?token=a1b89043d4f7de03fe168ee473acc6c6c6aae8c9'
  );
  const data = await response.json();
  return data.data;
};

const fetchIOTData = async () => {
  const response = await fetch(
    'https://api.thinger.io/v1/users/Rnunaunfairy2544/buckets/kar/data?authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJEZXZpY2VDYWxsYmFja19hc3Roc2lzdG1vYmlsZSIsInN2ciI6ImFwLXNvdXRoZWFzdC5hd3MudGhpbmdlci5pbyIsInVzciI6IlJudW5hdW5mYWlyeTI1NDQifQ.U6_SCVtAhAB6Wz0i5Y3zlZHMSmANs2MsWIIyubMNxJo&items=1'
  );
  const data = await response.json();
  return data[0]; // Return only the latest data point
};

const imageWidth = Dimensions.get('window').width;

const Item = ({ navigation, title, message, img, goto, timestamp}) => (
  <TouchableOpacity style={styles.notificationContainer} onPress={() => navigation.navigate(goto)}>
    <View style={styles.notificationIconContainer}>
      <Image
        source={img}
        style={styles.notificationIcon}
      />
    </View>
    <View style={styles.notificationContentContainer}>
      <Text style={styles.notificationTitle}>{title}</Text>
      <Text style={styles.notificationMessage}>
        {message}
      </Text>
      <Text style={styles.timeAgo}>
        {timeSince(timestamp)}
      </Text>
    </View>
  </TouchableOpacity>
);

const Notification = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    // if (Platform.OS === 'android') {
    //   PushNotification.createChannel(
    //     {
    //       channelId: 'your-channel-id',
    //       channelName: 'Your Channel Name',
    //       importance: 4,
    //       vibrationPattern: [100, 200, 300, 400, 500],
    //       playSound: true,
    //     },
    //     created => console.log(`createChannel returned '${created}'`),
    //   );
    // }

    PushNotification.configure({
      onNotification: function (notification) {
        console.log('Notification:', notification);
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
    });

    const fetchData = async () => {
      const aqiBIGData = await fetchAQIData();
      const aqiData = aqiBIGData.iaqi;
      const iotData = await fetchIOTData();

      console.log('aqiBIGData:', aqiBIGData);
      console.log('AQI Data:', aqiData);
      console.log('IOT Data:', iotData);

      // Process the data and add notifications if needed
      const newNotifications = [];

      // Check AQI data
      for (const key in aqiData) {
        const value = aqiData[key].v;
        if (getfontColour(key, value) === colourRed) {
          newNotifications.push({
            id: `aqi_${key}`,
            title: `High ${key.toUpperCase()} level`,
            message: `The ${key.toUpperCase()} level is ${value}, which is in the red zone.`,
            img: require('../assets/air-quality.png'),
            goto: 'Air Quality',
            timestamp: new Date(aqiBIGData.time.iso)
          });
          sendNotification(`High ${key.toUpperCase()} level`, `The ${key.toUpperCase()} level is ${value}, which is in the red zone.`);
        }
      }
      // Check IOT data
      const latestIOT = iotData;
      console.log('latestIOT', latestIOT);
      const iotDate = new Date(latestIOT.ts); // Assuming the timestamp is in seconds
      console.log('iotDate', iotDate);
      const currentDate = new Date();
      console.log('currentDate', currentDate);
      if (isSameDate(iotDate, currentDate)) {

        console.log("latestIOT.val.fingerStatus", latestIOT.val.fingerStatus);
        if (latestIOT.val.fingerStatus === true) {
          if (getfontColour('bpmAvg', latestIOT.val.bpmAvg) === colourRed) {
            newNotifications.push({
              id: 'iot_heartrate',
              title: 'High Heart rate',
              message: `Your heart rate is ${latestIOT.val.bpmAvg}, which is in the red zone.`,
              img: require('../assets/heart-rate.png'),
              goto: 'Health',
              timestamp: new Date(iotDate)
            });
          }
          if (getfontColour('spO2', latestIOT.val.spO2) === colourRed) {
            newNotifications.push({
              id: 'iot_spo2',
              title: 'Low SpO2',
              message: `Your SpO2 level is ${latestIOT.val.spO2}, which is in the red zone.`,
              img: require('../assets/oximeter.png'),
              goto: 'Health',
              timestamp: new Date(iotDate)
            });
          }
        }
        if (getfontColour('temperature', latestIOT.val.temperature) === colourRed) {
          newNotifications.push({
            id: 'iot_temperature',
            title: 'High Temperature',
            message: `Your temperature is ${latestIOT.val.temperature.toFixed(2)}°C, which is in the red zone.`,
            img: require('../assets/temperature.png'),
            goto: 'Air Quality',
            timestamp: new Date(iotDate)
          });
        }
        if (getfontColour('humidity', latestIOT.val.humidity) === colourRed) {
          newNotifications.push({
            id: 'iot_humidity',
            title: 'High Humidity',
            message: `The humidity level is ${latestIOT.val.humidity.toFixed(2)}%, which is in the red zone.`,
            img: require('../assets/humidity.png'),
            goto: 'Air Quality',
            timestamp: new Date(iotDate)
          });
        }
      }
      // Update notifications
      setNotifications([...notifications, ...newNotifications]);
      setLoading(false)
    };


    fetchData();
    console.log('Notifications:', notifications);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <Item
            navigation={navigation}
            title={item.title}
            message={item.message}
            img={item.img}
            goto={item.goto}
            timestamp={item.timestamp}
          />
        )}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={<Divider width={5} color="#f2f2f2" />}
        style={{ paddingTop: 5 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Text>No notifications to display.</Text>
          )
        }
      />

    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: imageWidth - 20,
  },
  notificationIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    width: 30,
    height: 30,
  },
  notificationContentContainer: {
    marginLeft: 10,
    flex: 1,
  },
  notificationTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  notificationMessage: {
    fontSize: 14,
    marginTop: 5,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  timeAgo: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 5,
    color: '#888',
  },
});

export default Notification;