import React, { Component } from 'react';
import { Button, View, Text } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

class PeakFlowPage extends Component {
  render() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>PeakFlow Page</Text>
      <Button
          title="Go to List Status"
          onPress={() => this.props.navigation.navigate('Home')}
      />
    </View>
  )
}}

export default PeakFlowPage;