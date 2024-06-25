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
  Platform,
} from "react-native";
import inputBackground2 from "../assets/inputvelden2.png"; // Import the new image
import GreenArrow from "../assets/inputvelden.png"; // Import the PNG for green arrow (as SVG is removed)

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
  const [showCheckmark, setShowCheckmark] = useState(false); // State for showing the checkmark

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

  const stationNames = {
    // Add station names if necessary
  };

  const correctStationName = (name) => {
    return stationNames[name] || name;
  };

  const handlePress = async () => {
    if (!startStation || !endStation) {
      Alert.alert("Error", "Vul beide stationsnamen in")
    }

    setShowLoader(true);

    try {
      const response = await fetch(`http://145.137.71.30:8087/roltie/station`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          station1: startStation,
          station2: endStation,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.brokenEscalators.length > 0) {
        setData(data.brokenEscalators);
        setShowList(true);
        setShowLogo(false);
        setShowBackground(true);
        setInputBackgroundColor("#4A4A4A");
        animateBackgroundImageChange(() => {
          setInputBackgroundImage(inputBackground2); // Use inputvelden2.png
        });
        setInputTextColor("white"); // Change text color to white
      } else {
        setShowCheckmark(true); // Show checkmark when there are no broken escalators
        setShowList(false);
        setShowLogo(false);
        setShowBackground(false);
        setInputBackgroundColor("white");
        setInputTextColor("#4A4A4A");
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "There was an error retrieving the station information. Please try again later."
      );
    } finally {
      setShowLoader(false);
    }
  };

  const handleBackPress = () => {
    setShowList(false);
    setShowCheckmark(false); // Hide the checkmark on back button press
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

  const switchStations = () => {
    setStartStation(endStation);
    setEndStation(startStation);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : null} // Adjust behavior for Android
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // Adjust offset if necessary
    >
      <View style={[styles.bottomrectangle]}></View>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          onPress={() => navigation.navigate("Home")}
        />
        <Animated.View
          style={[
            styles.rectangle,
            {
              opacity: opacityAnim,
              transform: [{ translateY: translateYAnim }],
            },
          ]}
        >
          {showLogo && (
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
          )}
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: inputBackgroundColor,
                marginTop: showLogo ? -20 : -70,
              },
            ]}
          >
            <View style={styles.backgroundImageContainer}>
              <Animated.Image
                source={inputBackgroundImage}
                style={[styles.backgroundImage, { opacity: imageOpacityAnim }]}
              />
              <TextInput
                placeholder="vanaf welk station begin je?"
                style={[
                  styles.inputVan,
                  {
                    position: "absolute",
                    top: 10,
                    left: 30,
                    width: "80%",
                    color: inputTextColor,
                  },
                ]}
                onChangeText={(text) => setStartStation(text)}
                value={startStation}
              />
              <TextInput
                placeholder="Kies een eindbestemming"
                style={[
                  styles.inputNaar,
                  {
                    position: "absolute",
                    top: 60,
                    left: 30,
                    width: "80%",
                    color: inputTextColor,
                  },
                ]}
                onChangeText={(text) => setEndStation(text)}
                value={endStation}
              />
              <TouchableOpacity
                style={styles.switchButton}
                onPress={switchStations}
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
                  marginTop: showLogo ? 100 : -100,
                },
              ]}
            >
              {showList && (
                <FlatList
                  data={data}
                  renderItem={({ item }) => {
                    let statusText = "De roltrap is kapot";
                    let statusImage = require("../assets/notworkingescalator.png");

                    if (item.working === false) {
                      statusText = "The escalator is out of order";
                      statusImage = require("../assets/notworking.png");
                    }

                    return (
                      <View
                        style={styles.listItem}
                        key={item.escalatorId.toString()}
                      >
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
                  keyExtractor={(item) => item.escalatorId.toString()}
                />
              )}
              {showCheckmark && (
                <View style={styles.checkmarkContainer}>
                  <Image
                    source={require("../assets/check groen.png")}
                    style={styles.checkmark}
                  />
                  <Text style={styles.checkmarkText}>Alles Rolt</Text>
                </View>
              )}
            </Animated.View>
          )}
          {!showList && !loading && (
            <View style={styles.reportContainer}>
              <Text style={styles.reportText}>
                Werkt de lift of roltrap niet?
              </Text>
              <TouchableOpacity
                style={styles.reportButton}
                onPress={() => navigation.navigate("Notifications")}
              >
                <Text style={styles.reportButtonText}>Maak een melding</Text>
              </TouchableOpacity>
            </View>
          )}
          {showList && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Text style={styles.backButtonText}>Terug</Text>
            </TouchableOpacity>
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
    padding: 0,
    margin: 0,
  },
  settingsButton: {
    position: "absolute",
    top: 20,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 20,
    zIndex: 10,
  },
  dotContainer: {
    flexDirection: "row",
    padding: 10,
    paddingBottom: 20,
    paddingTop: 20,
    backgroundColor: "#ffffff",
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
    left: 4,
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
  switchButton: {
    position: "absolute",
    top: 50,
    right: 25,
    backgroundColor: "transparent",
    padding: 5,
    borderRadius: 5,
    width: 30,
    height: 40,
    opacity: 0.1, // Temporarily increase opacity for testing
  },
  switchImage: {
    position: "absolute",
    top: 50,
    right: 25,
    width: 30,
    height: 40,
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
  checkmarkContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  checkmark: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  checkmarkText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    color: "#4A4A4A",
  },
});
