import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const InputComponent = ({ placeholder, style, onChangeText, value }) => {
    return (
        <TextInput
            style={[styles.input, style]}
            placeholder={placeholder}
            onChangeText={onChangeText}
            value={value}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        paddingHorizontal: 10,
        width: '80%',
        marginVertical: 10,
    },
});

export default InputComponent;
