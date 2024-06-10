import React from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';

export default function HomeScreen({ meldingen }) {
    return (
        <View style={styles.container}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <View style={styles.rectangle}>
                <TextInput placeholder="Van" style={styles.input} />
                <TextInput placeholder="Naar" style={styles.input} />
                <TouchableOpacity style={styles.button} onPress={() => {}}>
                    <Text style={styles.buttonText}>Roltie</Text>
                </TouchableOpacity>
                <FlatList
                    data={meldingen.data}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.meldingItem}>
                            <Text>ID: {item.id}</Text>
                            <Text>LiftID: {item.liftID}</Text>
                            <Text>Defect: {item.defect ? 'Yes' : 'No'}</Text>
                        </View>
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
    input: {
        height: 40,
        width: '80%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
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
    meldingItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '80%',
        alignItems: 'flex-start',
    }
});
