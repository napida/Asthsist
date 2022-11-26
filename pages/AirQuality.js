import React, { Component } from 'react';
import { Button, View, Text } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

function AirQualityPage() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>AirQualityPage Page</Text>
      <Button
          title="Go to List Status"
          onPress={() => this.props.navigation.navigate('Home')}
      />
    </View>
  )
}

export default AirQualityPage;