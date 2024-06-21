import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Animated, Alert, TextInput } from 'react-native';
import axios from 'axios';
import inputBackground2 from './assets/inputvelden2.png'; // Importeer de nieuwe afbeelding

export default function HomeScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [showList, setShowList] = useState(false);
    const [data, setData] = useState([]);
    const [startStation, setStartStation] = useState('');
    const [endStation, setEndStation] = useState('');
    const [showLoader, setShowLoader] = useState(false);
    const [showLogo, setShowLogo] = useState(true);
    const [showBackground, setShowBackground] = useState(false);
    const [showListBackground, setShowListBackground] = useState(false);
    const [inputBackgroundColor, setInputBackgroundColor] = useState('white');
    const [inputBackgroundImage, setInputBackgroundImage] = useState(require('./assets/inputvelden.png')); // State voor achtergrondafbeelding
    const [inputTextColor, setInputTextColor] = useState('#4A4A4A'); // State voor tekstkleur van inputvelden

    const opacityAnim = useRef(new Animated.Value(0)).current;
    const translateYAnim = useRef(new Animated.Value(50)).current;
    const backgroundTranslateYAnim = useRef(new Animated.Value(0)).current;
    const imageOpacityAnim = useRef(new Animated.Value(1)).current; // Animatie voor afbeelding opaciteit

    useEffect(() => {
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
            Animated.timing(backgroundTranslateYAnim, {
                toValue: 100,
                duration: 500,
                useNativeDriver: true,
            }).start();
            setShowListBackground(true);
        } else {
            Animated.timing(backgroundTranslateYAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();
            setShowListBackground(false);
        }
    }, [showList]);

    const handlePress = async () => {
        if (!startStation || !endStation) {
            Alert.alert('Fout', 'Vul beide stationnamen in');
            return;
        }

        setShowLoader(true);

        try {
            const response = await axios.get('http://localhost:3000/stations');
            const station = response.data.find(item => item.name.toLowerCase() === endStation.toLowerCase());
            if (station) {
                setData([station]);
                setShowList(true);
                setShowLogo(false);
                setShowBackground(true);
                setInputBackgroundColor('#4A4A4A');
                animateBackgroundImageChange(() => {
                    setInputBackgroundImage(inputBackground2); // Gebruik inputvelden2.png
                });
                setInputTextColor('white'); // Verander de tekstkleur naar wit
            } else {
                Alert.alert('Niet gevonden', 'Het opgegeven eindstation is niet gevonden.');
                setShowList(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setShowLoader(false);
        }
    };

    const handleBackPress = () => {
        setShowList(false);
        setData([]);
        setShowLogo(true);
        setShowBackground(false);
        setShowListBackground(false);
        setInputBackgroundColor('white');
        setInputBackgroundImage(require('./assets/inputvelden.png')); // Terug naar originele afbeelding bij terugknop
        setInputTextColor('#4A4A4A'); // Verander tekstkleur terug naar origineel
    };

    const goToSettings = () => {
        navigation.navigate('Settings');
    };

    const animateBackgroundImageChange = (callback) => {
        Animated.timing(imageOpacityAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            callback();
            Animated.timing(imageOpacityAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        });
    };

    return (
        <View style={styles.container}>
            {showLogo && <Image source={require('./assets/logo.png')} style={styles.logo} />}
            <Animated.View style={[styles.rectangle, { opacity: opacityAnim, transform: [{ translateY: translateYAnim }] }]}>
                <TouchableOpacity style={styles.settingsButton} onPress={goToSettings}>
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                </TouchableOpacity>
                <View style={[styles.inputContainer, { backgroundColor: inputBackgroundColor }]}>
                    {showList && (
                        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                            <Text style={styles.backButtonText}>Terug</Text>
                        </TouchableOpacity>
                    )}
                    <View style={styles.backgroundImageContainer}>
                        <Animated.Image source={inputBackgroundImage} style={[styles.backgroundImage, { opacity: imageOpacityAnim }]} />
                        <TextInput
                            placeholder="Kies een beginstation"
                            style={[styles.inputVan, { position: 'absolute', top: 10, left: 10, width: '90%', color: inputTextColor }]} // Pas de kleur van de tekst aan
                            onChangeText={setStartStation}
                            value={startStation}
                        />
                        <TextInput
                            placeholder="Kies een eindstation"
                            style={[styles.inputNaar, { position: 'absolute', top: 60, left: 10, width: '90%', color: inputTextColor }]} // Pas de kleur van de tekst aan
                            onChangeText={setEndStation}
                            value={endStation}
                        />
                    </View>
                    {!loading && !showList && (
                        <TouchableOpacity style={styles.button} onPress={handlePress}>
                            <Text style={styles.buttonText}>Roltie</Text>
                        </TouchableOpacity>
                    )}
                </View>
                {showLoader ? (
                    <View style={styles.loaderContainer}>
                        <Image source={require('./assets/loading.gif')} style={styles.loader} />
                    </View>
                ) : (
                    <Animated.View style={[styles.list, { transform: [{ translateY: backgroundTranslateYAnim }], backgroundColor: showListBackground ? '#FFFFFF' : '#EAEAEA' }]}>
                        {showList && (
                            <FlatList
                                data={data}
                                renderItem={({ item }) => {
                                    let statusText = '';
                                    let statusImage = require('./assets/working.png');

                                    if (!item.elevators.working) {
                                        statusText = 'De lift is defect';
                                        statusImage = require('./assets/notworking.png');
                                    } else if (!item.escalators.working) {
                                        statusText = 'De roltrap is defect';
                                        statusImage = require('./assets/notworking.png');
                                    } else {
                                        statusText = 'Beide werken';
                                    }

                                    return (
                                        <View style={styles.listItem}>
                                            <View style={styles.statusContainer}>
                                                <Image source={statusImage} style={styles.statusImage} />
                                                <Text style={styles.statusText}>{statusText}</Text>
                                            </View>
                                            <Text>{item.name}</Text>
                                        </View>
                                    );
                                }}
                                keyExtractor={item => item._id}
                            />
                        )}
                    </Animated.View>
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
        width: 180,
        height: 100,
        resizeMode: 'contain',
    },
    rectangle: {
        width: '100%',
        height: '84%',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        paddingTop: 70,
        position: 'relative',
    },
    settingsButton: {
        position: 'absolute',
        top: 30,
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
        height: 200,
        marginTop: -80,
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: 'white',
    },
    backgroundImageContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundImage: {
        width: '90%',
        height: '100%',
        resizeMode: 'contain',
    },
    backButton: {
        position: 'absolute',
        left: 20,
        top: -40,
        zIndex: 2,
    },
    backButtonText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    inputVan: {
        width: '100%',
        height: 55,
        borderBottomWidth: 0,
        borderBottomColor: 'white ',
        fontSize: 16,
        paddingLeft: 50,
    },
    inputNaar: {
        width: '100%',
        height: 110,
        borderBottomWidth: 0,

        fontSize: 16,
        paddingLeft: 50,
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
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    loader: {
        width: 50,
        height: 50,
        borderRadius: 5,
    },
    list: {
        width: '80%',
        marginTop: 100,
    },
    listItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusImage: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    statusText: {
        fontSize: 16,
        color: '#4A4A4A',
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