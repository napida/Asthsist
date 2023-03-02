import React, { useState } from "react";
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Image, Text, TouchableOpacity, View } from "react-native";

const DATA = [
  {
    id: "1",
    title: "Inhaler",
    color: '#FFC100',
    source: require('../assets/inhaler.png'),
  },
  {
    id: "2",
    title: "Peak Flow",
    color: '#00CD00',
    source: require('../assets/peak-flow-meter.png'),
  },
  {
    id: "3",
    title: "Asthma Activity",
    color: '#00CD00',
    source: require('../assets/asthma-attack.png'),
  }
];

const Item = ({ navigation, item }) => (
  <TouchableOpacity style={styles.item} onPress={() => navigation.navigate(item.title.replace(/\s/g, ''))}>
    <Image
      style={{ height: 70, width: 70, marginRight: 50 }}
      source={item.source}
      resizeMode="contain" />

    <View>
      <Text style={styles.title}>{item.title}</Text>
      {/* <Text style={[styles.title, {fontFamily: 'Prompt-Medium', fontSize: 17, color: item.color}]}>{item.subtitle}</Text> */}
    </View>
  </TouchableOpacity>
);

const TrackerPage = ({ navigation }) => {
  const renderItem = ({ item }) => {
    return (
      <Item
        navigation = {navigation}
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
    paddingLeft: 25,
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
    fontSize: 25,
  },
});

export default TrackerPage;