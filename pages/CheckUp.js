import React, { Component } from 'react';
import { Button, View, Text } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

function CheckUpPage() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>CheckUp Page</Text>
      <Button
          title="Go to List Status"
          onPress={() => this.props.navigation.navigate('Home')}
      />
    </View>
  )
}

export default CheckUpPage;