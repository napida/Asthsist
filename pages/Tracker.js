import React, { Component } from 'react';
import { Button, View, Text } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

function TrackerPage(){
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>TrackerPage</Text>
      <Button
          title="Go to List Status"
          onPress={() => this.props.navigation.navigate('ListStatus')}
      />
    </View>
  )}

export default TrackerPage;