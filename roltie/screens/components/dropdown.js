// components/dropdown.js
import React from "react";
import { View, Text, Picker, StyleSheet } from "react-native";

const Dropdown = ({ placeholder, selectedValue, onValueChange, options }) => {
  return (
    <View style={styles.dropdownContainer}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
      >
        <Picker.Item label={placeholder} value="" color="#aaa" />
        {options.map((option) => (
          <Picker.Item key={option.value} label={option.label} value={option.value} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    marginBottom: 35, // Increased space between dropdowns
    borderColor: '#00C720',
    borderWidth: 1,
    borderRadius: 4,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default Dropdown;
