import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, FlatList, View, Text, Image, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-elements';


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

const fetchAQIData = async () => {
  const response = await fetch(
    'https://api.waqi.info/feed/here/?token=a1b89043d4f7de03fe168ee473acc6c6c6aae8c9'
  );
  const data = await response.json();
  return data.data.iaqi;
};

const fetchIOTData = async () => {
  const response = await fetch(
    'https://api.thinger.io/v1/users/Rnunaunfairy2544/buckets/kar/data?authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJEZXZpY2VDYWxsYmFja19hc3Roc2lzdG1vYmlsZSIsInN2ciI6ImFwLXNvdXRoZWFzdC5hd3MudGhpbmdlci5pbyIsInVzciI6IlJudW5hdW5mYWlyeTI1NDQifQ.U6_SCVtAhAB6Wz0i5Y3zlZHMSmANs2MsWIIyubMNxJo'
  );
  const data = await response.json();
  return data;
};

const imageWidth = Dimensions.get('window').width;

const Item = ({ title, message, img }) => (
  <TouchableOpacity style={styles.notificationContainer}>
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
    </View>
  </TouchableOpacity>
);

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const aqiData = await fetchAQIData();
      const iotData = await fetchIOTData();
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
          });
        }
      }
    
      // Check IOT data
      const latestIOT = iotData[iotData.length - 1];
      console.log("latestIOT.val.fingerStatus", latestIOT.val.fingerStatus);
      if (latestIOT.val.fingerStatus === true) {
        if (getfontColour('bpmAvg', latestIOT.val.bpmAvg) === colourRed) {
          newNotifications.push({
            id: 'iot_heartrate',
            title: 'High Heart rate',
            message: `Your heart rate is ${latestIOT.val.bpmAvg}, which is in the red zone.`,
            img: require('../assets/medicine.png'),
          });
        }
        if (getfontColour('spO2', latestIOT.val.spO2) === colourRed) {
          newNotifications.push({
            id: 'iot_spo2',
            title: 'Low SpO2',
            message: `Your SpO2 level is ${latestIOT.val.spO2}, which is in the red zone.`,
            img: require('../assets/oximeter.png'),
          });
        }
      }
      if (getfontColour('temperature', latestIOT.val.temperature) === colourRed) {
        newNotifications.push({
          id: 'iot_temperature',
          title: 'High Temperature',
          message: `Your temperature is ${latestIOT.val.temperature.toFixed(2)}°C, which is in the red zone.`,
          img: require('../assets/temperature.png'),
        });
      }
      if (getfontColour('humidity', latestIOT.val.humidity) === colourRed) {
        newNotifications.push({
          id: 'iot_humidity',
          title: 'High Humidity',
          message: `The humidity level is ${latestIOT.val.humidity.toFixed(2)}%, which is in the red zone.`,
          img: require('../assets/humidity.png'),
        });
      }
    
      // Update notifications
      setNotifications([...notifications, ...newNotifications]);
    };
    

    fetchData();
    console.log('Notifications:', notifications);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={({ item }) => <Item title={item.title} message={item.message} img={item.img} />}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={<Divider width={5} color='#f2f2f2' />}
        style={{ paddingTop: 5 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text>No notifications to display.</Text>}
      />
    </SafeAreaView>
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
});

export default Notification;