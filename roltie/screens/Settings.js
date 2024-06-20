import React, { useState } from "react";
import { StyleSheet, Text, View, Button, Alert, Dimensions, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { BarChart } from "react-native-chart-kit";

export default function Settings() {
  const [escalatorId, setEscalatorId] = useState("1");
  const [prediction, setPrediction] = useState(null);
  const [predictions, setPredictions] = useState([]);

  const triggerModelTraining = async () => {
    try {
      const response = await fetch("http://145.137.68.64:8085/roltie/train", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ escalatorId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Network response was not ok: " + errorText);
      }

      const data = await response.json();
      Alert.alert(data.message || "Model training triggered successfully");
    } catch (error) {
      Alert.alert("Error triggering model training", error.message);
    }
  };

  const getPrediction = async () => {
    try {
      const response = await fetch("http://145.137.68.64:8085/roltie/predict", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ escalatorId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Network response was not ok: " + errorText);
      }

      const data = await response.json();
      setPrediction(data.prediction);

      setPredictions((prevPredictions) => {
        const existingPrediction = prevPredictions.find(
          (p) => p.label === `Escalator ${escalatorId}`
        );
        if (existingPrediction) {
          return prevPredictions.map((p) =>
            p.label === `Escalator ${escalatorId}`
              ? { ...p, value: parseFloat(data.prediction) }
              : p
          );
        } else {
          return [
            ...prevPredictions,
            { label: `Escalator ${escalatorId}`, value: parseFloat(data.prediction) },
          ];
        }
      });
    } catch (error) {
      Alert.alert("Error getting prediction", error.message);
    }
  };

  const xValues = predictions.map((prediction) => prediction.label);
  const yValues = predictions.map((prediction) => prediction.value);

  const data = {
    labels: xValues,
    datasets: [
      {
        data: yValues.map((value) =>
          value > 100 ? 100 : value < 0 ? 0 : value
        ),
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16 },
    yAxisSuffix: "%",
    yAxisInterval: 1,
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
      </Picker>
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
