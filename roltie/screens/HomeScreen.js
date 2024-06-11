import React from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';

export default function HomeScreen({ meldingen }) {
    // Controleer of meldingen en meldingen.data bestaan
    if (!meldingen || !meldingen.data) {
        return (
            <View style={styles.container}>
                <Image source={require('../assets/logo.png')} style={styles.logo} />
                <View style={styles.rectangle}>
                    <Text>Loading...</Text>
                </View>
            </View>
        );
    }

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
        paddingTop: 80,
        position: 'relative',
    },
    settingsButton: {
        position: 'absolute',
        top: 45,
        right: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 30,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4A4A4A',
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 20,
        position: 'absolute',
        top: 80,
        zIndex: 1,
    },
    inputVan: {
        marginTop: 15,
    },
    inputNaar: {
        marginTop: 10,
    },
    button: {
        backgroundColor: '#00C720',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 5,
        alignItems: 'center',
        width: '80%',
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
    },
    loader: {
        width: 50,
        height: 50,
        borderRadius: 5,
    },
    list: {
        width: '100%',
        backgroundColor: '#FFFFFF',
    },
    listItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
    },
    reportContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 300,
        width: '80%',
    },
    reportText: {
        fontSize: 14,
        color: '#4A4A4A',
        marginRight: 10,
        fontWeight: 'bold',
    },
    reportButton: {
        backgroundColor: '#4A4A4A',
        width: 140,
        height: 40,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    reportButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
});