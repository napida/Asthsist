import { View, Text } from 'react-native'
import React from 'react'
import CalendarComponent from '../components/Calendar'

const Calendar = () =>{
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <CalendarComponent />
      </View>
    );
  }

export default Calendar