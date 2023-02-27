import React, { useState } from 'react';
import { TouchableOpacity, SafeAreaView, StyleSheet, TextInput, Image, View, Button, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import FeatherIcons from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Input } from 'react-native-elements';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
     firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
           // User logged in successfully
           const user = userCredential.user;
        })
        .catch((error) => {
           // Handle errors
        });
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
                name="mail"
                size={20}
                color="#666"
                style={{ marginRight: 5 }}
              />
            }
            onChangeText={setEmail}
            placeholder={'Email'}
          />

          <Input
            placeholder={'Password'}
            leftIcon={
              <Ionicons
                name="ios-lock-closed-outline"
                size={20}
                color="#666"
                style={{ marginRight: 5 }}
              />
            }
            onChangeText={setPassword}
            inputType="Password"
            secureTextEntry={true}
          />
        <View style={{flexDirection:'row', justifyContent: 'center'}}>
        <Text>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{ color: 'blue' }}>Sign Up</Text>
          </TouchableOpacity>
        </View>
          <TouchableOpacity style={styles.button}  onPress={() => handleLogin(email, password)}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  preloader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
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

export default Login
