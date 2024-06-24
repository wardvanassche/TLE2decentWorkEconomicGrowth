import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import fetchMeldingen from "./utils/fetchMeldingen.js";
import HomeScreen from "./screens/HomeScreen.js";
import Notifications from "./screens/Notifications.js";
import Settings from "./screens/Settings.js";
import MeldingScreen from "./screens/MeldingScreen";

const Stack = createStackNavigator();

const CustomBackButton = ({ navigation }) => (
    <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
    >
        <Text style={styles.backButtonText}>Terug</Text>
    </TouchableOpacity>
);

export default function App() {
    const [meldingen, setMeldingen] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getMeldingen = async () => {
            try {
                const data = await fetchMeldingen();
                setMeldingen(data);
            } catch (err) {
                setError(err.message);
            }
        };
        getMeldingen();
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" options={{ title: "Home", headerShown: false }}>
                    {(props) => (
                        <HomeScreen {...props} meldingen={meldingen} error={error} />
                    )}
                </Stack.Screen>
                <Stack.Screen
                    name="Notifications"
                    component={Notifications}
                    options={({ navigation }) => ({
                        title: "Meldingen", // Aangepaste titel voor instellingen scherm
                        headerStyle: {
                            height: 163, // Maak de header dikker
                            backgroundColor: "#4A4A4A", // Achtergrondkleur van de navigatiebalk
                        },
                        headerTitleAlign: "center", // Centreer de titel van de header
                        headerTintColor: "#FFFFFF", // Tekstkleur van de navigatiebalk knoppen
                        headerTitleStyle: {
                            fontWeight: "bold", // Stijl voor de titel van de navigatiebalk
                            fontSize: 30, // Grootte van de titel
                            marginBottom: -30, // Voeg een ondermarge toe om de titel iets lager te plaatsen
                        },
                        headerLeft: () => <CustomBackButton navigation={navigation} />, // Voeg de aangepaste terugknop toe
                    })}
                />
                <Stack.Screen
                    name="Settings"
                    component={Settings}
                    options={({ navigation }) => ({
                        title: "Instellingen", // Aangepaste titel voor instellingen scherm
                        headerStyle: {
                            height: 163, // Maak de header dikker
                            backgroundColor: "#4A4A4A", // Achtergrondkleur van de navigatiebalk
                        },
                        headerTitleAlign: "center", // Centreer de titel van de header
                        headerTintColor: "#FFFFFF", // Tekstkleur van de navigatiebalk knoppen
                        headerTitleStyle: {
                            fontWeight: "bold", // Stijl voor de titel van de navigatiebalk
                            fontSize: 30, // Grootte van de titel
                            marginBottom: -30, // Voeg een ondermarge toe om de titel iets lager te plaatsen
                        },
                        headerLeft: () => <CustomBackButton navigation={navigation} />, // Voeg de aangepaste terugknop toe
                    })}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    backButton: {
        marginLeft: 16,
        marginBottom: -30,
        justifyContent: 'center', // Centreer de knop verticaal
    },
    backButtonText: {
        color: '#FFFFFF', // Kleur van de tekst
        fontWeight: "bold",
        fontSize: 16, // Grootte van de tekst
},
});