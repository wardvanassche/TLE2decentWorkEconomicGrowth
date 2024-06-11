import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Animated } from 'react-native';
import InputComponent from './components/InputComponent';

export default function HomeScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [showList, setShowList] = useState(false);
    const [data, setData] = useState([]);

    const opacityAnim = useRef(new Animated.Value(0)).current;
    const translateYAnim = useRef(new Animated.Value(50)).current;
    const inputTranslateYAnim = useRef(new Animated.Value(0)).current;
2
    useEffect(() => {
        // Start the fade-in and slide-in animation when the component mounts
        Animated.parallel([
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(translateYAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    useEffect(() => {
        if (showList) {
            Animated.timing(inputTranslateYAnim, {
                toValue: -80, // Adjust this value to control the slide distance
                duration: 500,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(inputTranslateYAnim, {
                toValue: 0, // Reset the position
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
    }, [showList]);

    const handlePress = () => {
        setLoading(true);
        // Simulate a network request with a timeout
        setTimeout(() => {
            setLoading(false);
            setShowList(true);
            setData([
                { id: '1', name: 'Lift 1 - Station A' },
                { id: '2', name: 'Roltrap 2 - Station B' },
                { id: '3', name: 'Lift 3 - Station C' },
            ]);
        }, 2000); // 2 seconds wait time
    };

    const goToSettings = () => {
        navigation.navigate('Settings'); // Navigate to the settings page
    };

    return (
        <View style={styles.container}>
            <Image source={require('./assets/logo.png')} style={styles.logo} />
            <Animated.View style={[styles.rectangle, { opacity: opacityAnim, transform: [{ translateY: translateYAnim }] }]}>
                <TouchableOpacity style={styles.settingsButton} onPress={goToSettings}>
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                </TouchableOpacity>
                <Animated.View style={[
                    styles.inputContainer,
                    { backgroundColor: showList ? '#4A4A4A' : '#FFFFFF', transform: [{ translateY: inputTranslateYAnim }] }
                ]}>
                    <InputComponent
                        placeholder="Kies een metrostation"
                        style={styles.inputVan}
                    />
                    <InputComponent
                        placeholder="Kies een metrostation"
                        style={styles.inputNaar}
                    />
                    {!loading && !showList && (
                        <TouchableOpacity style={styles.button} onPress={handlePress}>
                            <Text style={styles.buttonText}>Roltie</Text>
                        </TouchableOpacity>
                    )}
                </Animated.View>
                {loading && (
                    <View style={styles.loaderContainer}>
                        <Image source={require('./assets/loading.gif')} style={styles.loader} />
                    </View>
                )}
                {showList && (
                    <FlatList
                        data={data}
                        renderItem={({ item }) => (
                            <Text style={styles.listItem}>{item.name}</Text>
                        )}
                        keyExtractor={item => item.id}
                        style={styles.list}
                    />
                )}
                {!showList && !loading && (
                    <View style={styles.reportContainer}>
                        <Text style={styles.reportText}>Lift of roltrap werkt niet?</Text>
                        <TouchableOpacity style={styles.reportButton} onPress={() => {}}>
                            <Text style={styles.reportButtonText}>Melding maken</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Animated.View>
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
        width: 20,
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
