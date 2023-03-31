import React, { useState } from 'react'
import { Button, Text, View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, TextInput, Alert } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Divider } from 'react-native-elements';
import DatePicker from 'react-native-date-picker'
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import firebaseConfig from '../database/firebaseDB';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

const imageWidth = Dimensions.get('window').width;

const PeakFlowPage = ({ navigation }) => {
  const [date, setDate] = useState(new Date())
  const [openDate, setOpenDate] = useState(false)
  const formatDate = (date) => {
    const options = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };
  const [value, onChangeText] = useState(null);
  const [note, onChangeNoteText] = useState(null);

  const savePeakFlowData = (uid) => {
    db.ref(`/PeakFlowData/${firebase.auth().currentUser.uid}`).push({
      time: date.toString(),
      peakflow: value,
      note: note,
      timeforref: date.toISOString(),
      userUID: firebase.auth().currentUser.uid
    });
  }

  return (
    <ScrollView>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.datetime}>
          <View style={styles.dateContainer}>
            <Text style={styles.text}>{formatDate(date)}</Text>
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
        </View>
        <Divider width={5} />
        <View style={styles.timeContainer}>
          <Text style={styles.textTime}>TIMES</Text>
          <View style={{ alignSelf: 'center', borderTopWidth: 4, borderTopColor: '#F5E1A4' }}>
            <DatePicker mode="time" date={date} onDateChange={setDate} />
          </View>
        </View>
        <Divider width={20} />
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={text => onChangeText(text)}
            editable
            placeholder="input peak flow..."
            value={value}
            style={styles.input}
            keyboardType="numeric"
          />
          <Text style={styles.prefix}>L/min</Text>
        </View>
        <View style={{ width: imageWidth - 50, marginVertical: 20, marginTop: 30 }}>
          <Text>Note</Text>
          <TextInput
            multiline
            numberOfLines={3}
            editable
            maxLength={40}
            onChangeText={(text) => onChangeNoteText(text)}
            placeholder="E.g. because of exercise"
            value={note}
            style={styles.inputNote}
          />
        </View>
        <View style={{ width: imageWidth / 2 }}>
          <Button
            title="Add to Calendar"
            onPress={() => {
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
                      navigation.navigate('Calendar')
                    }
                  }
                ]
              );
            }}
          />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  textTime: {
    fontFamily: 'Prompt-Medium',
    color:
      '#012250',
    fontSize: 18,
    alignSelf: 'center',
  },
  text: {
    fontFamily: 'Prompt-Regular',
    color: '#012250',
    fontSize: 16,
    alignSelf: 'center'
  },
  datetime: {
    backgroundColor: '#fff',
    marginTop: 35,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    paddingHorizontal: 30,
    width: imageWidth - 50,
    backgroundColor: '#F5E1A4'
  },
  timeContainer: {
    width: imageWidth - 50,
    padding: 20,
    backgroundColor: '#FFF',
  },
  inputNote: {
    paddingHorizontal: 20,
    paddingTop: 0,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#D9D9D9',
    marginTop: 10,
  },
  input: {
    height: 40,
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
    width: imageWidth - 50,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  prefix: {
    paddingHorizontal: 10,
    fontWeight: 'bold',
    color: 'black'
  }
})

export default PeakFlowPage;