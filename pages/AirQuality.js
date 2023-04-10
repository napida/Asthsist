import React from "react";
import { FlatList, SafeAreaView, StyleSheet, View, RefreshControl } from "react-native";
import {AqiService} from "../service/AqiService";
import {ThingerService} from "../service/ThingerService";

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

const Item = ({ item, isRefresh }) => (
  <View style={styles.item}>
    {item.title === "AQI"
      ? <AqiService source={item.source} isRefresh={isRefresh} />
      :
      <ThingerService title={item.title} source={item.source} isRefresh={isRefresh} />
    }
  </View>
);

const AirQualityPage = ({ navigation }) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const renderItem = ({ item }) => {
    return (
      <Item
        item={item}
        isRefresh={refreshing}
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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