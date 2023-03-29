import Slider from '@react-native-community/slider';
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ItemSelector from '../components/ItemSelector';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import firebaseConfig from '../database/firebaseDB';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

function criteria(title, value) {
  let valueLevel;
  // Breathing
  if (title === 'Breathing' || title === 'Sleeping') {
    if (value >= 1 && value <= 2) {
      valueLevel = '(Good)';
    } else if (value >= 3 && value <= 4) {
      valueLevel = '(Moderate)';
    } else if (value >= 5 && value <= 10) {
      valueLevel = '(Severe)';
    }
  }
  else {// Wheezing
    if (value === 0) {
      valueLevel = '(Good)';
    } else if (value >= 1 && value <= 3) {
      valueLevel = '(Moderate)';
    } else if (value >= 4) {
      valueLevel = '(Severe)';
    }
  }
  return valueLevel
}
function calculateAsthmaScore(breathing, sleeping, wheezing, medication, peakFlow) {
  let breathingScore = 0;
  let sleepingScore = 0;
  let wheezingScore = 0;
  let medicationScore = 0;
  let peakFlowScore = 0;
  let totalScore = 0;

  // Breathing
  if (breathing >= 1 && breathing <= 2) {
    breathingScore = 1;
  } else if (breathing >= 3 && breathing <= 4) {
    breathingScore = 2;
  } else if (breathing >= 5 && breathing <= 10) {
    breathingScore = 3;
  }

  // Sleeping
  if (sleeping >= 1 && sleeping <= 2) {
    sleepingScore = 1;
  } else if (sleeping >= 3 && sleeping <= 4) {
    sleepingScore = 2;
  } else if (sleeping >= 5 && sleeping <= 10) {
    sleepingScore = 3;
  }

  // Wheezing
  if (wheezing === 0) {
    wheezingScore = 1;
  } else if (wheezing >= 1 && wheezing <= 3) {
    wheezingScore = 2;
  } else if (wheezing >= 4) {
    wheezingScore = 3;
  }

  // Medication
  if (medication === "Rare") {
    medicationScore = 1;
  } else if (medication === "Occasional") {
    medicationScore = 2;
  } else if (medication === "Frequent") {
    medicationScore = 3;
  }

  // Peak Flow
  if (peakFlow === "Normal") {
    peakFlowScore = 1;
  } else if (peakFlow === "Decreased") {
    peakFlowScore = 2;
  }
  // Calculate Total Score
  totalScore = breathingScore + sleepingScore + wheezingScore + medicationScore + peakFlowScore;

  return totalScore;
}


