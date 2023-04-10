import React, { useState } from 'react'
import { Text, View, StyleSheet, Modal, Dimensions, TextInput, Alert, ScrollView } from 'react-native'
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import firebaseConfig from '../database/firebaseDB';
import DropDownPicker from 'react-native-dropdown-picker';
import TrackerComponent from '../components/TrackerComponent';
import LinearGradient from 'react-native-linear-gradient';
import PrimaryButton from '../components/PrimaryButton';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

const imageWidth = Dimensions.get('window').width;

const InhalerPage = ({navigation}) => {
  const [date, setDate] = useState(new Date())
  const [openDate, setOpenDate] = useState(false)

  const [note, onChangeNoteText] = useState(null);
  const [usage, setUsage] = useState(0); // define Usage state variable here
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(null);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Accuhaler', value: 1 },
    { label: 'Ellipta', value: 2 },
    { label: 'EVOHALER', value: 3 },
    { label: 'Handihaler', value: 4 },
    { label: 'Respimat', value: 5 },
    { label: 'Turbuhaler', value: 6 },
  ]);

  const [text, setText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const addItem = () => {
    const trimmedValue = text.trim();
    if (trimmedValue === '') {
      Alert.alert(
        "Please input inhaler name",
        '',
        [
          {
            text: "OK",
          }
        ]
      );
      return;
    }
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

  const saveInhalerData = (uid) => {
    db.ref(`/Inhaler/${firebase.auth().currentUser.uid}`).push({
      time: date.toString(),
      name: name,
      usage: usage,
      note: note,
      userUID: firebase.auth().currentUser.uid
    });
  }

  const toggleModalVisibility = () => {
    setIsModalVisible(!isModalVisible);
    setValue('Select your inhaler')
  };



  return (
    <LinearGradient
      colors={['#3D6BBF', '#7CA1CC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
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
            isDisabled={usage > 0 ? false : true}
            decreaseFunction={() => {
              if (usage > 0) {
                setUsage(usage - 1);
              }
            }}
            numberValue={usage}
            increaseFunction={() => setUsage(usage + 1)}
            titleNoteStyle={{ color: 'white' }}
            DropDownComponent={(
              <>
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
                        <PrimaryButton buttonStyle={{borderRadius: 5, width: 100, paddingHorizontal: 15, backgroundColor: '#fff'}} title="Cancel" onPress={toggleModalVisibility} />
                        <PrimaryButton buttonStyle={{borderRadius: 5, width: 100, paddingHorizontal: 15}} title="Add" onPress={addItem} />
                      </View>
                    </View>
                  </View>
                </Modal>
                <DropDownPicker
                  open={open}
                  value={value}
                  items={dropdownItems}
                  placeholder="Select your inhaler"
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setItems}
                  containerStyle={{ width: imageWidth - 60, alignSelf: 'center' }}
                  listMode="SCROLLVIEW"
                  onSelectItem={(item) => {
                    item.value === 'add' && setIsModalVisible(!isModalVisible)
                    setName(item.label)
                  }}
                  style={{
                    borderWidth: 0,
                    borderRadius: 0,
                    paddingLeft: 30,
                    backgroundColor: '#7DC7CD'
                  }}
                  textStyle={styles.text}
                />
              </>
            )}
          />
          <PrimaryButton
            title="Add to Calendar"
            onPress={() => {
              if (usage == 0 || !name || name === 'Add') {
                Alert.alert(
                  "Please input your inhaler and number of times",
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
                        saveInhalerData(firebase.auth().currentUser.uid);
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
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Prompt-Regular',
    color: '#012250',
    fontSize: 16,
    alignSelf: 'center'
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
    borderWidth: 2,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: '#517EB9'
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
  }
})

export default InhalerPage;