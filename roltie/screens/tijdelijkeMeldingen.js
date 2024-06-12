import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Alert, Picker } from 'react-native';
import axios from 'axios';

export default function Notifications() {
  const [status, setStatus] = useState(null);
  const [escalatorId, setEscalatorId] = useState('1');
  const [prediction, setPrediction] = useState(null);

  const submitFeedback = async (status) => {
    try {
      const response = await axios.post('http://localhost:3000/feedback', {
        escalatorId: parseInt(escalatorId),
        status,
      });
      Alert.alert(response.data);
    } catch (error) {
      Alert.alert('Error submitting feedback');
    }
  };

  const triggerModelTraining = async () => {
    try {
      const response = await axios.post('http://localhost:3000/train');
      Alert.alert(response.data);
    } catch (error) {
      Alert.alert('Error triggering model training');
    }
  };

  const getPrediction = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/predict/${escalatorId}`);
      setPrediction(response.data.prediction);
    } catch (error) {
      Alert.alert('Error getting prediction');
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
      <Button title="Escalator is Working" onPress={() => submitFeedback('working')} />
      <Button title="Escalator is Broken" onPress={() => submitFeedback('broken')} />
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
    padding: 16,
  },
});