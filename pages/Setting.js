import React from 'react';
import { SafeAreaView, Button, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import firebase from 'firebase/compat/app';
import { Divider } from 'react-native-elements';
import FeatherIcons from 'react-native-vector-icons/Feather';
import Login from './Login';

export default Setting = () => {
  const user = firebase.auth().currentUser;
  const handleSignOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        {user ? (
          <View style={{ flexDirection: 'column' }}>
            <View style={{ paddingTop: 30,paddingHorizontal: 25, marginBottom:20, marginRight: 20}}> 
              <Text style={styles.title}>{user.displayName}</Text>
              <Text>You are signed in as {user.email}</Text>
            </View>            
            <Divider width={10} />
            <TouchableOpacity style={{marginVertical: 10 }}>
              <View style={{ paddingHorizontal: 25, flexDirection: 'row'}}>
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
            <TouchableOpacity style={{marginVertical: 10 }}>
              <View style={{ paddingHorizontal: 25, flexDirection: 'row'   }}>
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