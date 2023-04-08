import React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Divider } from 'react-native-elements';
import DatePicker from 'react-native-date-picker';
import PropTypes from 'prop-types';

const imageWidth = Dimensions.get('window').width;

export default function TrackerComponent({
    date,
    openDate,
    onDateChange,
    onConfirmDateFuntion,
    setTrueOpenDate,
    setFalseOpenDate,
    onChangeTextFunction,
    placeholderText,
    inputTitle,
    keyboradTypeText,
    InputPrefix,
    onChangeNote,
    placeholderNote,
    numberTitle,
    isDisabled,
    decreaseFunction,
    numberValue,
    increaseFunction,
    titleNoteStyle,
    DropDownComponent
}) {
    const formatDate = (date) => {
        const options = {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.datetime}>
                <View style={styles.dateContainer}>
                    <Text style={styles.text}>{formatDate(date)}</Text>
                    <TouchableOpacity onPress={setTrueOpenDate}>
                        <Ionicons name="calendar-sharp" size={30} />
                    </TouchableOpacity>
                </View>
                <DatePicker
                    modal
                    mode="date"
                    open={openDate}
                    date={date}
                    onConfirm={onConfirmDateFuntion}
                    onCancel={setFalseOpenDate}
                />
                {!!DropDownComponent && DropDownComponent}
                <View style={styles.timeContainer}>
                    <Text style={styles.textTime}>TIMES</Text>
                    <View
                        style={{
                            alignSelf: 'center',
                            borderTopWidth: 4,
                            borderTopColor: '#517EB9',
                        }}>
                        <DatePicker mode="time" date={date} onDateChange={onDateChange} />
                    </View>
                </View>
            </View>
            <Divider width={20} />

            {!!inputTitle ?
                <>
                    <Text style={[{ color: 'white', alignSelf: 'flex-start' }, titleNoteStyle]}>{inputTitle}</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            onChangeText={onChangeTextFunction}
                            editable
                            placeholder={placeholderText}
                            style={styles.input}
                            keyboardType={keyboradTypeText}
                        />
                        <Text style={styles.prefix}>{InputPrefix}</Text>
                    </View>
                </>
                :
                <View style={styles.numberOfTimes}>
                    <View style={{ flex: 2 }}>
                        <Text style={[styles.textTime, { textAlign: 'center' }]} >{numberTitle}</Text>
                    </View>
                    <View style={styles.activityContainer}>
                        <TouchableOpacity
                            disabled={isDisabled}
                            style={[styles.buttonContainer, { opacity: isDisabled && 0.5 }]}
                            onPress={decreaseFunction}>
                            <Icon name="minuscircle" size={30} color='#72BFB9' />
                        </TouchableOpacity>
                        <Text style={[styles.activityLevel, { width: 30, textAlign: 'center' }]}>{numberValue}</Text>
                        <TouchableOpacity
                            style={[styles.buttonContainer, { paddingRight: 0 }]}
                            onPress={increaseFunction}>
                            <Icon name="pluscircle" size={30} color='#72BFB9' />
                        </TouchableOpacity>
                    </View>
                </View>
            }
            <View style={{ width: imageWidth - 50, marginVertical: 20, marginTop: 30 }}>
                <Text style={[{ color: 'white' }, titleNoteStyle]}>Note</Text>
                <TextInput
                    multiline
                    numberOfLines={3}
                    editable
                    maxLength={40}
                    onChangeText={onChangeNote}
                    placeholder={placeholderNote}
                    style={styles.inputNote}
                />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    textTime: {
        fontFamily: 'Prompt-Medium',
        color: '#012250',
        fontSize: 18,
        alignSelf: 'center',
    },
    text: {
        fontFamily: 'Prompt-Regular',
        color: '#012250',
        fontSize: 16,
        alignSelf: 'center'
    },
    datetime: {
        paddingTop: 15,
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        paddingHorizontal: 30,
        width: imageWidth - 60,
        backgroundColor: '#87CEFA',
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
    },
    timeContainer: {
        width: imageWidth - 60,
        padding: 20,
        backgroundColor: '#FFF',
        borderBottomEndRadius: 20,
        borderBottomStartRadius: 20,
    },
    inputNote: {
        paddingHorizontal: 20,
        paddingTop: 0,
        borderWidth: 2,
        borderRadius: 20,
        borderColor: '#D9D9D9',
        marginTop: 10,
        backgroundColor: '#EAEAEA'
    },
    input: {
        height: 40,
        paddingHorizontal: 20,
        width: imageWidth - 150,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#87CEFA',
        marginVertical: 10,
        borderRadius: 5,
        padding: 5,
        width: imageWidth - 50,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 4,
    },
    prefix: {
        paddingHorizontal: 10,
        fontWeight: 'bold',
        color: 'black'
    },
    numberOfTimes: {
        paddingVertical: 10,
        width: imageWidth - 60,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f8f7',
        borderRadius: 20,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 4,
    },
    activityContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderRadius: 5,
        marginHorizontal: 30,
        marginVertical: 10,
    },
    activityLevel: {
        fontFamily: 'Prompt-Regular',
        color: '#012250',
        fontSize: 20,
    },
    buttonContainer: {
        paddingHorizontal: 10,
    },
})
const dropDownPropTypes = {
    // A function to render the DropDown component
    render: PropTypes.func,
    // A function to handle when the DropDown component is closed
    onClose: PropTypes.func,
    // A function to handle when the DropDown component is opened
    onOpen: PropTypes.func,
};

TrackerComponent.propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    openDate: PropTypes.bool.isRequired,
    onDateChange: PropTypes.func.isRequired,
    onConfirmDateFuntion: PropTypes.func.isRequired,
    setTrueOpenDate: PropTypes.func.isRequired,
    setFalseOpenDate: PropTypes.func.isRequired,
    onChangeTextFunction: PropTypes.func,
    placeholderText: PropTypes.string,
    inputTitle: PropTypes.string,
    keyboradTypeText: PropTypes.string,
    InputPrefix: PropTypes.string,
    onChangeNote: PropTypes.func,
    placeholderNote: PropTypes.string,
    numberTitle: PropTypes.string,
    isDisabled: PropTypes.bool,
    decreaseFunction: PropTypes.func,
    numberValue: PropTypes.number,
    increaseFunction: PropTypes.func,
    titleNoteStyle: PropTypes.object,
    DropDownComponent: PropTypes.shape(dropDownPropTypes),
};