import React from 'react'
import { View, SafeAreaView } from 'react-native';
import ZoneCard from '../components/ZoneCard'

function ZonePage({ route, navigation }) {
    const { zone } = route.params;
    console.log(zone)
    return (
        <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {zone === 'Green' ?
            <ZoneCard
                imageSource={require("../assets/green-zone.png")}
                titleText='Woohoo!'
                subTitleText= 'You made it to the green zone!!'
                textContent='Take your maintenance medications as prescribed. Stay active and continue with your normal routine.'
                buttonLabel='Back to home'
                onPress={() => navigation.navigate('Home')}
                backgroundColor= '#D9FDDC'
            />
            : zone === 'Yellow' ?
            <ZoneCard
                imageSource={require("../assets/yellow-zone.png")}
                titleText='Uh-oh!'
                subTitleText='You are approaching the yellow zone!!'
                textContent = 'Increase use of quick-relief medication as directed. Call your healthcare provider for further instructions.'
                buttonLabel='Back to home'
                onPress={() => navigation.navigate('Home')}
                backgroundColor= '#F8F0D6'
            />
            : zone === 'Red' ?
            <ZoneCard
                ZoneCard
                imageSource={require("../assets/red-zone.png")}
                titleText='Danger! Danger!'
                subTitleText='You have entered the red zone!!'
                textContent = 'Use quick-relief medication immediately. Call emergency or go to the nearest emergency room.'
                buttonLabel='Back to home'
                onPress={() => navigation.navigate('Home')}
                backgroundColor= '#FCC3C3'
            />
            : null}
        </SafeAreaView>
    )
}

export default ZonePage