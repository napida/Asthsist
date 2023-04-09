import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';
import Chart from './Graph';

const imageWidth = Dimensions.get('window').width;

const MySwiper = ({ items }) => {
    const navigation = useNavigation();

    return (
        <Swiper
            style={styles.wrapper}
            showsButtons={true}
            showsPagination={false}
        >
            {items.map((item, index) => (
                <TouchableOpacity key={item.id} style={styles.slide} onPress={() => navigation.navigate('Chart', { title: item.title })}>
                    <View style={styles.chartContainer}>
                        <Chart page={item.title} isShowViewButton={false} chartHeight={340} chartWidth={imageWidth - 30} show='week' chartStyle={{ paddingTop: 50 }} />
                        <TouchableOpacity style={styles.overlay} onPress={() => navigation.navigate('Chart', { title: item.title })} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.date}>{item.date}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </Swiper>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#C4DCE8',
        height: imageWidth
    },
    slide: {
        flex: 1,
        backgroundColor: '#C4DCE8',
    },
    chartContainer: {
        position: 'relative',
        flex: 1,
        justifyContent: 'center',
        margin: 50
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
    }
    ,
    textContainer: {
        flex: 0.5,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 10,
    },
    title: {
        fontFamily: 'Prompt-Medium',
        letterSpacing: 2,
        color: '#012250',
        fontSize: 25,
    },
    date: {
        fontFamily: 'Prompt-Light',
        fontSize: 15,
        letterSpacing: 1,
        color: 'gray',
        lineHeight: 20,
    },
});

export default MySwiper;
