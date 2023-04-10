import React, { useState } from 'react'
import { Button, Text, View, StyleSheet, Modal, Dimensions, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native'
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import firebaseConfig from '../database/firebaseDB';
import DropDownPicker from 'react-native-dropdown-picker';
import LinearGradient from 'react-native-linear-gradient';
import TrackerComponent from '../components/TrackerComponent';
import PrimaryButton from '../components/PrimaryButton';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

const imageWidth = Dimensions.get('window').width;

const MedicinePage = ({ navigation }) => {
  const [date, setDate] = useState(new Date())
  const [openDate, setOpenDate] = useState(false)

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
    setValue('Select your Medicine')
  };

  return (
    <LinearGradient
      colors={['#FF4136', '#A36EDF']}
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
            numberTitle="Number of Pills"
            isDisabled={usage > 0 ? false : true}
            decreaseFunction={() => {
              if (usage > 0) {
                setUsage(usage - 1);
              }
            }}
            numberValue={usage}
            increaseFunction={() => setUsage(usage + 1)}
            titleNoteStyle={{ color: 'black' }}
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
                        <PrimaryButton buttonStyle={{ borderRadius: 5, width: 100, paddingHorizontal: 15, backgroundColor: '#fff' }} title="Cancel" onPress={toggleModalVisibility} />
                        <PrimaryButton buttonStyle={{ borderRadius: 5, width: 100, paddingHorizontal: 15 }} title="Add" onPress={addItem} />
                      </View>
                    </View>
                  </View>
                </Modal>
                <DropDownPicker
                  open={open}
                  value={value}
                  items={dropdownItems}
                  placeholder="Select your medicine"
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
          <View style={{ width: imageWidth / 2, marginBottom: 35 }}>
            <PrimaryButton
              title="Add to Calendar"
              onPress={() => {
                if (usage == 0 || !name || name === 'Add') {
                  Alert.alert(
                    "Please input your medicine and number of pills",
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
                          saveMedicineData(firebase.auth().currentUser.uid);
                          Alert.alert(
                            'Success',
                            'Event added to calendar successfully!',
                            [
                              {
                                text: 'OK',
                                onPress: () => navigation.reset({
                                  index: 0,
                                  routes: [{ name: 'Calendar Tab' }],
                                })
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
})

export default MedicinePage;