import React from "react";
import { FlatList, SafeAreaView, StyleSheet, Image, Text, TouchableOpacity, View } from "react-native";

const DATA = [
  {
    id: "1",
    title: "Inhaler",
    color: '#A5E1E9',
    source: require('../assets/inhaler.png'),
  },
  {
    id: "2",
    title: "Medicine",
    color: '#F9CADC',
    source: require('../assets/medicine.png'),
  },
  {
    id: "3",
    title: "Peak Flow",
    color: '#C4BDF3',
    source: require('../assets/peak-flow-meter.png'),
  },
  {
    id: "4",
    title: "Asthma Activity",
    color: '#FBE8A4',
    source: require('../assets/asthma-attack.png'),
  },
];

const Item = ({ navigation, item }) => (
  <TouchableOpacity style={[styles.item, {backgroundColor: item.color}]} onPress={() => navigation.navigate(item.title)}>
    <Image
      style={{ height: 70, width: 70, marginRight: 50 }}
      source={item.source}
      resizeMode="contain" />

    <View>
      <Text style={styles.title}>{item.title}</Text>
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingVertical: 10}}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    alignItems: 'center'
  },
  title: {
    fontFamily: 'Prompt-Medium',
    color: '#012250',
    fontSize: 25,
  },
});

export default TrackerPage;