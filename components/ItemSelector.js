import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ItemSelector = ({ title, items, onSelect, preselected }) => {
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        if (preselected) {
            setSelected(preselected);
        }
    }, [preselected]);

    const handleSelect = (item) => {
        setSelected(item);
        onSelect(item);
    };

    return (
        <View>
            <Text style={[styles.title, { fontFamily: 'Prompt-Bold', textAlign: 'justify', margin: 15 }]}>{title}</Text>
            <View style={styles.container}>
                {items.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={selected === item ? styles.selected : styles.item}
                        onPress={() => handleSelect(item)}
                    >
                        <Text style={styles.text}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    item: {
        padding: 10,
        backgroundColor: '#BFBFBF',
        marginHorizontal: 5,
        borderRadius: 5,
    },
    selected: {
        padding: 10,
        backgroundColor: '#3f51b5',
        marginHorizontal: 5,
        borderRadius: 5,
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
    },
    title: {
        fontFamily: 'Prompt-Medium',
        color: '#012250',
        fontSize: 18,
        marginBottom: 0,
        flexDirection: 'column'
    },
});

export default ItemSelector;
