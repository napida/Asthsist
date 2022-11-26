import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native'
import Swiper from 'react-native-swiper'

export default ({ items }) => {
    const imageWidth = Dimensions.get('window').width;
    const imageHeight = imageWidth / 2;
    return (
        <Swiper
            style={styles.wrapper}
            showsButtons={true}
            showsPagination={false}
            >
            {items.map((item, index) => (
                <View
                style ={styles.graphContainer}>
                
                
                <TouchableOpacity
                    key={index}
                    // onPress={() => navigation.navigate(item.title)}
                    >
                    <Image
                        style = {{
                            height: imageHeight,
                            alignSelf: 'center',
                            marginTop: 20
                        }}
                        source={item.source}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <Text style={[styles.text, {paddingTop: 10}]}>{item.title}</Text>
                <Text style={[styles.text, {fontFamily: 'Prompt-Light', fontSize: 15, letterSpacing: 1, color: 'gray', lineHeight: 20 }]}>{item.date}</Text>
                </View>
            ))}
        </Swiper>
    )
}


const styles = StyleSheet.create({
    wrapper: {},
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