const AsthmaActionPlan = ({ navigation }) => {
  const [breathingScore, setBreathingScore] = useState(1);
  const [sleepingScore, setSleepingScore] = useState(1);
  const [wheezingScore, setWheezingScore] = useState(null);
  const [medicationScore, setMedicationScore] = useState(null);
  const [peakFlowScore, setPeakFlowScore] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = firebase.auth().currentUser;
      const userUID = currentUser.uid;
      console.log("userUID", userUID);

      try {
        const medicationSnapshot = await db.ref(`Medicine/${userUID}`).once('value');
        console.log("medicationSnapshot", medicationSnapshot);

        // Filter medication data for the last week
        const medicationDataArray = Object.values(medicationSnapshot.val());

        const WeeksAgo = new Date();
        WeeksAgo.setDate(WeeksAgo.getDate() - 7);
        const filteredMadicationData = medicationDataArray.filter((item) => {
          const date = new Date(item.time);
          return date >= WeeksAgo && item.usage;
        });
        console.log("filteredMadicationData", filteredMadicationData);

        // Calculate the total usage
        const totalUsage = filteredMadicationData.reduce((sum, item) => sum + item.usage, 0);
        console.log("totalUsage", totalUsage);

        let preselectedMedication;
        if (totalUsage > 5) {
          preselectedMedication = "Frequent";
        } else if (totalUsage < 3) {
          preselectedMedication = "Rare";
        } else {
          preselectedMedication = "Occasional";
        }
        setMedicationScore(preselectedMedication);

        const peakFlowSnapshot = await db.ref(`PeakFlowData/${userUID}`).orderByChild('timeforref').once('value');
        const peakFlowDataArray = Object.values(peakFlowSnapshot.val());
        const latestValue = parseInt(peakFlowDataArray[peakFlowDataArray.length - 1].peakflow);

        // Filter peak flow data for the last 3-4 weeks
        const threeWeeksAgo = new Date();
        threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);
        const filteredPeakFlowData = peakFlowDataArray.filter((item) => {
          const date = item.timeforref ? new Date(item.timeforref) : new Date(item.time);
          return date >= threeWeeksAgo && item.peakflow;
        });
        // Find the personal best peak flow value
        const personalBest = filteredPeakFlowData.reduce((max, item) => Math.max(max, parseInt(item.peakflow)), 0);
        console.log("personalBest", personalBest);

        // Calculate the percentage of the latest peak flow value to the personal best
        let newPercent = Math.round((latestValue / personalBest) * 100);

        console.log("newPercent", newPercent);

        const peakFlowData = peakFlowSnapshot.val();
        const preselectedPeakFlow = newPercent < 100 ? "Decreased" : "Normal";
        setPeakFlowScore(preselectedPeakFlow);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);



  const calculateZone = () => {
    let zone
    let zoneMeaning
    const score = calculateAsthmaScore(breathingScore, sleepingScore, wheezingScore, medicationScore, peakFlowScore)
    if (score >= 1 && score <= 4) {
      zone = 'Green';
      zoneMeaning = 'Take your maintenance medications as prescribed. Stay active and continue with your normal routine.'
    } else if (score >= 5 && score <= 7) {
      zoneMeaning = 'Increase use of quick-relief medication as directed. Call your healthcare provider for further instructions.'
      zone = 'Yellow';
    } else if (score >= 8) {
      zoneMeaning = 'Use quick-relief medication immediately. Call emergency or go to the nearest emergency room.'
      zone = 'Red';
    }
    Alert.alert(
      !!zone ? "You are in the " + zone + " Zone." : "Please answer the question",
      !!zone ? zoneMeaning : null,
      [
        { text: "OK", onPress: () => navigation.navigate('Home') },
        {
          text: 'Cancel',
          style: 'cancel',
        }
      ]
    )
  };

  return (
    <ScrollView style={[styles.container]}>
      <View style={styles.item}>
        <Text style={[styles.title, { fontFamily: 'Prompt-Bold', margin: 15 }]}>
          On a scale of 1 to 10, with 1 being the best and 10 being the worst, how would you rate your current asthma symptoms in the past 24 hours?</Text>
        <Text style={styles.title}>Breathing: {breathingScore} {criteria('Breathing', breathingScore)}</Text>
        <Slider
          maximumValue={10}
          minimumValue={1}
          minimumTrackTintColor="#D50000"
          maximumTrackTintColor="#01579B"
          step={1}
          value={breathingScore}
          onValueChange={
            (sliderValue) => setBreathingScore(sliderValue)
          }
          thumbTintColor="#1B5E20"
          style={{ width: 300, height: 40 }}
        />

        <Text style={styles.title}>Sleeping: {sleepingScore} {criteria('Sleeping', sleepingScore)}</Text>
        <Slider
          maximumValue={10}
          minimumValue={1}
          minimumTrackTintColor="#D50000"
          maximumTrackTintColor="#01579B"
          step={1}
          value={sleepingScore}
          onValueChange={
            (sliderValue) => setSleepingScore(sliderValue)
          }
          thumbTintColor="#1B5E20"
          style={{ width: 300, height: 40 }}
        />
      </View>
      <View style={styles.item}>
        {/* <Text style={[styles.title, { fontFamily: 'Prompt-Bold', margin: 15 }]}>
          How many times did you experience wheezing in the past 24 hours?</Text>
        <Text style={styles.title}>Wheezing: {wheezingScore} {criteria('Wheezing', wheezingScore)}</Text> */}
        {/* <Slider
          maximumValue={10}
          minimumValue={0}
          minimumTrackTintColor="#D50000"
          maximumTrackTintColor="#01579B"
          step={1}
          value={wheezingScore}
          onValueChange={
            (sliderValue) => setWheezingScore(sliderValue)
          }
          thumbTintColor="#1B5E20"
          style={{ width: 300, height: 40 }}
        /> */}
        <ItemSelector
          title='How many times did you experience wheezing in the past 24 hours?'
          items={['Never', '1-3 times', '4 or more']}
          onSelect={(item) => setWheezingScore(item)}
        />
      </View>
      <View style={styles.item}>
        {/* <Text style={[styles.title, { fontFamily: 'Prompt-Bold', margin: 15 }]}>On a scale of 1 to 10, with 1 being infrequent and 10 being frequent, how would you rate your current Medication use?</Text>
            <Text style={styles.title}>Medication use: {medicationScore}</Text>
                <Slider
                    maximumValue={10}
                    minimumValue={0}
                    minimumTrackTintColor="#D50000"
                    maximumTrackTintColor="#01579B"
                    step={1}
                    value={medicationScore}
                    onValueChange={
                        (sliderValue) => setMedicationScore(sliderValue)
                    }
                    thumbTintColor="#1B5E20"
                    style={{ width: 300, height: 40 }}
                /> */}
        <ItemSelector
          title='Select Medication use:'
          items={['Rare', 'Occasional', 'Frequent']}
          onSelect={(item) => setMedicationScore(item)}
          preselected={medicationScore}
        />
      </View>
      <View style={styles.item}>
        {/* <Text style={[styles.title, { fontFamily: 'Prompt-Bold', margin: 15 }]}>On a scale of 1 to 10, with 1 being infrequent and 10 being frequent, how would you rate your current Medication use?</Text> */}
        {/* <Text style={styles.title}>Peak Flow reading: {peakFlowScore}</Text> */}
        {/* <Slider
                    maximumValue={10}
                    minimumValue={0}
                    minimumTrackTintColor="#D50000"
                    maximumTrackTintColor="#01579B"
                    step={1}
                    value={medicationScore}
                    onValueChange={
                        (sliderValue) => setPeakFlowScore(sliderValue)
                    }
                    thumbTintColor="#1B5E20"
                    style={{ width: 300, height: 40 }}
                /> */}
        <ItemSelector
          title='Select Peak Flow reading:'
          items={['Normal', 'Decreased']}
          onSelect={(item) => setPeakFlowScore(item)}
          preselected={peakFlowScore}
        />
      </View>
      <Text style={{ marginHorizontal: 20, textAlign: 'justify' }}>
        Note: this questionnaire may vary depending on the patient's individual situation and the healthcare provider's assessment. It is always recommended to consult with a healthcare professional for an accurate assessment and treatment plan.</Text>
      <View style={{ width: 100, alignSelf: 'center', margin: 20 }}>
        <Button
          title="submit"
          onPress={calculateZone}
        />
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10
  },
  item: {
    flexDirection: 'column',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
    borderRadius: 8,
    backgroundColor: '#FFF',
    alignItems: 'center'
  },
  title: {
    fontFamily: 'Prompt-Medium',
    color: '#012250',
    fontSize: 18,
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    height: 40,
    marginBottom: 22,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 5,
    padding: 5,
  },
});
export default AsthmaActionPlan;
