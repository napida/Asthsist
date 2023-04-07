import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

function PrimaryButton({
  buttonStyle,
  title,
  onPress,
}) {
  return (
    <TouchableOpacity style={[styles.item, buttonStyle]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 17,
    fontFamily: 'Prompt-Medium',
    textAlign: 'center',
  },
  item: {
    borderRadius: 25,
    padding: 10,
    backgroundColor: '#7ACACB',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 13 },
    margin: 10,
  },
});

PrimaryButton.propTypes = {
  buttonStyle: PropTypes.object,
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default PrimaryButton;
