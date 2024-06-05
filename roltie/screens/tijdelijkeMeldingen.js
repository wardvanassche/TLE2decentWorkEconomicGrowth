import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('feedback.db');

export default function TijdelijkeMeldingen() {
    const [status, setStatus] = useState(null);

    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        status TEXT,
        timestamp TEXT
      );`
        );
    });

    const submitFeedback = (status) => {
        setStatus(status);
        const timestamp = new Date().toISOString();

        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO feedback (status, timestamp) VALUES (?, ?)',
                [status, timestamp],
                (_, result) => {
                    Alert.alert("Feedback submitted successfully!");
                },
                (_, error) => {
                    Alert.alert("Error submitting feedback, please try again.");
                }
            );
        });
    };

    return (
        <View style={styles.container}>
            <Text>Report the status of the escalator:</Text>
            <Button title="Escalator is Working" onPress={() => submitFeedback('working')} />
            <Button title="Escalator is Broken" onPress={() => submitFeedback('broken')} />
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