import React, { useState } from 'react'
import { Button, Text, View, StyleSheet, Modal, Dimensions, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Icon from 'react-native-vector-icons/AntDesign'
import { Divider } from 'react-native-elements';
import DatePicker from 'react-native-date-picker'
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import firebaseConfig from '../database/firebaseDB';
import DropDownPicker from 'react-native-dropdown-picker';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

const imageWidth = Dimensions.get('window').width;

const MedicinePage = ({ navigation }) => {
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
  const [note, onChangeNoteText] = useState(null);
  const [usage, setUsage] = useState(0); // define Usage state variable here
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(null);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Ephedrine', value: 1 },
    { label: 'Aminophylline', value: 2 },
    { label: 'Salbutamol', value: 3 },
    { label: 'Tedral', value: 4 },
    { label: 'Franol', value: 5 },
  ]);

  const [text, setText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const addItem = () => {
    const newItem = { label: text, value: items.length + 1 };
    setItems([...items, newItem]);
    setText('');
    setValue(newItem.value);
    setName(newItem.label)
    setIsModalVisible(false);
  };

  const dropdownItems = [
    ...items,
    { label: 'Add', value: 'add', icon: () => <Text style={styles.addIcon}>+</Text> },
  ];

  const saveMedicineData = (uid) => {
    db.ref(`/Medicine/${firebase.auth().currentUser.uid}`).push({
      time: date.toString(),
      name: name,
      usage: usage,
      note: note,
      userUID: firebase.auth().currentUser.uid 
    });
  }

  const toggleModalVisibility = () => {
    setIsModalVisible(!isModalVisible);
  };



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
        <Modal visible={isModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modal}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.input}
                value={text}
                onChangeText={setText}
                placeholder="Enter item text"
              />
              <View style={styles.modalButtons}>
                <Button title="Cancel" onPress={toggleModalVisibility} />
                <Button title="Add" onPress={addItem} />
              </View>
            </View>
          </View>
        </Modal>
        <DropDownPicker
          open={open}
          value={value}
          items={dropdownItems}
          placeholder="Select your Medicine"
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          containerStyle={{ width: imageWidth - 50, alignSelf: 'center' }}
          listMode="SCROLLVIEW"
          onSelectItem={(item) => {
            console.log(item)
            item.value === 'add' && setIsModalVisible(!isModalVisible)
            setName(item.label)
          }}
          style={{
            borderWidth: 0,
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 4,
            paddingLeft: 30
          }}
          textStyle={styles.text}
        />
        <Divider width={5} />
        <View style={styles.timeContainer}>
          <Text style={styles.textTime}>TIMES</Text>
          <View style={{ alignSelf: 'center', borderTopWidth: 4, borderTopColor: '#F5E1A4' }}>
            <DatePicker mode="time" date={date} onDateChange={setDate} />
          </View>
        </View>
        <Divider width={20} />
        <View style={styles.numberOfTimes}>
          <View style={{ flex: 2 }}>
            <Text style={[styles.textTime, { textAlign: 'center' }]} >Number of Times</Text>
          </View>
          <View style={styles.activityContainer}>
            <TouchableOpacity
              disabled={usage > 0 ? false : true}
              style={[styles.buttonContainer, { opacity: usage <= 0 && 0.5 }]}
              onPress={() => {
                if (usage > 0) {
                  setUsage(usage - 1);
                }
              }}>
              <Icon name="minuscircle" size={30} color='#72BFB9' />
            </TouchableOpacity>
            <Text style={[styles.usage, { width: 30, textAlign: 'center' }]}>{usage}</Text>
            <TouchableOpacity
              style={[styles.buttonContainer, { paddingRight: 0 }]}
              onPress={() => setUsage(usage + 1)}>
              <Icon name="pluscircle" size={30} color='#72BFB9' />
            </TouchableOpacity>
          </View>
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
        <View style={{ width: imageWidth / 2, marginBottom: 35 }}>
          <Button
            title="Add to Calendar"
            onPress={() => {
              saveMedicineData(firebase.auth().currentUser.uid);
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
    </ScrollView>
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
  addIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  numberOfTimes: {
    paddingVertical: 10,
    width: imageWidth - 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f8f7',
    borderRadius: 20,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  activityContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: 5,
    marginHorizontal: 30,
    marginVertical: 10,
  },
  buttonContainer: {
    paddingHorizontal: 10,
  },
  usage: {
    fontFamily: 'Prompt-Regular',
    color: '#012250',
    fontSize: 20,
  },
})

export default MedicinePage;