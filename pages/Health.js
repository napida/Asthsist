import React, { useState } from "react";
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Image, Text, TouchableOpacity, View } from "react-native";

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

const Item = ({ item }) => (
  <TouchableOpacity style={styles.item}>
    <Image
      style={{ height: 70, width: 70, marginRight: 50 }}
      source={item.source}
      resizeMode="contain" />

    <View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={[styles.title, { fontFamily: 'Prompt-Medium', fontSize: 17, color: item.color }]}>{item.subtitle}</Text>
    </View>
  </TouchableOpacity>
);

const HealthPage = ({ navigation }) => {
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