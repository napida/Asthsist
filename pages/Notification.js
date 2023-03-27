import React from 'react';
import { StyleSheet, FlatList, View, Text, Image, SafeAreaView, Dimensions } from 'react-native';
import { Divider } from 'react-native-elements';

const DATA = [
  {
    id: '1',
    title: 'First Item',
    message: 'You got warnning',
    img: require('../assets/inhaler.png'),
  },
  {
    id: '2',
    title: 'Second Item',
    message: 'You got warnning',
    img: require('../assets/medicine.png'),
  },
  {
    id: '3',
    title: 'Third Item',
    message: 'You got warnning',
    img: require('../assets/oximeter.png'),
  },
];
const imageWidth = Dimensions.get('window').width;

const Item = ({ title, message , img}) => (
  <View style={styles.notificationContainer}>
    <View style={styles.notificationIconContainer}>
      <Image
        source={img}
        style={styles.notificationIcon}
      />
    </View>
    <View style={styles.notificationContentContainer}>
      <Text style={styles.notificationTitle}>{title}</Text>
      <Text style={styles.notificationMessage}>
        {message}
      </Text>
    </View>
  </View>
);

const Notification = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* {AqiService === 'red' ? ( */}
      <FlatList
        data={DATA}
        renderItem={({ item }) => <Item title={item.title} message={item.message} img={item.img} />}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={
          <Divider width={5} color='#f2f2f2' />
        }
      />
      {/* ) : (
          <Text>No new notifications.</Text>
        )} */}
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: imageWidth - 20,
  },
  notificationIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    width: 30,
    height: 30,
  },
  notificationContentContainer: {
    marginLeft: 10,
    flex: 1,
  },
  notificationTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  notificationMessage: {
    fontSize: 14,
    marginTop: 5,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

export default Notification;