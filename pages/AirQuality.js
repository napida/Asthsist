import React, { Component } from 'react';
import { Button, View, Text } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

class AirQualityPage extends Component {
  render() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>AirQualityPage</Text>
      <Button
          title="Go to ListStatus"
          onPress={() => this.props.navigation.navigate('ListStatus')}
      />
    </View>
  )
}}

export default AirQualityPage;