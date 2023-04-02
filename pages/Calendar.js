import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import CalendarComponent from '../components/Calendar'

const Calendar = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <CalendarComponent />
      <View style={{ bottom: 0, position: 'absolute', alignSelf: 'flex-end', padding: 12, }}>
        <TouchableOpacity style={styles.roundButton} onPress={() => navigation.navigate('Tracker')}>
          <Text style={styles.text}> + </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles =StyleSheet.create({
  roundButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#79D5FA',
    shadowOpacity: 0.1,
    shadowOffset: { width: 4, height: 4 },
    shadowRadius: 4,
    elevation: 4,
  },
  text: {
    fontFamily: 'Prompt-Regular',
    color: '#517EB9',
    fontSize: 16,
    alignSelf: 'center',
    fontSize: 35,
    position: 'absolute',
    textAlign: 'center'
  },
})
export default Calendar