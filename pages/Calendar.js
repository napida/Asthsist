import { View, Text, Button } from 'react-native'
import React from 'react'
import CalendarComponent from '../components/Calendar'

const Calendar = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <CalendarComponent />
      <View style={{bottom:0, position: 'absolute', alignSelf: 'flex-end', padding:12}}>
        <Button
          title="+ Add event"
          onPress={() => navigation.navigate('Tracker')}
        />
      </View>
    </View>
  );
}

export default Calendar