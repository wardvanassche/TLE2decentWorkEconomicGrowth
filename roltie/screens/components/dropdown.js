import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';

export default function Dropdown({ title, options, onSelect }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(options[0]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (option) => {
        setSelectedOption(option);
        onSelect(option); // Call onSelect prop with the selected option
        setIsOpen(false); // Close dropdown after selection
    };

    return (
        <View style={styles.dropdown}>
            <TouchableHighlight onPress={toggleDropdown} style={styles.toggle} underlayColor="transparent">
                <Text style={styles.toggleText}>{title}</Text>
                <View style={[styles.icon, isOpen ? styles.iconOpen : null]} />
            </TouchableHighlight>
            {isOpen && (
                <View style={styles.menu}>
                    {options.map((option) => (
                        <TouchableHighlight
                            key={option.value}
                            style={styles.item}
                            onPress={() => handleSelect(option)}
                            underlayColor="#f0f0f0"
                        >
                            <Text>{option.label}</Text>
                        </TouchableHighlight>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    dropdown: {
        position: 'relative',
        marginBottom: 16,
    },
    toggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1.5,
        borderColor: '#00C720',
        borderRadius: 5,
        width: '100%',
        padding: 10,
    },
    toggleText: {
        color: 'grey',
    },
    icon: {
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 15,
        borderStyle: 'solid',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#00C720',
        transform: [{ rotate: '0deg' }],
    },
    iconOpen: {
        transform: [{ rotate: '180deg' }],
    },
    menu: {
        position: 'absolute',
        backgroundColor: 'white',
        zIndex: 1,
        marginTop: 5,
        width: '100%',
        borderWidth: 1.5,
        borderColor: '#00C720',
        borderRadius: 5,
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});
