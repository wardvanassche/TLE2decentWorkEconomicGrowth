import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import fetchMeldingen from "./utils/fetchMeldingen.js";
import HomeScreen from "./screens/HomeScreen.js";

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
    <View style={styles.container}>
      {error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : (
        <HomeScreen meldingen={meldingen} />
      )}
    </View>
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
