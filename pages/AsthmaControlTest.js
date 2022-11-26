import React, { useEffect, useRef, useState } from "react";
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Image, Text, TouchableOpacity, View, Button, Alert } from "react-native";
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';

const question = [
  {
    id: "1",
    title: "how much of the time has your asthma kept you from getting as much done at work, school or home?",
  },
  {
    id: "2",
    title: "how often have you had shortness of breath?",
  },
  {
    id: "3",
    title: "how often have your asthma symptoms (wheezing, coughing, shortness of breath, chest tightness or pain) woken you up at night or earlier than usual in the morning?",
  },
  {
    id: "4",
    title: "how often have you used your rescue inhaler or nebuliser medication (such as Salbutamol)?",
  },
  {
    id: "5",
    title: "How would you rate your asthma control during the last 4 weeks?",
  }
];
const options = [
  { label: 'All of the time', value: 5 },
  { label: 'Most of the time', value: 4 },
  { label: 'Some of the time', value: 3 },
  { label: 'A little of the time', value: 2 },
  { label: 'None of the time', value: 1 },
];

const AsthmaControlTest = ({ navigation }) => {
  
  const [chosenOption, setChosenOption] = useState(0);

  const renderItem = ({ item }) => {
    return (
      <View style={{
        margin: 15,
        backgroundColor: '#F1EAE4',
        padding: 20, 
        borderRadius: 13,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.12,
        elevation: 2,
      }}>
        {/* <Text>{chosenOption}+{prevCountRef.current}</Text> */}
        <Text style={styles.title}>{item.id}. {item.title}</Text>
        <View style={{ marginLeft: 20 }}>
          <RadioForm
            style={{ marginTop: 21 }}
            radioStyle={{ marginBottom: 22 }}
            labelStyle={{ fontFamily: 'Prompt-Regular', fontSize: 15 }}
            buttonColor={'#49C0B8'}
            selectedButtonColor={'#49C0B8'}
            buttonSize={9}
            buttonOuterSize={19}
            animation={false}
            radio_props={options}
            initial={-1} //initial value of this group
            onPress={(value) => {
              setChosenOption(value);
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={question}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListFooterComponent={
          <View style={{alignItems:'center', paddingBottom:20}}>
          <Button
              title="Submit"
              onPress={() => Alert.alert(
                "Your Score is 23",
                "WELL-CONTROLLED ASTHMA",
                [
                  { text: "OK", onPress: () => navigation.navigate('Home') }
                ]
              )}
            />
          </View>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    padding: 40,
    paddingLeft: 25,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
    borderRadius: 8,
    backgroundColor: '#D9E6D5',
    alignItems: 'center'
  },
  title: {
    fontFamily: 'Prompt-Medium',
    color: '#012250',
    fontSize: 18,
  },
});

export default AsthmaControlTest;