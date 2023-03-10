import React, { useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Button, Alert } from 'react-native'
import DatePicker from 'react-native-date-picker'
import Icon from 'react-native-vector-icons/Ionicons';
import InputField from '../components/InputField';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import firebaseConfig from '../database/firebaseDB';
import RadioForm from 'react-native-simple-radio-button';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

const Profile = () => {
    const user = firebase.auth().currentUser;
    const [userInfo, setUserInfo] = useState({
        name: user.displayName,
        DOB: '',
        phone: '',
        gender: '',
        height: '',
        weight: '',
    });
    const [name, setName] = useState(userInfo.name);
    const [DOB, setDOB] = useState(userInfo.DOB);
    const [phone, setPhone] = useState(userInfo.phone);
    const [gender, setGender] = useState(userInfo.gender)
    const [height, setHeight] = useState(userInfo.height);
    const [weight, setWeight] = useState(userInfo.weight);
    const [editingEnabled, setEditingEnabled] = useState(false);
    const genderOption = [
        { label: 'Male', value: 1 },
        { label: 'Female', value: 2 },
    ];

    const [date, setDate] = useState(new Date())
    const [openDate, setOpenDate] = useState(false)

    const enableEditing = () => {
        setName(userInfo.name);
        setDOB(userInfo.DOB);
        setPhone(userInfo.phone);
        setGender(userInfo.gender);
        setHeight(userInfo.height);
        setWeight(userInfo.weight);
        setEditingEnabled(true);
    };

    const saveChanges = () => {
        setUserInfo({ name, DOB, phone, gender, height, weight });
        Alert.alert(
            "Are you sure?",
            null,
            [
              { text: "OK", onPress: () =>  setEditingEnabled(false)},
              {
                text: 'Cancel',
                style: 'cancel',
              }
            ]
          )
    };

    const editUserInfo = () => {
        enableEditing();
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View>
                {editingEnabled ? (
                    <View style={{ padding: 20 }}>
                        <Text style={[styles.title, { marginBottom: 30 }]}>User Detail</Text>
                        <InputField
                            isInput={true}
                            leftFiled='Fullname'
                            placeholder={userInfo.name ? userInfo.name : 'Not set'}
                            onChangeText={(value) => setName(value)}
                            style={styles.text}
                        />
                        <InputField
                            leftFiled='Date of Birth'
                            iconRightFiled={<Icon name="calendar" size={30} />}
                            fieldIconRightFunction={() => setOpenDate(true)}
                            detail={date.toLocaleDateString()}
                        />
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
                        <InputField
                            isInput={true}
                            leftFiled='Phone'
                            fieldIconRigheditUserInfotFunction={() => setOpenDate(true)}
                            placeholder={!!userInfo.phone ? userInfo.phone : 'Not set'}
                        />
                        <InputField
                            isInput={true}
                            leftFiled='Gender'
                            detail={!!userInfo.gender ? userInfo.gender : 'Not set'}
                            detailProps={
                                <View>
                                    <RadioForm
                                        style={{ flexDirection: 'row' }}
                                        radioStyle={{ paddingRight : 20 }}
                                        labelStyle={{ fontFamily: 'Prompt-Regular', fontSize: 15 }}
                                        buttonColor={'#49C0B8'}
                                        selectedButtonColor={'#49C0B8'}
                                        buttonSize={9}
                                        buttonOuterSize={19}
                                        animation={false}
                                        radio_props={genderOption}
                                        initial={-1} //initial value of this group
                                        onPress={(value) => {
                                            setGender(value)
                                        }}
                                    />
                                </View>
                            }
                        />
                        <InputField
                            isInput={true}
                            leftFiled='Height'
                            onChangeText={(value) => setHeight(value)}
                            rightField='cm'
                            placeholder={!!userInfo.height ? userInfo.height : 'Not set'}
                        />
                        <InputField
                            isInput={true}
                            leftFiled='Weight'
                            onChangeText={(value) => setWeight(value)}
                            rightField='kg'
                            placeholder={!!userInfo.weight ? userInfo.weight : 'Not set'}
                        />
                        <Button title='Save changes' onPress={saveChanges} />
                    </View>
                ) : (
                    <View style={{ padding: 20 }}>
                        <Text style={[styles.title, { marginBottom: 30 }]}>User Detail</Text>
                        <InputField
                            isInput={false}
                            leftFiled='Fullname'
                            detail={userInfo.name ? userInfo.name : 'Not set'}
                            style={styles.text}
                        />
                        <InputField
                            leftFiled='Date of Birth'
                            fieldIconRightFunction={() => setOpenDate(true)}
                            detail={userInfo.DOB ? date.toLocaleDateString() : 'Not set'}
                        />
                        <InputField
                            leftFiled='Phone'
                            fieldIconRightFunction={() => setOpenDate(true)}
                            detail={!!userInfo.phone ? userInfo.phone : 'Not set'}
                        />
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
                        <InputField
                            leftFiled='Gender'
                            detail={!!userInfo.gender ? userInfo.gender : 'Not set'}
                        />
                        <InputField
                            isInput={false}
                            leftFiled='Height'
                            detail={!!userInfo.height ? userInfo.height : 'Not set'}
                            rightField='cm'
                        />
                        <InputField
                            isInput={false}
                            leftFiled='Weight'
                            detail={!!userInfo.weight ? userInfo.weight : 'Not set'}
                            rightField='kg'
                        />
                        <TouchableOpacity onPress={editUserInfo} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon name="pencil" size={20} color='blue' />
                            <Text style={[styles.text, { paddingLeft: 10, color: 'blue' }]}>Edit your detail</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Prompt-Medium',
        color: '#012250',
        fontSize: 17,
    },
    title: {
        fontFamily: 'Prompt-Bold',
        color: '#012250',
        fontSize: 24,
        alignSelf: 'center'
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginBottom: 30
    },
});

export default Profile;