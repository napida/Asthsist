import React, { useState, useEffect } from 'react';
import { SafeAreaView, Button, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { Divider } from 'react-native-elements';
import FeatherIcons from 'react-native-vector-icons/Feather';
import Login from './Login';

export default Setting = ({ navigation }) => {
  const user = firebase.auth().currentUser;
  const handleSignOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.error(error);
    }
  };
  const [displayName, setDisplayName] = useState('');
  
  const fetchDisplayName = async (uid) => {
    try {
      const snapshot = await firebase.database().ref(`users/${uid}`).once('value');
      //console.log("snapshot",snapshot);
      const data = snapshot.val();
      return data ? data.name : '';
    } catch (error) {
      console.error(error);
      return '';
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchDisplayName(user.uid).then((name) => setDisplayName(name));
      //console.log("displayName",displayName);
      const onValueChange = firebase.database().ref(`users/${user.uid}`).on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setDisplayName(data.name);
        }
      });
      return () => {
        firebase.database().ref(`users/${user.uid}`).off('value', onValueChange);
      };
    }
  }, [user]);
  


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        {user ? (
          <View style={{ flexDirection: 'column' }}>
            <View style={{ paddingTop: 30, paddingHorizontal: 25, marginBottom: 20, marginRight: 20 }}>
              <Text style={styles.title}>{displayName}</Text>
              <Text>You are signed in as {user.email}</Text>
            </View>
            <Divider width={10} />
            <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{ marginVertical: 10 }}>
              <View style={{ paddingHorizontal: 25, flexDirection: 'row' }}>
                <FeatherIcons
                  name="user"
                  size={20}
                  color="#666"
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.text}>Personal information</Text>
              </View>
            </TouchableOpacity>
            <Divider width={2} />
            <TouchableOpacity onPress={() => navigation.navigate('Notification')}  style={{ marginVertical: 10 }}>
              <View style={{ paddingHorizontal: 25, flexDirection: 'row' }}>
                <FeatherIcons
                  name="bell"
                  size={20}
                  color="#666"
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.text}>Notification</Text>
              </View>
            </TouchableOpacity>
            <Divider width={2} />
            <View style={{ marginTop: '80%', alignItems: 'center' }}>
              <Button title="Sign Out" onPress={handleSignOut} />
            </View>
          </View>
        ) : (
          <Login />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Prompt-Medium',
    color: '#012250',
    fontSize: 18,
  },
  title: {
    fontFamily: 'Prompt-Bold',
    color: '#012250',
    fontSize: 24,
  },
});