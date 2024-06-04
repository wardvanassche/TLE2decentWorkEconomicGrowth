import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function Dropdown() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <View style={styles.dropdown}>
            <TouchableOpacity onPress={toggleDropdown} style={styles.toggle}>
                <Text style={styles.toggleText}>Welk station?</Text>
                <View style={[styles.icon, isOpen ? styles.iconOpen : null]} />
            </TouchableOpacity>
            {isOpen && (
                <View style={styles.menu}>
                    <Text style={styles.item} onMouseOver={e => e.currentTarget.style.backgroundColor = styles.itemHover.backgroundColor}
                          onMouseOut={e => e.currentTarget.style.backgroundColor = ''}>
                        Beurs
                    </Text>
                    <Text style={styles.item} onMouseOver={e => e.currentTarget.style.backgroundColor = styles.itemHover.backgroundColor}
                          onMouseOut={e => e.currentTarget.style.backgroundColor = ''}>
                        Kralingse Zoom
                    </Text>
                    <Text style={styles.item} onMouseOver={e => e.currentTarget.style.backgroundColor = styles.itemHover.backgroundColor}
                          onMouseOut={e => e.currentTarget.style.backgroundColor = ''}>
                        Wilhelminaplein
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    dropdown: {
        position: 'relative',
        display: 'inline-block',
        width: '75%',
    },
    toggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        color: 'grey',
        cursor: 'pointer',
        fontSize: 16,
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
        transition: 'transform 0.3s',
    },
    iconOpen: {
        transform: [{ rotate: '180deg' }],
    },
    menu: {
        position: 'absolute',
        backgroundColor: 'white',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        zIndex: 1,
        marginTop: 5,
        width: '100%',
        padding: 0,
        listStyleType: 'none',
        borderWidth: 1.5,
        borderColor: '#00C720',
        borderRadius: 5,
    },
    item: {
        cursor: 'pointer',
        color: 'black',
        padding: 10,
    },
    itemHover: {
        backgroundColor: 'rgba(0, 199, 32, 0.15)',
    },
});