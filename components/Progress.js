import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import ProgressCircle from 'react-native-progress-circle'

export default ({ value, style, color, radius }) => {
    return (
        <ProgressCircle
            percent={value*100/25}
            radius={!!radius ? radius: 50}
            borderWidth={8}
            color= {color}
            shadowColor="#999"
            bgColor="#fff"
        >
            <Text style={style}>{value>=0 ? value : 0}/25</Text>
        </ProgressCircle>
    )
}
