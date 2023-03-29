import React, { useState, useEffect } from "react";
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Image, Text, TouchableOpacity, View } from "react-native";
import { ThingerService } from "../service/ThingerService";
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import firebaseConfig from '../database/firebaseDB';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

const DATA = [
  {
    id: "1",
    title: "Heart rate",
    subtitle: '120 beats/min',
    color: '#FF0000',
    source: require('../assets/heart-rate.png'),
  },
  {
    id: "2",
    title: "SpO2",
    subtitle: '95%',
    color: '#00CD00',
    source: require('../assets/oximeter.png'),
  },
  {
    id: "3",
    title: "Peak flow",
    subtitle: '80%',
    color: '#00CD00',
    source: require('../assets/peak-flow-meter.png'),
  }
];

const determinePeakFlowZone = (percent) => {
  if (percent >= 80) {
    return { zone: "Green Zone", color: "#00CD00" };
  } else if (percent >= 50) {
    return { zone: "Yellow Zone", color: "#FFD700" };
  } else {
    return { zone: "Red Zone", color: "#FF0000" };
  }
};


const Item = ({ item, percent }) => {
  const peakFlowData =
    item.title === "Peak flow" && percent !== null
      ? determinePeakFlowZone(percent)
      : { zone: "", color: item.color };

  const textColor = peakFlowData.color;

  return (
    <TouchableOpacity style={styles.item}>
      <View style={{ flexDirection: "row" }}>
        <Image
          style={{ height: 70, width: 70, marginRight: 50 }}
          source={item.source}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.title}>{item.title}</Text>
          <Text
            style={[
              styles.title,
              {
                fontFamily: "Prompt-Medium",
                fontSize: 17,
                color: textColor,
              },
            ]}
          >
            {item.title === "Peak flow" && percent !== null
              ? `${peakFlowData.zone} (${percent}%)`
              : item.subtitle}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};


const HealthPage = ({ navigation }) => {
  const [data, setData] = useState(DATA);
  const [percent, setPercent] = useState(null);

  useEffect(() => {
    fetchPeakFlowData();
  }, []);

  const fetchPeakFlowData = async () => {
    try {
      const currentUser = firebase.auth().currentUser;
  
      if (!currentUser) {
        console.error("User not signed in");
        return;
      }
  
      const userUID = currentUser.uid;
      console.log("userUID", userUID);
  
      const peakFlowSnapshot = await db.ref(`PeakFlowData/${userUID}`).orderByChild('timeforref').once('value');
      console.log("peakFlowSnapshot", peakFlowSnapshot);
  
      if (!peakFlowSnapshot.exists()) {
        console.error("No peak flow data found");
        return;
      }
  
      const peakFlowDataArray = Object.values(peakFlowSnapshot.val());
      const latestValue = parseInt(peakFlowDataArray[peakFlowDataArray.length - 1].peakflow);
  
      // Filter peak flow data for the last 3-4 weeks
      const threeWeeksAgo = new Date();
      threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);
      const filteredPeakFlowData = peakFlowDataArray.filter((item) => {
        const date = item.timeforref ? new Date(item.timeforref) : new Date(item.time);
        return date >= threeWeeksAgo && item.peakflow;
      });
      console.log("filteredPeakFlowData", filteredPeakFlowData);
  
      // Find the personal best peak flow value
      const personalBest = filteredPeakFlowData.reduce((max, item) => Math.max(max, parseInt(item.peakflow)), 0);
      console.log("personalBest", personalBest);
  
      // Calculate the percentage of the latest peak flow value to the personal best
      let newPercent = Math.round((latestValue / personalBest) * 100);
      newPercent = newPercent > 100 ? 100 : newPercent; // Ensure the value does not exceed 100%
      setPercent(newPercent);
  
      const updatedData = data.map((item) => {
        if (item.id === "3") {
          return { ...item, subtitle: `${newPercent}%` };
        }
        return item;
      });
  
      setData(updatedData);
    } catch (error) {
      console.error("Error fetching data from Firebase:", error);
    }
  };
  
  
  
  
  const renderItem = ({ item }) => {
    return (
      <Item
        item={item}
        percent={item.id === "3" ? percent : null}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    flexDirection: 'row',
    padding: 40,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
    borderRadius: 8,
    backgroundColor: '#D9E6D5',
    alignItems: 'center'
  },
  title: {
    fontFamily: 'Prompt-Medium',
    color: '#012250',
    fontSize: 25
  },
});

export default HealthPage;