import React, { useState } from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function Notifications() {
  const [status, setStatus] = useState(null);
  const [escalatorId, setEscalatorId] = useState("1");
  const [prediction, setPrediction] = useState(null);

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
      console.log("Response headers:", response.headers);

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

  const triggerModelTraining = async () => {
    try {
      // Log the start of the request
      console.log("Starting model training request...");
  
      const response = await fetch("http://145.137.68.64:8085/roltie/train", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          escalatorId: escalatorId // Include escalatorId in the request body
        }),
      });
  
      // Log the response status
      console.log("Response status:", response.status);
  
      if (!response.ok) {
        // Log the error response text
        const errorText = await response.text();
        console.error("Error response text:", errorText);
  
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
  
      // Log the data received
      console.log("Data received:", data);
  
      Alert.alert(data.message || "Model training triggered successfully");
    } catch (error) {
      // Log the error message
      console.error("Error triggering model training:", error.message);
  
      // Check if there is additional error information in the response
      if (error.response) {
        console.error("Error response data:", error.response.data);
      }
  
      Alert.alert("Error triggering model training", error.message);
    }
  };
  

  const getPrediction = async () => {
    try {
      const response = await fetch(
        `http://145.137.68.64:8085/roltie/predict`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            escalatorId: escalatorId // Include escalatorId in the request body
          }),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response text:", errorText);
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Error getting prediction:", error.message);
      Alert.alert("Error getting prediction", error.message);
    }
  };

  return (
    <View style={styles.container}>
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
        onPress={() => submitFeedback(false)} // Pass boolean true for working
      />
      <Button
        title="Escalator is Broken"
        onPress={() => submitFeedback(true)} // Pass boolean false for broken
      />
      {status && <Text>Submitted as: {status}</Text>}
      <Button title="Trigger Model Training" onPress={triggerModelTraining} />
      <Button title="Get Prediction" onPress={getPrediction} />
      {prediction && <Text>Prediction: {prediction}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});
