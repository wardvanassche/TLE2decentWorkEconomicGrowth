import React, { useState } from 'react';
import {View, Text, TextInput, StyleSheet, Image, TouchableOpacity} from "react-native";
import Dropdown from "./components/dropdown";

export default function MeldingScreen() {

    return (
        <View style={styles.view}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <View style={styles.rectangle}>
                <div style={styles.container}>
                    < Dropdown/>
                </div>

                <TouchableOpacity style={styles.button} onPress={() => {
                }}>
                    <Text style={styles.buttonText}>Roltie?</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#4A4A4A',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    logo: {
        position: 'absolute',
        top: '4%',
        width: 200,
        height: 100,
        resizeMode: 'contain',
    },
    rectangle: {
        width: '100%',
        height: '84%',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        paddingTop: 50,
    },
    container: {
        width: '100%',
        height: '84%',
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: 50,
    },
    button: {
        backgroundColor: '#00C720', // Groene kleur
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 5,
        alignItems: 'center',
        width: '80%',
    },
    buttonText: {
        color: '#FFFFFF', // Witte tekst
        fontSize: 16,
        fontWeight: 'bold',
    },
});