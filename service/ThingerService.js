import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Button, Image, Text, TouchableOpacity, View } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Entypo';

export const ThingerService = ({ title, source, isRefreshing }) => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const navigation = useNavigation();

    const getThinger = async () => {
        try {
            const response = await fetch('https://api.thinger.io/v1/users/Rnunaunfairy2544/buckets/kar/data?authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJEZXZpY2VDYWxsYmFja19hc3Roc2lzdG1vYmlsZSIsInN2ciI6ImFwLXNvdXRoZWFzdC5hd3MudGhpbmdlci5pbyIsInVzciI6IlJudW5hdW5mYWlyeTI1NDQifQ.U6_SCVtAhAB6Wz0i5Y3zlZHMSmANs2MsWIIyubMNxJo');
            const json = await response.json();
            setData(json[0].val);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const colourYellow = '#FFC100';
    const colourRed = '#FF0000';
    const colourGreen = '#00CD00';
    const colourBlack = '#000000';
    const colourGray = '#737171';
  
  
    function getfontColour(title, v,fingerStatus){
      if(title === 'Heart rate'){
        if(data.fingerStatus){
            if(v>100){
            return colourRed;
            }
            else if(v>95){
            return colourYellow;
            }
            else{
            return colourGreen;
            }
        }
        return colourGray;
      }
      if(title === 'Temperature'){
        if(v>30 || v<10){
          return colourRed;
        }
        else if(v>25 || v <15){
          return colourYellow;
        }
        else{
          return colourGreen;
        }
      }
      if(title === 'Humidity'){
        if(v>60 || v<25){
          return colourRed;
        }
        else if(v>50 || v <30){
          return colourYellow;
        }
        else{
          return colourGreen;
        }
      }
      if(title === 'SpO2'){
        if(data.fingerStatus){
            if(v<95){
                return colourRed;
              }
              else if(v<97){
                return colourYellow;
              }
              else{
                return colourGreen;
              }
        }
        return colourGray
      }
      return colourBlack
    }
    console.log("kar", data);
    useEffect(() => {
        const timer = setTimeout(() => {
            getThinger();
        }, 3000);
        return () => clearTimeout(timer);
    },);
    const checkTitle = (title === 'Humidity') ? '%' :
  (title === 'Temperature') ? '°C' :
  (title === 'Heart rate') ? ' bpm' :
  (title === 'SpO2') ? '%' : '';
    if (!!data || data.length === 0) {
        console.log('Object is not found');
    }
    return (
        <View style={{ flexDirection: 'row' }}>
            <Image
                style={{ height: 70, width: 70, marginRight: 50 }}
                source={source}
                resizeMode="contain" />
            <View>
                <Text style={styles.title}>{title}</Text>
                {isLoading ? (
                    <ActivityIndicator  style ={{paddingTop:10, alignItems:'flex-start'}}/>
                ) : (
                    <Text style={[styles.title, { fontFamily: 'Prompt-Medium', fontSize: 17, color: getfontColour(title,data,data.fingerStatus), paddingTop:5 }]}>
                        {
                        data.fingerStatus === true ?
                            (
                            title === 'Humidity' ? data.humidity.toFixed(2) + checkTitle : 
                            title === 'Temperature' ? data.temperature.toFixed(2) + checkTitle : 
                            title === 'Heart rate' ? data.bpmAvg + checkTitle : 
                            title === 'SpO2' ? data.spO2.toFixed(2) + checkTitle : '30' + checkTitle
                            )
                            :
                            (
                            title === 'Humidity' ? data.humidity.toFixed(2) + checkTitle : 
                            title === 'Temperature' ? data.temperature.toFixed(2) + checkTitle : 
                            title === 'Heart rate' ? 'undetected'  : 
                            title === 'SpO2' ? 'undetected' : '80%' + checkTitle
                            )
                    }
                    </Text>
                )}
            </View>

        </View>
    )
}
const styles = StyleSheet.create({
    title: {
        fontFamily: 'Prompt-Medium',
        color: '#012250',
        fontSize: 25,
    },
});
