import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Card } from 'react-native-paper';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import firebaseConfig from '../database/firebaseDB';
import moment from 'moment';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

const imageWidth = Dimensions.get('window').width;
const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
};

const peakFlow = { key: 'peakFlow', color: 'red', selectedDotColor: 'red' };
const inhaler = { key: 'inhaler', color: 'blue', selectedDotColor: 'blue' };
const activity = { key: 'activity', color: 'green', selectedDotColor: 'green' };

const CalendarPage = () => {
    const [items, setItems] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const markedDates = Object.keys(items).reduce((obj, key) => {
        obj[key] = { dots: [] };
        items[key].forEach((item) => {
            if (item.peakflow) {
                obj[key].dots.push(peakFlow);
            }
            if (item.inhaler) {
                obj[key].dots.push(inhaler);
            }
            if (item.note) {
                obj[key].dots.push(activity);
            }
        });
        return obj;
    }, {});

    const loadItems = async (day) => {
        console.log("Loading items...");
        const start = new Date(day.timestamp).setHours(0, 0, 0, 0);
        const end = new Date(day.timestamp).setHours(23, 59, 59, 999);
        const uid = firebase.auth().currentUser.uid;
        console.log(uid);
        console.log("db", db);
        console.log("db.ref", db.ref(`/PeakFlowData/${uid}`));
        try {
          const snapshotPeakFlow = await db.ref('PeakFlowData/').once('value');
          console.log('snapshotPeakFlow', snapshotPeakFlow);
          const peakFlowData = snapshotPeakFlow.val();

          const snapshotAsthmaActivity = await db.ref('AsthmaActivityData/').once('value');
          console.log('snapshotAsthmaActivity', snapshotAsthmaActivity);
          const asthmaActivityData = snapshotAsthmaActivity.val();
          
          if (peakFlowData === null && asthmaActivityData === null) {
            console.log("No events found");
            setIsLoading(false);
            return;
          }
          console.log('peakFlowData', peakFlowData);
          console.log('asthmaActivityData', asthmaActivityData);
          const items = {};
          Object.entries(peakFlowData).forEach(([parentKey, parentEvent]) => {
            Object.entries(parentEvent).forEach(([key, event]) => {
              console.log("peakflow event.time",event.time);
              const date = moment(event.time, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();
              const strTime = timeToString(date.getTime());
              if (!items[strTime]) {
                items[strTime] = [];
              }
              items[strTime].push({
                key: key,
                date: date.toLocaleDateString(),
                time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                peakflow: event.peakflow,
                note: event.note
              });
            });
          });
          Object.entries(asthmaActivityData).forEach(([parentKey, parentEvent]) => {
            Object.entries(parentEvent).forEach(([key, event]) => {
              console.log("activity event.time",event.time);
              const date = moment(event.time, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();
              const strTime = timeToString(date.getTime());
              if (!items[strTime]) {
                items[strTime] = [];
              }
              items[strTime].push({
                key: key,
                date: date.toLocaleDateString(),
                time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                activity: event.activity,
                note: event.note
              });
            });
          });
          setItems(items);
          setIsLoading(false);
          console.log("Data loaded:", items);
        } catch (error) {
          console.error("Error loading items:", error);
        }
      };
      
    

    useEffect(() => {
        loadItems({ timestamp: Date.now() });
    }, []);

    const renderItem = (item) => {
        return (
            <TouchableOpacity onPress={() => Alert.alert(item.name)} style={[styles.item, {borderLeftColor: item.borderLeftColor}]}>
            <Card>
              <Card.Content>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text>{item.name}</Text>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        );
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
});

export default CalendarPage;
