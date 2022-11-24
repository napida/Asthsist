// import { View, Text } from 'react-native'
// import React from 'react'

// const Setting = () =>{
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Text>Settings!</Text>
//       </View>
//     );
//   }

// export default Setting

import React, { Component } from 'react';
import { Button, View, Text } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

export default class Setting extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Setting Screen</Text>
          <Button
          title="Go to Home"
          onPress={() => this.props.navigation.navigate('Home')}
/>
      </View>
    )
  }
}