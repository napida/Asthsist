import React from 'react';
import { SafeAreaView, FlatList, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';


const DATA = [
  {
    id: '1',
    source: require('../assets/category-health.png'),
    page: 'Health'
  },
  {
    id: '2',
    source: require('../assets/category-air-quality.png'),
    page: 'Air Quality'
  },
  {
    id: '3',
    source: require('../assets/category-tracker.png'),
    page: 'Tracker'
  },
];

const imageWidth = Dimensions.get('window').width;

function ListStatusPage({ navigation }) {
  renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate(item.page)}>
      <Image
        style={styles.item}
        source={item.source}
        resizeMode="cover" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginVertical: StatusBar.currentHeight || 0,
  },
  item: {
    width: imageWidth - 30,
    height: 200,
    padding: 40,
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
    alignSelf: 'flex-start'
  },
});

export default ListStatusPage;