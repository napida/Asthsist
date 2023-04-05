import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import SwiperCard from '../components/SwiperCard'
import Progress from '../components/Progress.js'
import { ScrollView } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';

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
        title: 'Asthma Activity',
        source: require('../assets/inhaler-graph.png'),
        date: '3d ago'
    },
    {
        id: '4',
        title: 'Heart rate',
        source: require('../assets/inhaler-graph.png'),
        date: '5d ago'
    },
    {
        id: '5',
        title: 'SpO2',
        source: require('../assets/inhaler-graph.png'),
        date: '2d ago'
    },
    {
        id: '6',
        title: 'Humidity',
        source: require('../assets/inhaler-graph.png'),
        date: '3d ago'
    },
    {
        id: '7',
        title: 'Temperature',
        source: require('../assets/inhaler-graph.png'),
        date: '3d ago'
    },
    {
        id: '8',
        title: 'PM2.5',
        source: require('../assets/inhaler-graph.png'),
        date: '3d ago'
    },
];
const menu = [
    {
        id: '1',
        title: 'Peak Flow',
        icon: require('../assets/peak-flow-meter-menu.png'),
        page: 'Peak Flow'
    },
    {
        id: '2',
        title: 'Inhaler',
        icon: require('../assets/inhaler-menu.png'),
        page: 'Inhaler'
    },
    {
        id: '3',
        title: 'Asthma\nactivity',
        icon: require('../assets/asthma-attack-menu.png'),
        page: 'Asthma Activity'
    },
    {
        id: '4',
        title: 'Asthma\naction plan',
        icon: require('../assets/asthma-action-plan-menu.png'),
        page: 'Asthma Action Plan'
    },
    {
        id: '5',
        title: 'Asthma\ncontrol test',
        icon: require('../assets/asthma-control-test-menu.png'),
        page: 'Asthma Control Test'
    },
];

function HomePage({ navigation }) {
const route = useRoute();
const totalScore = route.params?.totalScore || 0;
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ flex: 3 }}>
                <SwiperCard items={items} />
            </View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.menuContainer}>
                {/* <View style={styles.menuContainer}> */}
                {menu.map((item) => (
                    <View key={item.id} style={{marginHorizontal: 11}}>
                        <TouchableOpacity onPress={() => navigation.navigate(item.page)}>
                            <Image
                                style={{ height: 70, width: 70 }}
                                source={item.icon}
                                resizeMode="contain" />
                        </TouchableOpacity>
                        <Text numberOfLines={2}
                            style={[
                                styles.text,
                                { fontSize: 12, fontFamily: 'Prompt-egular', paddingTop: 4, textAlign: 'center' }
                            ]}>
                            {item.title}
                        </Text>
                    </View>
                ))}
                {/* </View> */}
            </ScrollView>
            <TouchableOpacity style={styles.percentContainer}>
                <Progress style={styles.text} value={totalScore} color='#00CD00'/>
                <View>
                    <Text style={[styles.text, { paddingBottom: 10 }]}>
                        How well you control asthma
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
        fontSize: 18,
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
        marginVertical: 3,
        paddingVertical:20, 
        flexDirection: 'column',
        backgroundColor: '#FFF',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 4,
        borderRadius: 8,
    },
});

export default HomePage