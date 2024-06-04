import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from "react-native";
import Dropdown from "./components/dropdown/Dropdown";

export default function MeldingScreen() {

    return (
        <View style={styles.view}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <View style={styles.rectangle}>

                <Dropdown style={styles.container}/>

                <TouchableOpacity style={styles.button} onPress={() => {}}>
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
        backgroundColor: '#00C720',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 5,
        alignItems: 'center',
        width: '50%',
        marginTop: '25px',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});