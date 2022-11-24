import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Card } from 'react-native-paper';

const imageWidth = Dimensions.get('window').width;
const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
}

const peakFlow = {key: 'peakFlow', color: 'red', selectedDotColor: 'red'};
const inhaler = {key: 'inhaler', color: 'blue', selectedDotColor: 'blue'};
const activity = {key: 'activity', color: 'green', selectedDotColor: 'green'};

const Calendar = () => {
    const [items, setItems] = React.useState({});

    const loadItems = (day, ) => {

        setTimeout(() => {
            for (let i = -15; i < 20; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = timeToString(time);
                if (!items[strTime]) {
                    items[strTime] = [];
                    const numItems = Math.floor(Math.random() * 3 + 1);
                    if(strTime=='2022-11-25'){
                        // for (let j = 0; j < 1; j++) {
                        //     items[strTime].push({
                        //         name: 'Item for ' + strTime + ' #' + j,
                        //         height: Math.max(10, Math.floor(Math.random() * 150)),
                        //         day: strTime
                        //     });
                        // }
                        items[strTime].push(
                        {
                            name: '12:00 | Peak flow 650 L/min',
                            height: Math.max(10, Math.floor(Math.random() * 150)),
                            day: strTime,
                            borderLeftColor: 'red'
                        },
                        {
                            name: '12:00 | Inhaler 1 times',
                            height: Math.max(10, Math.floor(Math.random() * 150)),
                            day: strTime,
                            borderLeftColor: 'blue'
                        },
                        );
                    }
                    else if(strTime=='2022-11-26'){
                        items[strTime].push(
                        {
                            name: '12:00 | Peak flow 750 L/min',
                            height: Math.max(10, Math.floor(Math.random() * 150)),
                            day: strTime,
                            borderLeftColor: 'red'
                        },
                        {
                            name: '12:00 | Inhaler 2 times',
                            height: Math.max(10, Math.floor(Math.random() * 150)),
                            day: strTime,
                            borderLeftColor: 'blue'
                        },
                        {
                            name: '12:00 | Asthma Attack 2 times',
                            height: Math.max(10, Math.floor(Math.random() * 150)),
                            day: strTime,
                            borderLeftColor: 'green'
                        }
                        );
                    }
                }
            }
            
            const newItems = {};
            Object.keys(items).forEach(key => {
                newItems[key] = items[key];
            });
            setItems(newItems);
        }, 1000);
    }

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
    }
    
    return (
        <View style={styles.container}>
            
            <Agenda
                items={items}
                loadItemsForMonth={loadItems}
                selected={'2022-11-24'}
                refreshControl={null}
                showClosingKnob={true}
                refreshing={false}
                renderItem={renderItem}
                markingType={'multi-dot'}
                markedDates={{
                    '2022-11-25': { dots: [peakFlow, inhaler, activity]},
                    '2022-11-26': { dots: [inhaler, activity]}
                }}
                // markedDates={{
                //     '2012-05-16': { selected: true, marked: true },
                //     '2012-05-17': { marked: true },
                //     // '2012-05-18': {disabled: true}
                // }}
            />
            <StatusBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: imageWidth,
    },
    item: {
        borderRadius: 5,
        // paddingTop: 20,
        marginRight: 10,
        marginTop: 17+20,
        borderLeftWidth:4,
    },
});

export default Calendar;