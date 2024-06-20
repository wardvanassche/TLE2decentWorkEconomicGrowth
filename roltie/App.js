import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import fetchMeldingen from "./utils/fetchMeldingen.js";
import HomeScreen from "./screens/HomeScreen.js";
import Notifications from "./screens/Notifications.js";
import Settings from "./screens/Settings.js";

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
        <Stack.Screen name="Home" options={{ title: "Home" }}>
          {(props) => (
            <HomeScreen {...props} meldingen={meldingen} error={error} />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="Notifications"
          component={Notifications}
          options={{ title: "meldingen" }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ title: "Instellingen" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
