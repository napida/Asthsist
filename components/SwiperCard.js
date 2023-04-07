import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native'
import Swiper from 'react-native-swiper'
import { useNavigation } from '@react-navigation/native';
import Chart from './Graph';

export default ({ items }) => {
    const imageWidth = Dimensions.get('window').width;
    const imageHeight = imageWidth / 2;
    const navigation = useNavigation();
    return (
        <Swiper
            style={styles.wrapper}
            showsButtons={true}
            showsPagination={false}
        >
            {items.map((item, index) => (
                <View
                    key={item.id} style={styles.graphContainer}>
                    
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Chart', {
                            name: item.title
                        })}
                    >
                        {/* <Chart title={item.title} /> */}
                        <Image
                            style={{
                                height: imageHeight,
                                alignSelf: 'center',
                                marginTop: 20
                            }}
                            source={item.source}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <Text style={[styles.text, { paddingTop: 10 }]}>{item.title}</Text>
                    <Text style={[styles.text, { fontFamily: 'Prompt-Light', fontSize: 15, letterSpacing: 1, color: 'gray', lineHeight: 20 }]}>{item.date}</Text>
                </View>
            ))}
        </Swiper>
    )
}


const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#C4DCE8',
    },
    text: {
        fontFamily: 'Prompt-Medium',
        letterSpacing: 2,
        color: '#012250',
        fontSize: 25,
        alignSelf: 'center'
    },
    graphContainer: {
        padding: 12,
        backgroundColor: '#C4DCE8',
    },
})
