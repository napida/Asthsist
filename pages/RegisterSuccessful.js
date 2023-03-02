import React from 'react';
import { StyleSheet, View, Text, Image,TouchableOpacity  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native'; // Removed duplicated `View` and `Text` imports
import { useRoute } from '@react-navigation/native';

function RegisterSuccessfulPage() {
  const navigation = useNavigation();
  const route = useRoute();

  const handleGetStartedPress = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/checkmark.png')} style={styles.image} />
      <Text style={styles.title}>Registration Successful!</Text>
      <Text style={styles.subtitle}>You're all set up and ready to go.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
});

export default RegisterSuccessfulPage;
