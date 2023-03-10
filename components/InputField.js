import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

const imageWidth = Dimensions.get('window').width;

export default function InputField({
  leftFiled,
  placeholder,
  iconLeftField,
  inputType,
  keyboardType,
  rightField,
  iconRightFiled,
  fieldIconRightFunction,
  isInput,
  detail,
  detailProps,
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingBottom: 8,
        marginBottom: 25,
        alignItems: 'center'
      }}>
      <View style={styles.eachContainer}>
        {iconLeftField}
        <Text style={styles.text}>{leftFiled}</Text>
      </View>
      {detailProps}
      <View style={[styles.eachContainer, {width: rightField && imageWidth/2}]}>
        {isInput ? (
          inputType === 'password' ? (
            <TextInput
              placeholder={placeholder}
              keyboardType={keyboardType}
              style={[styles.text, { flex: 1, paddingVertical: 0 }]}
              secureTextEntry={true}
            />
          ) : (
            <TextInput
              placeholder={placeholder}
              keyboardType={keyboardType}
              style={{ flex: 1, paddingVertical: 0 }}
            />
          )
        ) : (
          <Text style={{ color: detail==='Not set'? 'gray': 'black',}}>
            {detail}
          </Text>
        )}
      </View>
      {rightField && (
        <View style={[styles.eachContainer, {alignItems:'flex-start'}]}>
          <Text style={styles.text}>{rightField}</Text>
        </View>
      )}
      <TouchableOpacity onPress={fieldIconRightFunction} style={[styles.eachContainer, {alignItems:'flex-end'}]}>
        {iconRightFiled}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Prompt-Medium',
    color: '#012250',
    fontSize: 17,
  },
  eachContainer: {
    width: imageWidth / 3,
  }
});

InputField.propTypes = {
  leftFiled: PropTypes.string,
  placeholder: PropTypes.string,
  iconLeftField: PropTypes.element,
  inputType: PropTypes.string,
  keyboardType: PropTypes.oneOf([
    'default',
    'email-address',
    'numeric',
    'phone-pad',
    'ascii-capable',
    'numbers-and-punctuation',
    'url',
    'number-pad',
    'name-phone-pad',
    'decimal-pad',
    'twitter',
    'web-search',
    'visible-password',
  ]),
  rightField: PropTypes.string,
  iconRightFiled: PropTypes.element,
  fieldIconRightFunction: PropTypes.func,
  isInput: PropTypes.bool,
  detail: PropTypes.string,
  detailProps: PropTypes.element,
};