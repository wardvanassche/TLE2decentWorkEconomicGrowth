import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function Notifications() {
  const [status, setStatus] = useState(null);
  const [escalatorId, setEscalatorId] = useState('1');
  const [prediction, setPrediction] = useState(null);

  const submitFeedback = async (status) => {
    try {
      const response = await fetch('http://145.137.111.231:8085/roltie/feedback', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          escalatorId: escalatorId, // Include escalatorId in the request body
          status: status ? 'working' : 'broken', // Ensure status is included in the body
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response text:", errorText);
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log("Data fetched:", data);
      Alert.alert(data.message || 'Feedback submitted successfully');
    } catch (error) {
      console.error("Error submitting feedback:", error.message);
      Alert.alert('Error submitting feedback', error.message);
    }
  };

  const triggerModelTraining = async () => {
    try {
      const response = await fetch('http://145.137.111.231:8085/roltie/train', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response text:", errorText);
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      Alert.alert(data.message || 'Model training triggered successfully');
    } catch (error) {
      console.error("Error triggering model training:", error.message);
      Alert.alert('Error triggering model training', error.message);
    }
  };

  const getPrediction = async () => {
    try {
      const response = await fetch(`http://1145.137.111.231:8085/roltie/predict/${escalatorId}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response text:", errorText);
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Error getting prediction:", error.message);
      Alert.alert('Error getting prediction', error.message);
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
      <Button title="Escalator is Working" onPress={() => submitFeedback(true)} />
      <Button title="Escalator is Broken" onPress={() => submitFeedback(false)} />
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
