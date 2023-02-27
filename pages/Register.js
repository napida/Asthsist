import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, Text, TextInput, TouchableOpacity, SafeAreaView, View, Alert } from 'react-native';
import firebase from 'firebase/compat/app';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Input } from 'react-native-elements';
import FeatherIcons from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleFullNameChange = (newFullName) => {
    setFullName(newFullName);
  };

  const handleEmailChange = (newEmail) => {
    setEmail(newEmail);
  };

  const handlePasswordChange = (newPassword) => {
    setPassword(newPassword);
  };
  const navigation = useNavigation();
  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      console.log('Please enter all fields');
      return;
    }
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      const currentUser = firebase.auth().currentUser;
      await currentUser.updateProfile({
        displayName: fullName,
      });
      Alert.alert('Registration Successful', `Welcome ${fullName}!`);
      // navigation.navigate('Login');
      // Signup successful, do something here like redirect the user to a new page
    } catch (error) {
      // Signup failed, display an error message to the user
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      <View style={{ paddingHorizontal: 25 }}>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require("../assets/Asthsist-logo.png")}
            style={{ width: 200, height: 200 }} />
        </View>
        <Input
          leftIcon={
            <FeatherIcons
              name="user"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          style={styles.textInput}
          placeholder="Full Name"
          onChangeText={handleFullNameChange}
        />
        <Input
          leftIcon={
            <FeatherIcons
              name="mail"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          containerStyle={{ margin: 0 }}
          style={styles.textInput}
          placeholder="Email"
          onChangeText={handleEmailChange}
        />
        <Input
          leftIcon={
            <Ionicons
              name="ios-lock-closed-outline"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          style={styles.textInput}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={handlePasswordChange}
        />
        <View style={{flexDirection:'row', justifyContent: 'center'}}>
        <Text>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: 'blue' }}>Login here</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  textInput: {
    fontSize: 15,
  },
  button: {
    marginTop: 50,
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Register;
