import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  Dimensions,
  ScrollView,
  Switch,
} from "react-native";
import { BarChart } from "react-native-chart-kit";

export default function Settings() {
  const [escalatorIds, setEscalatorIds] = useState(["1", "2"]); // Example escalator IDs
  const [predictions, setPredictions] = useState([]);
  const [showChart, setShowChart] = useState(true); // Toggle state

  useEffect(() => {
    getPredictions();
  }, []); // Empty dependency array means this runs once when the component mounts

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

      // Re-trigger predictions after model training
      getPredictions();
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
      <Text style={styles.title}>Predictions Display</Text>
      <View style={styles.switchContainer}>
        <Text>Show Chart</Text>
        <Switch
          value={showChart}
          onValueChange={() => setShowChart((previousState) => !previousState)}
        />
      </View>
      {showChart ? (
        <BarChart
          style={styles.chart}
          data={data}
          width={Dimensions.get("window").width - 32}
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          fromZero={true}
        />
      ) : (
        <View>
          {predictions.map((pred, index) => (
            <Text key={index} style={styles.prediction}>
              {pred.label}: {pred.value}
            </Text>
          ))}
        </View>
      )}
      <View style={styles.buttonContainer}>
        <Button title="Update Roltrappen" onPress={triggerModelTraining} />
      </View>
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
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
});
