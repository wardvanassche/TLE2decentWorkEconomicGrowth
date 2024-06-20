import React, { useState } from "react";
import { StyleSheet, Text, View, Button, Alert, Dimensions, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { BarChart } from "react-native-chart-kit";

export default function Notifications() {
  const [status, setStatus] = useState(null);
  const [escalatorId, setEscalatorId] = useState("1");
  const [prediction, setPrediction] = useState(null);
  const [predictions, setPredictions] = useState([]);

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
  
      console.log("Response status:", response.status);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response text:", errorText);
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
  
      console.log("Data received:", data);
  
      Alert.alert(data.message || "Model training triggered successfully");
    } catch (error) {
      console.error("Error triggering model training:", error.message);
  
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

      // Update the prediction for the specific escalator
      setPredictions((prevPredictions) => {
        const existingPrediction = prevPredictions.find(p => p.label === `Escalator ${escalatorId}`);
        if (existingPrediction) {
          return prevPredictions.map(p => 
            p.label === `Escalator ${escalatorId}` 
              ? { ...p, value: parseFloat(data.prediction) } 
              : p
          );
        } else {
          return [
            ...prevPredictions,
            { label: `Escalator ${escalatorId}`, value: parseFloat(data.prediction) }
          ];
        }
      });
    } catch (error) {
      console.error("Error getting prediction:", error.message);
      Alert.alert("Error getting prediction", error.message);
    }
  };

  const xValues = predictions.map(prediction => prediction.label);
  const yValues = predictions.map(prediction => prediction.value);

  // Ensure the y-axis is always 0-100
  const data = {
    labels: xValues,
    datasets: [
      {
        data: yValues.map(value => value > 100 ? 100 : value < 0 ? 0 : value), // Ensure values are between 0 and 100
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726"
    },
    yAxisLabel: "",
    yAxisSuffix: "%",
    yAxisInterval: 1, // optional, defaults to 1
  };

  return (
    <ScrollView style={styles.container}>
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
      <Text style={styles.title}>Predictions Chart</Text>
      <BarChart
        style={styles.chart}
        data={data}
        width={Dimensions.get("window").width - 32}
        height={220}
        chartConfig={chartConfig}
        verticalLabelRotation={30}
        fromZero={true}
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
});
