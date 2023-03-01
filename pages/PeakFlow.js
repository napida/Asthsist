import React, { useState } from 'react'
import { Button, Text, View, StyleSheet, Dimensions, TouchableOpacity, TextInput, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import DatePicker from 'react-native-date-picker'
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import firebaseConfig from '../database/firebaseDB';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

const imageWidth = Dimensions.get('window').width;

const PeakFlowPage = ({navigation}) => {
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
  
  const savePeakFlowData = (uid) => {
    db.ref(`/PeakFlowData/${uid}`).push({
      time: date.toString(),
      peakflow: value,
      note: note
    });
  }
  
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.dateContainer}>
        <Text style={styles.text}>{getCurrentDate()}</Text>
        <TouchableOpacity onPress={() => setOpenDate(true)}>
          <Icon name="calendar-sharp" size={30} />
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
        <View style={{alignSelf:'center', borderTopWidth: 4, borderTopColor: '#F5E1A4' }}>
          <DatePicker  mode="time" date={date} onDateChange={setDate} />
        </View>
      </View>
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
      <View style={{width: imageWidth/2, margin: 20}}>
      <Button
        title="Add to Calendar"
        onPress={() => {
          savePeakFlowData(firebase.auth().currentUser.uid);          Alert.alert(
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
    width: imageWidth -50,
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
    // shadowOffset: { width: 2, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
    // elevation: 4, 
  },
  prefix: {
    paddingHorizontal: 10,
    fontWeight: 'bold',
    color: 'black'
  }
})

export default PeakFlowPage;