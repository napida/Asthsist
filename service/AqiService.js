import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Button, Image, Text, View } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Entypo';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import firebaseConfig from '../database/firebaseDB';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

const getIaqi = (data) => {
  let pollutants = data.iaqi;
  if (pollutants) {
    const keys = Object.keys(pollutants);
    return keys.map((key) => {
      let apiData = pollutants[key];

      return { value: key, ...apiData };
    });
  }
  else {
    console.log('Object is not found');
  }
};

export const AqiService = ({ source, isRefreshing }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const pollutantsArr = ['co', 'no2', 'o3', 'pm10', 'pm25', 'so2'];
  const navigation = useNavigation();


  function timeSince(date) {
    var seconds = Math.floor(date / 1000);
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
      return "now"
    }
    return Math.floor(seconds) + " seconds";
  }
  const getAqi = async () => {
    try {
      const response = await fetch('https://api.waqi.info/feed/here/?token=a1b89043d4f7de03fe168ee473acc6c6c6aae8c9');
      const json = await response.json();
      setData(json.data);
      const timestamp = json.data.time.iso; // Get the timestamp in milliseconds
      console.log('timestamp'.timestamp);

      const pollutants = getIaqi(json.data);
      const pollutantValues = {};
      pollutants.forEach(p => {
        pollutantValues[p.value] = p.v;
      });
      const storeAqiInDatabase = (uid) => {
        const aqiRef = db.ref(`aqi/${firebase.auth().currentUser.uid}`);
        aqiRef.push({
          value: json.data.aqi,
          time: timestamp,
          co: pollutantValues.co,
          no2: pollutantValues.no2,
          o3: pollutantValues.o3,
          pm10: pollutantValues.pm10,
          pm25: pollutantValues.pm25,
          so2: pollutantValues.so2
        });
      };
      storeAqiInDatabase(firebase.auth().currentUser.uid);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  


  useEffect(() => {
    const timer = setTimeout(() => {
      getAqi();
      timeSince();
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  //define colour
  const colourYellow = '#FFC100';
  const colourRed = '#FF0000';
  const colourGreen = '#00CD00';


  function getAqifontColour(value) {
    if (value <= 50) {
      return colourGreen;
    }
    if (value >= 51 && value <= 200) {
      return colourYellow;
    }
    if (value >= 201) {
      return colourRed;
    }
  }
  function getfontColour(value, v) {
    if (value == 'co') {
      if (v <= 1.0) {
        return colourGreen;
      }
      if (v >= 1.1 && v <= 10) {
        return colourYellow;
      }
      if (v >= 10.1) {
        return colourRed;
      }
    }
    if (value == 'no2') {
      if (v <= 40) {
        return colourGreen;
      }
      if (v >= 41 && v <= 180) {
        return colourYellow;
      }
      if (v >= 181) {
        return colourRed;
      }
    }
    if (value == 'o3') {
      if (v <= 50) {
        return colourGreen;
      }
      if (v >= 51 && v <= 168) {
        return colourYellow;
      }
      if (v >= 169) {
        return colourRed;
      }
    }
    if (value == 'pm10') {
      if (v <= 50) {
        return colourGreen;
      }
      if (v >= 51 && v <= 250) {
        return colourYellow;
      }
      if (v >= 251) {
        return colourRed;
      }
    }
    if (value == 'pm25') {
      if (v <= 30) {
        return colourGreen;
      }
      if (v >= 31 && v <= 90) {
        return colourYellow;
      }
      if (v >= 91) {
        return colourRed;
      }
    }
    if (value == 'so2') {
      if (v <= 40) {
        return colourGreen;
      }
      if (v >= 41 && v <= 380) {
        return colourYellow;
      }
      if (v >= 381) {
        return colourRed;
      }
    }
  }
  const pollutants = getIaqi(data);
  return (
    <View style={{ flex: 1, padding: 0 }}>
      <View style={styles.item}>
        <View style={{ flexDirection: 'row' }}>
          <Image
            style={{ height: 70, width: 70, marginRight: 50 }}
            source={source}
            resizeMode="contain" />
          <View>
            <Text style={styles.title}>AQI</Text>
            <Text style={[styles.title, { fontFamily: 'Prompt-Medium', fontSize: 17, color: getAqifontColour(data.aqi) }]}>{data.aqi}</Text>
            {/* No internet connection */}
            {/* {console.log(!netInfo.isConnected && 'No Internet')}
          {!netInfo.isConnected && navigation.navigate('No Internet')} */}
          </View>
        </View>
        {
          (isLoading ? (
            <ActivityIndicator />
          ) : (
            <View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', }}>
                {pollutants.map((item, index) => (
                  pollutantsArr.includes(item.value) &&
                  <View key={index} style={{ flexDirection: 'row', paddingTop: 10 }}>
                    <Text style={[styles.title, { fontFamily: 'Prompt-Regular', fontSize: 15, paddingRight: 15 }]}>{console.log(item.value)}{item.value === 'pm25' ? 'PM2.5' : item.value.toUpperCase()}:</Text>
                    <Text style={[styles.title, { fontFamily: 'Prompt-Regular', fontSize: 15, color: getfontColour(item.value, item.v), paddingRight: 10 }]}>{item.v}</Text>
                  </View>
                ))
                }
              </View>
              <View style={{ marginTop: 20, marginRight: 20, flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                <View style={{ flexDirection: 'row' }}>
                  <Icon
                    name="location-pin"
                    size={20}
                    color="red"
                    style={{ marginRight: 5 }}
                  />
                  <Text style={[styles.title, { fontFamily: 'Prompt-Regular', fontSize: 15, color: '#4D4D4D', paddingRight: 10 }]}>{data.city.name}</Text>

                </View>
                <View>
                  <Text style={[styles.title, { fontFamily: 'Prompt-Regular', fontSize: 15, color: '#4D4D4D', paddingRight: 10 }]}>
                    | {timeSince(new Date() - (new Date(data.time.iso)))}
                  </Text>
                </View>
              </View>
            </View>
          ))}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  title: {
    fontFamily: 'Prompt-Medium',
    color: '#012250',
    fontSize: 25,
  },
});
