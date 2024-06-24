import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Button,
    Alert,
    ScrollView,
} from "react-native";
import Dropdown from "./components/dropdown.js"; // Adjust the path based on your file structure

export default function Notifications() {
    const [station, setStation] = useState(null);
    const [direction, setDirection] = useState(null);
    const [type, setType] = useState(null);
    const [platformSide, setPlatformSide] = useState(null);
    const [movement, setMovement] = useState(null);

    const dropdownOptions = {
        stations: [
            { label: "Beurs", value: "1" },
            { label: "Kralingse Zoom", value: "2" },
            { label: "Wilhelminaplein", value: "3" },
            // Add more stations as needed
        ],
        directions: [
            { label: "North", value: "1" },
            { label: "South", value: "2" },
            // Add more directions as needed
        ],
        types: [
            { label: "Metro", value: "1" },
            { label: "Lift", value: "2" },
            // Add more types as needed
        ],
        platformSides: [
            { label: "Left", value: "1" },
            { label: "Right", value: "2" },
            // Add more sides as needed
        ],
        movements: [
            { label: "Up", value: "1" },
            { label: "Down", value: "2" },
            // Add more movements as needed
        ],
    };

    const handleStationSelect = (option) => {
        setStation(option.value);
    };

    const handleDirectionSelect = (option) => {
        setDirection(option.value);
    };

    const handleTypeSelect = (option) => {
        setType(option.value);
    };

    const handlePlatformSideSelect = (option) => {
        setPlatformSide(option.value);
    };

    const handleMovementSelect = (option) => {
        setMovement(option.value);
    };

    const generateEscalatorId = () => {
        if (station && direction && type && platformSide && movement) {
            return `${station}${direction}${type}${platformSide}${movement}`;
        }
        return null; // Handle cases where not all dropdowns are selected
    };

    const submitFeedback = async (isWorking) => {
        const escalatorId = generateEscalatorId();
        if (!escalatorId) {
            Alert.alert("Please select options for all dropdowns.");
            return;
        }

        try {
            const response = await fetch(
                `http://145.137.76.138:8087/roltie/meldingen`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        escalatorId: escalatorId,
                        status: false,
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
            <Dropdown
                title="Select station:"
                options={dropdownOptions.stations}
                onSelect={handleStationSelect}
            />
            <Dropdown
                title="Select direction:"
                options={dropdownOptions.directions}
                onSelect={handleDirectionSelect}
            />
            <Dropdown
                title="Select type:"
                options={dropdownOptions.types}
                onSelect={handleTypeSelect}
            />
            <Dropdown
                title="Select platform side:"
                options={dropdownOptions.platformSides}
                onSelect={handlePlatformSideSelect}
            />
            <Dropdown
                title="Select movement:"
                options={dropdownOptions.movements}
                onSelect={handleMovementSelect}
            />

            <Text>Report the status of the escalator:</Text>
            <Button
                title="De roltrap werkt"
                onPress={() => submitFeedback(false)}
            />
            <Button
                title="De roltrap is kapot"
                onPress={() => submitFeedback(true)}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
});
