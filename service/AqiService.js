import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';


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

export const AqiService = ({ source }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const pollutantsArr = ['co', 'no2', 'o3', 'pm10', 'pm25', 'so2'];
  const getAqi = async () => {
    try {
      const response = await fetch('https://api.waqi.info/feed/here/?token=a1b89043d4f7de03fe168ee473acc6c6c6aae8c9');
      const json = await response.json();
      setData(json.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAqi();
  }, []);

  const pollutants = getIaqi(data);

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <TouchableOpacity style={styles.item}>
        <View style={{ flexDirection: 'row' }}>
          <Image
            style={{ height: 70, width: 70, marginRight: 50 }}
            source={source}
            resizeMode="contain" />
          <View>
            <Text style={styles.title}>AQI</Text>
            <Text style={[styles.title, { fontFamily: 'Prompt-Medium', fontSize: 17, color: '#FFC100' }]}>{data.aqi}</Text>
          </View>
        </View>

        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', }}>
            {pollutants.map((item, index) => (
              pollutantsArr.includes(item.value) &&
              <View key={index} style={{ flexDirection: 'row', paddingTop: 10 }}>
                <Text style={[styles.title, { fontFamily: 'Prompt-Regular', fontSize: 15, paddingRight: 5 }]}>{item.value === 'pm25' ? 'PM2.5' : item.value.toUpperCase()}:</Text>
                <Text style={[styles.title, { fontFamily: 'Prompt-Regular', fontSize: 15, color: '#FFC100', paddingRight: 10 }]}>{item.v}</Text>
              </View>
            ))
            }
          </View>
        )}
      </TouchableOpacity>
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
