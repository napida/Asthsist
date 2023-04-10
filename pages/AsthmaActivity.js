import React, { useState } from 'react'
import { View, Dimensions, Alert, ScrollView } from 'react-native'
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import firebaseConfig from '../database/firebaseDB';
import TrackerComponent from '../components/TrackerComponent';
import PrimaryButton from '../components/PrimaryButton';
import LinearGradient from 'react-native-linear-gradient';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

const imageWidth = Dimensions.get('window').width;

const AsthmaActivityPage = ({ navigation }) => {
    const [date, setDate] = useState(new Date())
    const [openDate, setOpenDate] = useState(false)

    const [note, onChangeNoteText] = useState(null);
    const [activityLevel, setActivityLevel] = useState(0); // define activityLevel state variable here


    const saveAsthmaActivityData = (uid) => {
        db.ref(`/AsthmaActivityData/${firebase.auth().currentUser.uid}`).push({
            time: date.toString(),
            activity: activityLevel,
            note: note,
            userUID: firebase.auth().currentUser.uid
        });
    }

    return (
        <LinearGradient
            colors={['#FFA500', '#F7DC6F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            <ScrollView>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TrackerComponent
                        onConfirmDateFuntion={(date) => { setDate(date), setOpenDate(false) }}
                        setTrueOpenDate={() => setOpenDate(true)}
                        setFalseOpenDate={() => setOpenDate(false)}
                        onChangeNote={(text) => onChangeNoteText(text)}
                        placeholderNote="E.g. because of exercise"
                        date={date}
                        openDate={openDate}
                        onDateChange={setDate}
                        numberTitle="Number of Times"
                        isDisabled={activityLevel > 0 ? false : true}
                        decreaseFunction={() => {
                            if (activityLevel > 0) {
                                setActivityLevel(activityLevel - 1);
                            }
                        }}
                        numberValue={activityLevel}
                        increaseFunction = {() => setActivityLevel(activityLevel + 1)}
                        titleNoteStyle={{color: 'black'}}
                    />
                    <View style={{ width: imageWidth / 2 }}>
                        <PrimaryButton
                            title="Add to Calendar"
                            onPress={() => {
                                if (activityLevel == 0) {
                                    Alert.alert(
                                        "Please enter number of asthma attacks",
                                        '',
                                        [
                                            {
                                                text: "OK",
                                            }
                                        ]
                                    );
                                }
                                else {
                                    Alert.alert(
                                        "Do you want to add to calendar?",
                                        '',
                                        [
                                            {
                                                text: "Cancel",
                                                onPress: () => console.log("Cancel Pressed"),
                                                style: "cancel"
                                            },
                                            {
                                                text: "OK", onPress: () => {
                                                    saveAsthmaActivityData(firebase.auth().currentUser.uid);
                                                    Alert.alert(
                                                        'Success',
                                                        'Event added to calendar successfully!',
                                                        [
                                                          {
                                                            text: 'OK',
                                                            onPress: () => navigation.navigate('Calendar')
                                                          }
                                                        ]
                                                      )
                                                }
                                            }
                                        ]
                                    );
                                }
                            }}
                        />
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    )
}

export default AsthmaActivityPage;