import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Animated,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from "react-native";
import axios from "axios";
import inputBackground2 from "../assets/inputvelden2.png"; // Import the new image

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(false);
  const [data, setData] = useState([]);
  const [startStation, setStartStation] = useState("");
  const [endStation, setEndStation] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const [showBackground, setShowBackground] = useState(false);
  const [showListBackground, setShowListBackground] = useState(false);
  const [inputBackgroundColor, setInputBackgroundColor] = useState("white");
  const [inputBackgroundImage, setInputBackgroundImage] = useState(
      require("../assets/inputvelden.png")
  ); // State for background image
  const [inputTextColor, setInputTextColor] = useState("#4A4A4A"); // State for input text color

  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;
  const backgroundTranslateYAnim = useRef(new Animated.Value(0)).current;
  const imageOpacityAnim = useRef(new Animated.Value(1)).current; // Animation for image opacity

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (showList) {
      Animated.timing(backgroundTranslateYAnim, {
        toValue: 100,
        duration: 500,
        useNativeDriver: true,
      }).start();
      setShowListBackground(true);
    } else {
      Animated.timing(backgroundTranslateYAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
      setShowListBackground(false);
    }
  }, [showList]);

  const handlePress = async () => {
    if (!startStation || !endStation) {
      Alert.alert("Error", "Fill in both station names");
      return;
    }
  
    setShowLoader(true);
  
    try {
      const response = await fetch("http://145.137.68.64:8085/roltie/station");
      const data = await response.json();
      const station = data.find(
        (item) => item.name.toLowerCase() === endStation.toLowerCase()
      );
      if (station) {
        setData([station]);
        setShowList(true);
        setShowLogo(false);
        setShowBackground(true);
        setInputBackgroundColor("#4A4A4A");
        animateBackgroundImageChange(() => {
          setInputBackgroundImage(inputBackground2); // Use inputvelden2.png
        });
        setInputTextColor("white"); // Change text color to white
      } else {
        Alert.alert(
            "Not found",
            "The specified destination station was not found."
        );
        setShowList(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setShowLoader(false);
    }
  };
  

  const handleBackPress = () => {
    setShowList(false);
    setData([]);
    setShowLogo(true);
    setShowBackground(false);
    setShowListBackground(false);
    setInputBackgroundColor("white");
    setInputBackgroundImage(require("../assets/inputvelden.png")); // Back to original image on back button
    setInputTextColor("#4A4A4A"); // Change text color back to original
  };

  const animateBackgroundImageChange = (callback) => {
    Animated.timing(imageOpacityAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      callback();
      Animated.timing(imageOpacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  };

  return (



      <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : null} // Adjust behavior for Android
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // Adjust offset if necessary
      >

        <View
            style={[
              styles.bottomrectangle,
            ]}
        >
        </View>

        <ScrollView contentContainerStyle={styles.scrollView}
                    keyboardShouldPersistTaps="handled">

          {showLogo && (
              <Image
                  source={require("../assets/logo.png")}
                  style={styles.logo}
                  onPress={() => navigation.navigate("Home")}
              />
          )}



          <Animated.View
              style={[
                styles.rectangle,
                { opacity: opacityAnim, transform: [{ translateY: translateYAnim }] },
              ]}

          >

            <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => navigation.navigate("Settings")}
            >
              <View style={styles.dotContainer}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            </TouchableOpacity>

            <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: inputBackgroundColor },
                ]}
            >
              <View style={styles.backgroundImageContainer}>
                <Animated.Image
                    source={inputBackgroundImage}
                    style={[styles.backgroundImage, { opacity: imageOpacityAnim }]}
                />
                <TextInput
                    placeholder="Choose a starting station"
                    style={[
                      styles.inputVan,
                      {
                        position: "absolute",
                        top: 10,
                        left: 30,
                        width: "90%",
                        color: inputTextColor,
                      },
                    ]}
                    onChangeText={setStartStation}
                    value={startStation}
                />
                <TextInput
                    placeholder="Choose an end station"
                    style={[
                      styles.inputNaar,
                      {
                        position: "absolute",
                        top: 60,
                        left: 30,
                        width: "90%",
                        color: inputTextColor,
                      },
                    ]}
                    onChangeText={setEndStation}
                    value={endStation}
                />
              </View>
              {!loading && !showList && (
                  <TouchableOpacity style={styles.button} onPress={handlePress}>
                    <Text style={styles.buttonText}>ROLTIE?</Text>
                  </TouchableOpacity>
              )}
            </View>
            {showLoader ? (
                <View style={styles.loaderContainer}>
                  <Image
                      source={require("../assets/loading.gif")}
                      style={styles.loader}
                  />
                </View>
            ) : (
                <Animated.View
                    style={[
                      styles.list,
                      {
                        transform: [{ translateY: backgroundTranslateYAnim }],
                        backgroundColor: showListBackground ? "#FFFFFF" : "#EAEAEA",
                      },
                    ]}
                >
                  {showList && (
                      <FlatList
                          data={data}
                          renderItem={({ item }) => {
                            let statusText = "";
                            let statusImage = require("../assets/working.png");

                            if (!item.elevators.working) {
                              statusText = "The elevator is out of order";
                              statusImage = require("../assets/notworking.png");
                            } else if (!item.escalators.working) {
                              statusText = "The escalator is out of order";
                              statusImage = require("../assets/notworking.png");
                            } else {
                              statusText = "Both are working";
                            }

                            return (
                                <View style={styles.listItem}>
                                  <View style={styles.statusContainer}>
                                    <Image
                                        source={statusImage}
                                        style={styles.statusImage}
                                    />
                                    <Text style={styles.statusText}>{statusText}</Text>
                                  </View>
                                  <Text>{item.name}</Text>
                                </View>
                            );
                          }}
                          keyExtractor={(item) => item._id}
                      />
                  )}
                </Animated.View>

            )}

            {!showList && !loading && (
                <View style={styles.reportContainer}>
                  <Text style={styles.reportText}>
                    Elevator or escalator not working?
                  </Text>
                  <TouchableOpacity
                      style={styles.reportButton}
                      onPress={() => navigation.navigate("Notifications")}
                  >
                    <Text style={styles.reportButtonText}>Make a report</Text>
                  </TouchableOpacity>
                </View>
            )}

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4A4A4A",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 210, // Adjust padding as needed
  },
  logo: {
    position: "absolute",
    top: "12%",
    width: 180,
    height: 100,
    resizeMode: "contain",
  },
  rectangle: {
    width: "100%",
    height: "75%",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingTop: 70,
    position: "fixed",
  },
  bottomrectangle: {
    width: "100%",
    height: 300,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    padding:0,
    margin:0,
  },
  settingsButton: {
    position: "absolute",
    top: 20,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 20,
    zIndex:10,
  },
  dotContainer: {
    flexDirection: "row",
    padding: 10,
    paddingBottom:20,
    paddingTop:20,
    backgroundColor:'#ffffff',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
    backgroundColor: "#4A4A4A",
  },
  inputContainer: {
    width: "100%",
    height: 200,
    marginTop: -20,
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "white",
  },
  backgroundImageContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundImage: {
    width: "90%",
    left:4,
    height: "100%",
    resizeMode: "contain",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: -40,
    zIndex: 2,
  },
  backButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  inputVan: {
    width: "100%",
    height: 55,
    borderBottomWidth: 0,
    borderBottomColor: "white ",
    fontSize: 16,
    paddingLeft: 50,
  },
  inputNaar: {
    width: "100%",
    height: 110,
    borderBottomWidth: 0,
    fontSize: 16,
    paddingLeft: 50,
  },
  button: {
    backgroundColor: "#00C720",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 5,
    alignItems: "center",
    width: "70%",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  loader: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  list: {
    width: "80%",
    marginTop: 100,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    flexDirection: "row",
    alignItems: "center",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    color: "#4A4A4A",
  },
  reportContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 250,
    width: "80%",
  },
  reportText: {
    fontSize: 14,
    color: "#4A4A4A",
    marginRight: 10,
    fontWeight: "bold",
  },
  reportButton: {
    backgroundColor: "#4A4A4A",
    width: 130,
    height: 50,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  reportButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
