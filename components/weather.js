import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import * as Location from "expo-location";

export default function WeatherApp() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to set error message with a timeout to dismiss it after 5 seconds
  const showError = (message) => {
    setErrorMsg(message);
    setTimeout(() => setErrorMsg(null), 2000); // Clear error after 5 seconds
  };

  // Fetch device location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        showError("Permission to access location was denied.");
        setLoading(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  // Fetch weather data once location is obtained
  useEffect(() => {
    if (location) {
      fetchWeather();
    } else {
      // Set timeout to hide loading after 2 seconds if there's no location
      const loadingTimeout = setTimeout(() => {
        if (loading) {
          setLoading(false);
          showError("Failed to retrieve location.");
        }
      }, 2000);

      return () => clearTimeout(loadingTimeout);
    }
  }, [location]);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const apiKey = "e7cd8ecc5dc52215804155515faee862"; // Replace with your OpenWeatherMap API key
      const { latitude, longitude } = location;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();
      setWeather(data);
      setLoading(false);
    } catch (error) {
      // console.error("Error fetching weather data:", error);
      setLoading(false);
      showError("Failed to fetch weather data.");
    }
  };

  const getWeatherSummary = () => {
    if (!weather) return "";

    const mainWeather = weather.weather[0].main.toLowerCase();

    if (mainWeather.includes("rain")) {
      return "Expect rain today.";
    } else if (mainWeather.includes("clear")) {
      return "It will be sunny today.";
    } else if (mainWeather.includes("cloud")) {
      return "It will be cloudy today.";
    } else {
      return `Weather: ${mainWeather.charAt(0).toUpperCase() + mainWeather.slice(1)}.`;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading weather info...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
      {weather ? (
        <>
          <Text style={styles.title}>Weather Summary</Text>
          <Text style={styles.weatherSummary}>{getWeatherSummary()}</Text>
          <Text style={styles.temperature}>
            Temperature: {weather.main.temp}°C
          </Text>
          <Text style={styles.location}>
            Location: {weather.name || "Unknown"}
          </Text>
        </>
      ) : (
        <Text>No weather data available.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  weatherSummary: {
    fontSize: 18,
    marginBottom: 10,
  },
  temperature: {
    fontSize: 16,
  },
  location: {
    fontSize: 16,
    marginTop: 5,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    position: "absolute",
    top: 10,
  },
});
