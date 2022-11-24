import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Button, View, Text } from 'react-native';

class HealthPage extends Component {
  render() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>HealthPage</Text>
      <Button
          title="Go to List Status"
          onPress={() => this.props.navigation.navigate('ListStatus')}
      />
    </View>
  )
}}

export default HealthPage;