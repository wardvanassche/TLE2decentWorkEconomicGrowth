import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function InputComponent({ placeholder, style }) {
    return (
        <TextInput
            placeholder={placeholder}
            style={[styles.input, style]}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        width: '80%',
        borderColor: 'grey',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 20,
        backgroundColor: 'white',
    },
});