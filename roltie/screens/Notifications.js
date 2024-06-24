import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Dropdown from "./components/dropdown/Dropdown";

export default function Notifications() {
  const [escalatorId, setEscalatorId] = useState("1");

  const submitFeedback = async (isWorking) => {
    try {
      const response = await fetch(
        "http://145.137.68.64:8085/roltie/meldingen",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            escalatorId: escalatorId, // Include escalatorId in the request body
            status: isWorking, // Send status as a boolean
          }),
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response text:", errorText);
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Data fetched:", data);
      Alert.alert(data.message || "Feedback submitted successfully");
    } catch (error) {
      console.error("Error submitting feedback:", error.message);
      Alert.alert("Error submitting feedback", error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
        <Dropdown style={styles.container}/>
      <Text>Select escalator:</Text>
      <Picker
        selectedValue={escalatorId}
        style={{ height: 50, width: 150 }}
        onValueChange={(itemValue) => setEscalatorId(itemValue)}
      >
        <Picker.Item label="Escalator 1" value="1" />
        <Picker.Item label="Escalator 2" value="2" />
        {/* Add more escalators as needed */}
      </Picker>
      <Text>Report the status of the escalator:</Text>
      <Button
        title="Escalator is Working"
        onPress={() => submitFeedback(false)} // Pass boolean false for working
      />
      <Button
        title="Escalator is Broken"
        onPress={() => submitFeedback(true)} // Pass boolean true for broken
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
    view: {
        flex: 1,
        backgroundColor: '#4A4A4A',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    rectangle: {
        width: '100%',
        height: '84%',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        paddingTop: 50,
    },
});

