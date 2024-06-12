import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import fetchMeldingen from "./utils/fetchMeldingen.js";
import HomeScreen from "./screens/HomeScreen.js";
import Notifications from './screens/tijdelijkeMeldingen.js';

const Stack = createStackNavigator();

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
        <Stack.Screen
          name="Home"
          options={{ title: "Home" }}
        >
          {props => <HomeScreen {...props} meldingen={meldingen} error={error} />}
        </Stack.Screen>
        <Stack.Screen
          name="Details"
          component={Notifications}
          options={{ title: "meldingen" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
  },
});
