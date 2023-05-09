import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar, Alert, ActivityIndicator, Image } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Card } from 'react-native-paper';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import firebaseConfig from '../database/firebaseDB';
import moment from 'moment';
import 'firebase/compat/auth';
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

const imageWidth = Dimensions.get('window').width;
const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};
function formatDate(dateString) {
  const date = new Date(dateString);
  const localDate = date.toLocaleDateString('en-US', { timeZone: 'Asia/Bangkok' });
  const [month, day, year] = localDate.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}


const peakFlow = { key: 'peakFlow', color: '#A57DF3', selectedDotColor: '#A57DF3' };
const inhaler = { key: 'inhaler', color: '#7CAAF3', selectedDotColor: '#7CAAF3' };
const activity = { key: 'activity', color: '#EFA45E', selectedDotColor: '#EFA45E' };
const medicine = { key: 'medicine', color: '#EB5B79', selectedDotColor: '#EB5B79' };

const CalendarPage = () => {
  const alertItem = (title, name, time, note, value, prefix) => {
    const noted = !!note? `Note: ${note}`: ''
    Alert.alert(
      `${title} Review`,
      `
      Time: ${time}
      ${name}: ${value} ${prefix}
      ${noted}`,
      [
        {
          text: "OK",
        }
      ]
    );
  }
  const [items, setItems] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const markedDates = Object.keys(items).reduce((obj, key) => {
    obj[key] = { dots: [] };
    let hasPeakFlow = false;
    let hasInhaler = false;
    let hasActivity = false;
    let hasMedicine = false;
    items[key].forEach((item) => {
      const formattedDate = moment(item.date, 'MM/DD/YYYY').format('YYYY-MM-DD');
      if (formattedDate === key && item.peakflow && !hasPeakFlow) {
        obj[key].dots.push(peakFlow);
        hasPeakFlow = true;
      }
      if (formattedDate === key && item.inhaler && !hasInhaler) {
        obj[key].dots.push(inhaler);
        hasInhaler = true;
      }
      if (formattedDate === key && item.activity && !hasActivity) {
        obj[key].dots.push(activity);
        hasActivity = true;
      }
      if (formattedDate === key && item.medicine && !hasMedicine) {
        obj[key].dots.push(medicine);
        hasMedicine = true;
      }
    });
    return obj;
  }, {});

  const isItemDuplicate = (itemArray, currentItem) => {
    return itemArray.some(item => {
      return item.date === currentItem.date &&
             item.time === currentItem.time &&
             (item.peakflow !== undefined && currentItem.peakflow !== undefined ||
              item.activity !== undefined && currentItem.activity !== undefined ||
              item.inhaler !== undefined && currentItem.inhaler !== undefined ||
              item.medicine !== undefined && currentItem.medicine !== undefined);
    });
  };
  
  const loadItems = async (day) => {
    const start = new Date(day.timestamp).setHours(0, 0, 0, 0);
    const uid = firebase.auth().currentUser.uid;
    if (items[timeToString(start)]) {
      return;
    }

    try {
      const snapshotPeakFlow = await db.ref('PeakFlowData/').once('value');
      const peakFlowData = snapshotPeakFlow.val();

      const snapshotAsthmaActivity = await db.ref('AsthmaActivityData/').once('value');
      const asthmaActivityData = snapshotAsthmaActivity.val();

      const snapshotInhaler = await db.ref('Inhaler/').once('value');
      const inhalerData = snapshotInhaler.val();

      const snapshotMedicine = await db.ref('Medicine/').once('value');
      const medicineData = snapshotMedicine.val();

      if (peakFlowData === null && asthmaActivityData === null && inhalerData === null && medicineData ===null) {
        setIsLoading(false);
        return;
      }
      if (peakFlowData !== null) {
        Object.entries(peakFlowData).forEach(([parentKey, parentEvent]) => {
          if (parentKey === uid) {
            Object.entries(parentEvent).forEach(([key, event]) => {
              const date = moment(event.time, 'ddd MMM DD YYYY HH:mm:ss ZZ').toDate();
              const strTime = formatDate(event.time);
              if (!items[strTime]) {
                items[strTime] = [];
              }
              const newItem = {
                key: Date.now() + '_' + Math.random().toString(36).substring(2, 15),
                date: date.toLocaleDateString(),
                time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                peakflow: event.peakflow,
                note: event.note
              };
              console.log("peakFlowData");
              console.log("items[strTime]",items[strTime]);
              console.log("newItem",newItem);
              if (!isItemDuplicate(items[strTime], newItem)) {
                items[strTime].push(newItem);
              }
            });
          }
        });
      }
      if (asthmaActivityData !== null) {
        Object.entries(asthmaActivityData).forEach(([parentKey, parentEvent]) => {
          if (parentKey === uid) {
            Object.entries(parentEvent).forEach(([key, event]) => {
              const date = moment(event.time, 'ddd MMM DD YYYY HH:mm:ss ZZ').toDate();
              const strTime = formatDate(event.time);
              if (!items[strTime]) {
                items[strTime] = [];
              }
              const newItem = {
                key: Date.now() + '_' + Math.random().toString(36).substring(2, 16),
                date: date.toLocaleDateString(),
                time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                activity: event.activity,
                note: event.note
              };
              console.log("asthmaActivityData");
              console.log("items[strTime]",items[strTime]);
              console.log("newItem",newItem);
              if (!isItemDuplicate(items[strTime], newItem)) {
                items[strTime].push(newItem);
              }
            });
          }
        });
      }
      if (inhalerData !== null) {
        Object.entries(inhalerData).forEach(([parentKey, parentEvent]) => {
          if (parentKey === uid) {
            Object.entries(parentEvent).forEach(([key, event]) => {
              const date = moment(event.time, 'ddd MMM DD YYYY HH:mm:ss ZZ').toDate();
              const strTime = formatDate(event.time);
              if (!items[strTime]) {
                items[strTime] = [];
              }
              const newItem = {
                key: Date.now() + '_' + Math.random().toString(36).substring(2, 17),
                date: date.toLocaleDateString(),
                time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                inhaler: event.usage,
                name: event.name,
                note: event.note
              };
              console.log("inhalerData");
              console.log("items[strTime]",items[strTime]);
              console.log("newItem",newItem);
              if (!isItemDuplicate(items[strTime], newItem)) {
                items[strTime].push(newItem);
              }
            });
          }
        });
      }
      if (medicineData !== null) {
        Object.entries(medicineData).forEach(([parentKey, parentEvent]) => {
          if (parentKey === uid) {
            Object.entries(parentEvent).forEach(([key, event]) => {
              const date = moment(event.time, 'ddd MMM DD YYYY HH:mm:ss ZZ').toDate();
              const strTime = formatDate(event.time);
              if (!items[strTime]) {
                items[strTime] = [];
              }
              const newItem = {
                key: Date.now() + '_' + Math.random().toString(36).substring(2, 18),
                date: date.toLocaleDateString(),
                time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                medicine: event.usage,
                name: event.name,
                note: event.note
              };
              console.log("medicineData");
              console.log("items[strTime]",items[strTime]);
              console.log("newItem",newItem);
              console.log("isItemDuplicate(items[strTime], newItem)",isItemDuplicate(items[strTime], newItem));
              if (!isItemDuplicate(items[strTime], newItem)) {
                items[strTime].push(newItem);
              }
            });
          }
        });
      }
      setItems(items);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading items:", error);
    }
  };

  useEffect(() => {
    loadItems({ timestamp: Date.now() });
  }, []);

  const renderItem = (item) => {
    let cards = [];
    if (item.peakflow) {
      cards.push(
        <TouchableOpacity key={item.key} onPress={() => alertItem('Peak flow', 'Peak flow', item.time, item.note, item.peakflow, 'L/min')} style={[styles.item, { borderLeftColor: peakFlow.color }]}>
          <Card>
            <Card.Content>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text>{item.time} |  Peakflow</Text>
                <Text>{item.peakflow} L/min</Text>
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      );
    }
    if (item.inhaler) {
      cards.push(
        <TouchableOpacity key={item.key} onPress={() => alertItem('Inhaler', item.name, item.time, item.note, item.inhaler, item.inhaler===1 ? `time`: `times`)} style={[styles.item, { borderLeftColor: inhaler.color }]}>
          <Card>
            <Card.Content>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text>{item.time} |  Inhaler</Text>
                <Text>{item.name} :  {item.inhaler} {item.inhaler===1 ? `time`: `times`}</Text>
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      );
    }
    if (item.medicine) {
      cards.push(
        <TouchableOpacity key={item.key} onPress={() => alertItem('Medicine', item.name, item.time, item.note, item.medicine, item.medicine===1 ? `pill`: `pills`)} style={[styles.item, { borderLeftColor: medicine.color }]}>
          <Card>
            <Card.Content>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text>{item.time} |  Medicine</Text>
                <Text>{item.name} :  {item.medicine} {item.medicine===1 ? `pill`: `pills`}</Text>
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      );
    }
    if (item.activity) {
      cards.push(
        <TouchableOpacity key={item.key} onPress={() => alertItem('Asthma Activity', 'Attack', item.time, item.note, item.activity, item.activity===1 ? `time`: `times`)} style={[styles.item, { borderLeftColor: activity.color }]}>
          <Card>
            <Card.Content>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text>{item.time} |  Asthma Activity</Text>
                <Text>{item.activity} {item.activity===1 ? `time`: `times`}</Text>
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      );
    }
    return cards.length > 0 && <View>{cards}</View>;
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <Agenda
          items={items}
          loadItemsForMonth={loadItems}
          renderItem={renderItem}
          markingType={'multi-dot'}
          markedDates={markedDates}
          renderEmptyDate={() => {
            return (
              <View /> //instead of ActivityIndicator
            );
          }}
          renderEmptyData={() => {
            return (
              <View style={{flex:1, justifyContent: 'flex-start', marginTop: 20, alignItems: 'center'}}>
                <Image source={require('../assets/no-event-calendar.png')} resizeMode='contain' style={{height: 250, opacity: 0.8}}/>
                <Text style={styles.titleText}>Oopsie daisy!</Text>
                <Text style={styles.text}>No events to show yet.</Text>
                <Text style={styles.textContent}>No events to show yet. Start tracking your peak flow, inhaler, medication, and asthma activity info to improve your asthma management.</Text>
              </View>
            );
          }}
          theme={{
            agendaDayTextColor: 'black',
            agendaDayNumColor: 'black',
            agendaTodayColor: 'red',
            agendaKnobColor: '#F5E1A4',
            selectedDayBackgroundColor: '#F1EAE4',
            selectedDayTextColor: '#012250',
          }}
        />
      )}
      <StatusBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: imageWidth,
  },
  item: {
    borderRadius: 5,
    // paddingTop: 20,
    marginRight: 10,
    marginTop: 17 + 20,
    borderLeftWidth: 4,
  },
  text: {
      fontFamily: 'Prompt-Medium',
      alignSelf: 'center',
      textAlign: 'center',
      marginHorizontal: 30,
      fontSize: 15,
      marginVertical: 10
  },
  textContent: {
    fontFamily: 'Prompt-Light',
    alignSelf: 'center',
    textAlign: 'center',
    marginHorizontal: 30,
    marginVertical: 10,
},
  titleText: {
      fontSize: 20,
      fontWeight: "bold",
      fontFamily: 'Prompt-Bold',
  },
});

export default CalendarPage;
