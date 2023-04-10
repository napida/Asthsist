import React, { useState } from 'react'
import { View, ScrollView, Dimensions, Alert } from 'react-native'
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

const PeakFlowPage = ({ navigation }) => {
  const [date, setDate] = useState(new Date())
  const [openDate, setOpenDate] = useState(false)

  const [value, onChangeText] = useState('');
  const [note, onChangeNoteText] = useState(null);

  const savePeakFlowData = () => {
    db.ref(`/PeakFlowData/${firebase.auth().currentUser.uid}`).push({
      time: date.toString(),
      peakflow: value,
      note: note,
      timeforref: date.toISOString(),
      userUID: firebase.auth().currentUser.uid
    });
  }
  return (
    <LinearGradient
      colors={['#6D5DC6', '#A36EDF']}
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
            onChangeTextFunction={text => onChangeText(text)}
            placeholderText="input Peak flow..."
            inputTitle="Peak flow"
            keyboradTypeText="numeric"
            InputPrefix="L/min"
            onChangeNote={(text) => onChangeNoteText(text)}
            placeholderNote="E.g. because of exercise"
            date={date}
            openDate={openDate}
            onDateChange={setDate}
          />
          <View style={{ width: imageWidth / 2 }}>
            <PrimaryButton
              title="Add to Calendar"
              onPress={() => {
                const trimmedValue = value.trim();
                if (trimmedValue === '') {
                  Alert.alert(
                    "Please input your peak flow value",
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
                          savePeakFlowData(firebase.auth().currentUser.uid);
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
              }
              }
            />
          </View>

        </View>
      </ScrollView>
    </LinearGradient>
  )
}

export default PeakFlowPage;