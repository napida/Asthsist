import React, { useState } from "react";
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Image, Text, TouchableOpacity, View } from "react-native";
import { AqiService } from "../service/AqiService";

const DATA = [
  {
    id: "1",
    title: "AQI",
    subtitle: '200',
    color: '#FFC100',
    source: require('../assets/air-quality.png'),
  },
  {
    id: "2",
    title: "Humidity",
    subtitle: '50%',
    color: '#00CD00',
    source: require('../assets/humidity.png'),
  },
  {
    id: "3",
    title: "Temperature",
    subtitle: '25 °C',
    color: '#00CD00',
    source: require('../assets/temperature.png'),
  }
];

const Item = ({ item }) => (
  <TouchableOpacity style={styles.item}>
    <View style={{ flexDirection: 'row' }}>
      <Image
        style={{ height: 70, width: 70, marginRight: 50 }}
        source={item.source}
        resizeMode="contain" />
      <View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={[styles.title, { fontFamily: 'Prompt-Medium', fontSize: 17, color: item.color }]}>{item.subtitle}</Text>
      </View>
    </View>
    <View style={{flexDirection:'row', flexWrap: 'wrap', justifyContent: 'space-between',}}>
      {item.title === "AQI" && (
        <AqiService />
      )}
    </View>
  </TouchableOpacity>
);

const AirQualityPage = ({ navigation }) => {
  const renderItem = ({ item }) => {
    return (
      <Item
        item={item}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
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
    flexDirection: 'column',
    padding: 40,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
    borderRadius: 8,
    backgroundColor: '#D9E6D5',
    justifyContent: 'center'
  },
  title: {
    fontFamily: 'Prompt-Medium',
    color: '#012250',
    fontSize: 25,
  },
});

export default AirQualityPage;