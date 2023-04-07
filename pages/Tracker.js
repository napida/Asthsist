import React from "react";
import { FlatList, SafeAreaView, StyleSheet, Image, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from 'react-native-linear-gradient';

const DATA = [
  {
    id: "1",
    title: "Inhaler",
    color: '#A5E1E9',
    secondColor: '#7CAAF3',
    source: require('../assets/inhaler.png'),
  },
  {
    id: "2",
    title: "Medicine",
    color: '#F9CADC',
    secondColor: '#EB5B79',
    source: require('../assets/medicine.png'),
  },
  {
    id: "3",
    title: "Peak Flow",
    color: '#C4BDF3',
    secondColor: '#A57DF3',
    source: require('../assets/peak-flow-meter.png'),
  },
  {
    id: "4",
    title: "Asthma Activity",
    color: '#FBE8A4',
    secondColor: '#EFA45E',
    source: require('../assets/asthma-attack.png'),
  },
];

const Item = ({ navigation, item }) => (
  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate(item.title)}>
    <LinearGradient
        colors={[item.color, item.secondColor]}
        style={styles.item}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
    <Image
      style={{ height: 70, width: 70, marginRight: 50 }}
      source={item.source}
      resizeMode="contain" />

    <View>
      <Text style={styles.title}>{item.title}</Text>
    </View>
    </LinearGradient>
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
    borderRadius: 8,
    alignItems: 'center'
  },
  title: {
    fontFamily: 'Prompt-Medium',
    color: '#012250',
    fontSize: 25,
  },
  button: {
    borderRadius: 20,
    overflow: "hidden",
  },
});

export default TrackerPage;