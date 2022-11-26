import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native'
import React, { Component } from 'react'
import SwiperCard from '../components/SwiperCard'
import Progress from '../components/Progress.js'
import { createStackNavigator } from '@react-navigation/stack';
import PeakFlowPage from './PeakFlow';
const imageWidth = Dimensions.get('window').width;
const items = [
    {
        id: '1',
        title: 'Inhaler',
        source: require('../assets/inhaler-graph.png'),
        date: '5d ago'
    },
    {
        id: '2',
        title: 'Peak Flow',
        source: require('../assets/inhaler-graph.png'),
        date: '2d ago'
    },
    {
        id: '3',
        title: 'Asthma ACtivity',
        source: require('../assets/inhaler-graph.png'),
        date: '3d ago'
    },
];
const menu = [
    {
        id: '1',
        title: 'Peak Flow',
        icon: require('../assets/peak-flow-meter.png'),
        page: 'PeakFlow'
    },
    {
        id: '2',
        title: 'Inhaler',
        icon: require('../assets/inhaler.png'),
        page: 'Inhaler'
    },
    {
        id: '3',
        title: 'Asthma control test',
        icon: require('../assets/check-up.png'),
        page: 'Asthma Control Test'
    },
];

function HomePage({ navigation }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ flex: 3 }}>
                <SwiperCard items={items} />
            </View>
            <View style={styles.menuContainer}>
                {menu.map((item, index) => (
                    <View key={index} >
                        <TouchableOpacity onPress={() => navigation.navigate(item.page)}>
                            <Image
                                style={{ height: 70, width: 70 }}
                                source={item.icon}
                                resizeMode="contain" />
                        </TouchableOpacity>
                        <Text numberOfLines={2} ellipsizeMode='tail'
                            style={[
                                styles.text,
                                { fontSize: 14, fontFamily: 'Prompt-egular', paddingTop: 4 }
                            ]}>
                            {item.title}
                        </Text>
                    </View>
                ))}
            </View>
            <TouchableOpacity style={styles.percentContainer}>
                <Progress style={styles.text} value={92} />
                <View>
                    <Text style={[styles.text, { paddingBottom: 10 }]}>
                        Your current risk
                    </Text>
                    <Text style={[styles.text, { fontFamily: 'Prompt-Regular', fontSize: 15, color: '#547CB4' }]}>
                        You did good today :)
                    </Text>
                </View>

            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Prompt-Medium',
        color: '#012250',
        fontSize: 25,
        alignSelf: 'center'
    },
    titleText: {
        margin: 10,
        fontSize: 20,
        fontWeight: "bold",
    },
    percentText: {
        fontSize: 30,
        fontWeight: 'bold',
        alignItems: 'center'
    },
    percentContainer: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: imageWidth,
        alignItems: 'center',
        backgroundColor: '#F1EAE4',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 4,
        borderRadius: 8,
    },
    menuContainer: {
        flex: 1,
        marginBottom: 20,
        padding: 10,
        width: imageWidth,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#FFF',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 4,
        borderRadius: 8,
    },
});

export default HomePage