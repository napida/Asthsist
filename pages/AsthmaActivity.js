import React, { useState } from 'react'
import { Button, Text, View, StyleSheet, Dimensions, TouchableOpacity, TextInput, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import DatePicker from 'react-native-date-picker'
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import firebaseConfig from '../database/firebaseDB';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

const imageWidth = Dimensions.get('window').width;
const getPeakFlowData = (uid) => {
    db.ref(`/PeakFlowData/${uid}`).on('value', (snapshot) => {
      const peakFlowData = snapshot.val();
      console.log(peakFlowData); // Or do something else with the data
    });
  }
  
const AsthmaActivityPage = ({ navigation }) => {
    const [date, setDate] = useState(new Date())
    const [openDate, setOpenDate] = useState(false)
    const getCurrentDate = () => {
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var year = date.getFullYear();
        return month + '/' + day + '/' + year;//format: m/d/y;
    }
    const [value, onChangeText] = useState(null);
    const [note, onChangeNoteText] = useState(null);
    const [activityLevel, setActivityLevel] = useState(0); // define activityLevel state variable here


    const saveAsthmaActivityData = (uid) => {
        db.ref(`/AsthmaActivityData/${uid}`).push({
            time: date.toString(),
            activity: activityLevel,
            note: note
        });
    }

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.dateContainer}>
                <Text style={styles.text}>{getCurrentDate()}</Text>
                <TouchableOpacity onPress={() => setOpenDate(true)}>
                    <Ionicons name="calendar-sharp" size={30} />
                </TouchableOpacity>
            </View>
            <DatePicker
                modal
                mode="date"
                open={openDate}
                date={date}
                onConfirm={(date) => {
                    setOpenDate(false)
                    setDate(date)
                }}
                onCancel={() => {
                    setOpenDate(false)
                }}
            />
            <View style={styles.timeContainer}>
                <Text style={styles.textTime}>TIMES</Text>
                <View style={{ alignSelf: 'center', borderTopWidth: 4, borderTopColor: '#F5E1A4' }}>
                    <DatePicker mode="time" date={date} onDateChange={setDate} />
                </View>
            </View>
            <View style={styles.activityContainer}>0
                <TouchableOpacity onPress={() => {
                    if (activityLevel > 0) {
                        setActivityLevel(activityLevel - 1);
                    }
                }}>
                    <Icon name="remove-circle-outline" size={30} />
                </TouchableOpacity>
                <Text style={styles.activityLevel}>{activityLevel}</Text>
                <TouchableOpacity onPress={() => setActivityLevel(activityLevel + 1)}>
                    <Icon name="add-circle-outline" size={30} />
                </TouchableOpacity>
            </View>

            <View>
                <TextInput
                    multiline
                    numberOfLines={4}
                    editable
                    maxLength={40}
                    onChangeText={(text) => onChangeNoteText(text)}
                    placeholder="note..."
                    value={note}
                    style={styles.inputNote}
                />
            </View>
            <View style={{ width: imageWidth / 2, margin: 20 }}>
                <Button
                    title="Add to Calendar"
                    onPress={() => {
                        saveAsthmaActivityData(firebase.auth().currentUser.uid);
                        Alert.alert(
                            "Do you want to add to calendar?",
                            '',
                            [
                                {
                                    text: "Cancel",
                                    onPress: () => console.log("Cancel Pressed"),
                                    style: "cancel"
                                },
                                { text: "OK", onPress: () => navigation.navigate('Calendar') }
                            ]
                        );
                    }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    textTime: {
        fontFamily: 'Prompt-Medium',
        color: '#012250',
        fontSize: 18,
        alignSelf: 'center',
    },
    text: {
        fontFamily: 'Prompt-Regular',
        color: '#012250',
        fontSize: 16,
        alignSelf: 'center'
    },
    dateContainer: {
        flexDirection: 'row',
        backgroundColor: '#F1EAE4',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 4,
        borderRadius: 8,
        justifyContent: 'space-between',
        marginVertical: 35,
        padding: 10,
        paddingHorizontal: 30,
        width: imageWidth - 50
    },
    timeContainer: {
        width: imageWidth - 50,
        padding: 20,
        backgroundColor: '#FFF',
        marginBottom: 30,
    },
    inputNote: {
        paddingHorizontal: 20,
        width: imageWidth - 80,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        marginTop: 20
    },
    input: {
        // borderWidth: 1,
        height: 40,
        // margin: 12,
        paddingHorizontal: 20,
        width: imageWidth - 150,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5E1A4',
        marginHorizontal: 10,
        borderRadius: 5,
        padding: 5,
    },
    prefix: {
        paddingHorizontal: 10,
        fontWeight: 'bold',
        color: 'black'
    }
    ,
    activityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 150,
        borderRadius: 5,
    },
    activityLevel: {
        fontFamily: 'Prompt-Regular',
        color: '#012250',
        fontSize: 20,
        marginHorizontal: 20,
    }
})

export default AsthmaActivityPage;