import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
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
    ],
    directions: [
      { label: "Metrolijn A Binnenhof", value: "1" },
      { label: "Metrolijn B Nesselande", value: "2" },
      { label: "Metrolijn C De terp", value: "3" },
      { label: "Metrolijn D Rotterdam Centraal", value: "4" },
      { label: "Metrolijn E Den Haag Centraal", value: "5" },
      { label: "Metrolijn A Vlaardingen West", value: "6" },
      { label: "Metrolijn B Hoek van Holland strand", value: "7" },
      { label: "Metrolijn C en D De Akkers", value: "8" },
      { label: "Metrolijn E Slinge", value: "9" },
    ],
    types: [
      { label: "Metro", value: "1" },
      { label: "Lift", value: "2" },
    ],
    platformSides: [
      { label: "Links", value: "1" },
      { label: "Rechts", value: "2" },
    ],
    movements: [
      { label: "Boven", value: "1" },
      { label: "Beneden", value: "2" },
    ],
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

    console.log("Submitting feedback for Escalator ID:", escalatorId);
    try {
      const response = await fetch(
        `http://145.137.71.30:8087/roltie/meldingen`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            escalatorId: escalatorId,
            status: !isWorking,
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
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.row}>
          <Image source={require('../assets/Group 40.png')} style={styles.statusBar} />
          <View style={styles.dropdownContainer}>
            <Dropdown
              placeholder="Selecteer station:"
              selectedValue={station}
              onValueChange={(itemValue) => setStation(itemValue)}
              options={dropdownOptions.stations}
            />
            <Dropdown
              placeholder="Selecteer richting:"
              selectedValue={direction}
              onValueChange={(itemValue) => setDirection(itemValue)}
              options={dropdownOptions.directions}
            />
            <Dropdown
              placeholder="Een lift of een roltrap?"
              selectedValue={type}
              onValueChange={(itemValue) => setType(itemValue)}
              options={dropdownOptions.types}
            />
            <Dropdown
              placeholder="Aan welke kant van het perron"
              selectedValue={platformSide}
              onValueChange={(itemValue) => setPlatformSide(itemValue)}
              options={dropdownOptions.platformSides}
            />
            <Dropdown
              placeholder="Welke richting is die kapot?"
              selectedValue={movement}
              onValueChange={(itemValue) => setMovement(itemValue)}
              options={dropdownOptions.movements}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.notificationContainer}>
        <TouchableOpacity
          style={[styles.notificationButton, styles.buttonWorking]}
          onPress={() => submitFeedback(false)}
        >
          <Text style={styles.buttonText}>Hij Rolt!</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.notificationButton, styles.buttonNotWorking]}
          onPress={() => submitFeedback(true)}
        >
          <Text style={styles.buttonText}>Rolt niet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statusBar: {
    width: 50,
    height: 390, // Adjust the height as needed
    resizeMode: 'contain',
    marginRight: 10,
  },
  dropdownContainer: {
    flex: 1,
  },
  notificationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  notificationButton: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonWorking: {
    backgroundColor: "#00C720",
  },
  buttonNotWorking: {
    backgroundColor: "#FF0000",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
