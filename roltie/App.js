import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './screens/homescreen';
import MeldingScreen from "./screens/meldingscreen";
import TijdelijkeMeldingen from "./screens/tijdelijkeMeldingen.js";

export default function App() {
  return (
      <TijdelijkeMeldingen/>
  );
}
