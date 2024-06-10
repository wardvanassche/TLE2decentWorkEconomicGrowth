// App.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert, Picker } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Brain from 'brain.js';

export default function TijdelijkeMeldingen() {
    const [status, setStatus] = useState(null);
    const [escalatorId, setEscalatorId] = useState('1');
    const [prediction, setPrediction] = useState(null);
    const [models, setModels] = useState({});

    useEffect(() => {
        // Load the trained models
        const loadModels = async () => {
            const escalatorIds = ['1', '2']; // Add more escalator IDs as needed
            const loadedModels = {};

            for (const id of escalatorIds) {
                try {
                    const modelJson = await FileSystem.readAsStringAsync(
                        FileSystem.documentDirectory + `model_${id}.json`
                    );
                    const model = JSON.parse(modelJson);
                    loadedModels[id] = new Brain.NeuralNetwork().fromJSON(model);
                } catch (error) {
                    console.error(`Error loading model for escalator ${id}:`, error);
                }
            }

            setModels(loadedModels);
        };

        loadModels();
    }, []);

    const submitFeedback = (status) => {
        setStatus(status);
        const timestamp = new Date().toISOString();

        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO Roltrappen (escalator_id, status, timestamp) VALUES (?, ?, ?)',
                [escalatorId, status, timestamp],
                (_, result) => {
                    Alert.alert("Feedback submitted successfully!");
                },
                (_, error) => {
                    Alert.alert("Error submitting feedback, please try again.");
                }
            );
        });
    };

    const getPrediction = () => {
        const net = models[escalatorId];
        if (net) {
            const input = { broken: 0 }; // Example input, adjust as needed
            const output = net.run(input);
            setPrediction(output.broken > 0.5 ? 'Broken' : 'Working');
        } else {
            Alert.alert("Model for this escalator is not loaded yet.");
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