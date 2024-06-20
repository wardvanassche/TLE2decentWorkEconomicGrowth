import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  Dimensions,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { BarChart } from "react-native-chart-kit";

export default function Settings() {
  const [escalatorIds, setEscalatorIds] = useState(["1", "2"]); // Example escalator IDs
  const [predictions, setPredictions] = useState([]);

  const triggerModelTraining = async () => {
    try {
      const response = await fetch("http://145.137.68.64:8085/roltie/train", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ escalatorIds }),
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

  const getPredictions = async () => {
    try {
      const responses = await Promise.all(
        escalatorIds.map((id) =>
          fetch("http://145.137.68.64:8085/roltie/predict", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ escalatorId: id }),
          })
        )
      );

      const data = await Promise.all(responses.map((res) => res.json()));

      const newPredictions = data.map((item, index) => ({
        label: `Escalator ${escalatorIds[index]}`,
        value: parseFloat(item.prediction),
      }));

      setPredictions(newPredictions);
    } catch (error) {
      Alert.alert("Error getting predictions", error.message);
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
      <View style={styles.buttonContainer}>
        <Button title="Trigger Model Training" onPress={triggerModelTraining} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Get Predictions" onPress={getPredictions} />
      </View>
      {predictions.length > 0 && (
        <View>
          {predictions.map((pred, index) => (
            <Text key={index} style={styles.prediction}>
              {pred.label}: {pred.value}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  label: {
    marginBottom: 8,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 16,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  prediction: {
    marginBottom: 16,
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
