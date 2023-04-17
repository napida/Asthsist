import React, { useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View, Alert } from "react-native";
import RadioForm from 'react-native-simple-radio-button';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import firebaseConfig from '../database/firebaseDB';
import PrimaryButton from "../components/PrimaryButton";
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

const question = [{
  id: "1",
  title: "During the last 4 weeks, how much of the time has your asthma kept you from getting as much done at work, school or home?",
  options: [
    { label: "All of the time", value: 1 },
    { label: "Most of the time", value: 2 },
    { label: "Some of the time", value: 3 },
    { label: "A little of the time", value: 4 },
    { label: "None of the time", value: 5 },
  ]
},
{
  id: "2",
  title: "During the last 4 weeks, how often have you had shortness of breath?",
  options: [
    { label: "More than once a day", value: 1 },
    { label: "Once a day", value: 2 },
    { label: "3 to 6 times a week", value: 3 },
    { label: "Once or twice a week", value: 4 },
    { label: "Not at all", value: 5 },
  ]
},
{
  id: "3",
  title: "During the last 4 weeks, how often have your asthma symptoms (wheezing, coughing, shortness of breath, chest tightness or pain) woken you up at night or earlier than usual in the morning?",
  options: [
    { label: "4 or more nights a week", value: 1 },
    { label: "2 to 3 nights a week", value: 2 },
    { label: "Once a week", value: 3 },
    { label: "Once or Twice", value: 4 },
    { label: "Not at all", value: 5 },
  ]
},
{
  id: "4",
  title: "During the last 4 weeks, how often have you used your rescue inhaler or nebuliser medication (such as Salbutamol)?",
  options: [
    { label: "3 or more times per day", value: 1 },
    { label: "Once or twice per day", value: 2 },
    { label: "2 or 3 times per week", value: 3 },
    { label: "Once a week or less", value: 4 },
    { label: "Not at all", value: 5 },
  ]
},
{
  id: "5",
  title: "How would you rate your asthma control during the last 4 weeks?",
  options: [
    { label: "Not Controlled at all", value: 1 },
    { label: "Poorly Controlled", value: 2 },
    { label: "Somewhat Controlled", value: 3 },
    { label: "Well Controlled", value: 4 },
    { label: "Completely Controlled", value: 5 },
  ]
},
];


const AsthmaControlTest = ({ navigation }) => {

  const [chosenOption, setChosenOption] = useState(new Array(question.length).fill(-1));
  // number of elements and sets each element to -1
  const [formKey, setFormKey] = useState(0);

  const saveScoreToFirebase = (score) => {
    const userUID = firebase.auth().currentUser.uid;
    const date = new Date();
    const scoreData = {
      score,
      date: date.toString(),
      dateTimeForRef: date.toISOString(),
      userUID,
    };

    db.ref(`/AsthmaControlTestScores/${userUID}`)
      .push(scoreData)
      .then(() => {
        console.log('Score saved successfully');
        navigation.navigate('Result ACT', { score: totalScore });
      })
      .catch((error) => {
        console.error('Error saving score: ', error);
      });
  };

  const totalScore = chosenOption && chosenOption.length > 0
    ? chosenOption.reduce((sum, value) => {
      if (value > 0) {
        return sum + value;
      }
      return sum;
    }, 0)
    : 0;


  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.item}>
        <Text style={styles.title}>
          {item.id}. {item.title}
        </Text>
        <RadioForm
          key={formKey}
          style={{ marginTop: 21 }}
          radioStyle={{ marginBottom: 22 }}
          labelStyle={{ fontFamily: 'Prompt-Regular', fontSize: 15 }}
          buttonColor={'#49C0B8'}
          selectedButtonColor={'#49C0B8'}
          buttonSize={9}
          buttonOuterSize={19}
          animation={false}
          radio_props={item.options}
          initial={-1}
          onPress={(value) => {
            const newSelectedOptions = [...chosenOption];
            newSelectedOptions[index] = value;
            setChosenOption(newSelectedOptions);
          }}
        />
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={question}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={(
          <Text style={styles.text}>Take the Asthma Control Test every month to assess how well your asthma has been controlled during the past 4 weeks. </Text>
        )}
        ListFooterComponent={
          <View style={{ alignItems: 'center', paddingBottom: 20, }}>
            <PrimaryButton
              title="Submit"
              onPress={() => {
                if (chosenOption.includes(-1) || totalScore < 0 && totalScore > 25) {
                  Alert.alert("Please answer all the questions");
                } else {
                  saveScoreToFirebase(totalScore);
                  navigation.navigate('Result ACT', { score: totalScore })
                }
              }}
              buttonStyle={{ paddingHorizontal: 30, borderRadius: 10 }}
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
    flexDirection: 'column',
    padding: 20,
    paddingLeft: 25,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
    borderRadius: 8,
    backgroundColor: '#D9E6D5',
  },
  title: {
    fontFamily: 'Prompt-Medium',
    color: '#012250',
    fontSize: 18,
  },
  text: {
    fontFamily: 'Prompt-Regular',
    color: '#012250',
    fontSize: 17,
    marginTop: 20,
    marginHorizontal: 20,
    textAlign: 'justify',
    marginBottom: -10
  },
});

export default AsthmaControlTest;