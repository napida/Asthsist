import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions, Image, Button } from 'react-native';
import PropTypes from 'prop-types';
import Progress from './Progress';

const imageWidth = Dimensions.get('window').width;

export default function ZoneCard({
    imageSource,
    score,
    scoreColor,
    titleText,
    subTitleText,
    textContent,
    buttonLabel,
    onPress,
}) {
    return (
        <View style={styles.container}>
            {score ?
                <View style={{marginBottom: 50}}>
                    <Progress style={[styles.titleText, {fontSize: 40}]} value={score} color={scoreColor} radius={100}/>
                </View>
                : <Image source={imageSource} style={styles.image} />
            }
            <Text style={styles.titleText}>{titleText}</Text>
            <Text style={styles.text}> {subTitleText}</Text>
            <Text style={[styles.textContent, { marginBottom: 40 }]}>{textContent}</Text>
            <Button
                title={buttonLabel}
                onPress={onPress}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "column"
    },
    text: {
        fontFamily: 'Prompt-Medium',
        alignSelf: 'center',
        textAlign: 'center',
        marginHorizontal: 30,
        fontSize: 15,
        marginVertical: 10
    },
    textContent: {
        fontFamily: 'Prompt-Light',
        alignSelf: 'center',
        textAlign: 'center',
        marginHorizontal: 30,
        marginVertical: 10,
    },
    titleText: {
        fontSize: 20,
        fontWeight: "bold",
        fontFamily: 'Prompt-Bold',
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'pink',
        justifyContent: 'flex-end',
        marginBottom: 20
    },
    image: {
        width: imageWidth,
        height: imageWidth * 0.7, // adjust the aspect ratio as needed
        resizeMode: 'contain', // adjust the image scaling as needed
        marginBottom: 10, // adjust the spacing as needed
    }
})

ZoneCard.propTypes = {
    titleText: PropTypes.string,
    subTitleText: PropTypes.string,
    textContent: PropTypes.string,
    imageSource: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    buttonLabel: PropTypes.string,
    onPress: PropTypes.func,
};
