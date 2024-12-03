import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

export default function Resources({ navigation }) {
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [error, setError] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false); // New state for loading

  const API_KEY = "AIzaSyBJtweu9nWaqpiEVurK_9ljlVSt3b2HbjE"; // Replace with your own API key

  const searchYouTubeVideos = async (query, maxResults = 100) => {
    const BASE_URL = "https://www.googleapis.com/youtube/v3/search";
    setLoading(true); // Start loading
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          part: "snippet",
          q: query,
          type: "video",
          maxResults: maxResults,
          key: API_KEY,
        },
      });
      setVideos(response.data.items);
    } catch (error) {
      console.error("Error fetching videos:", error.message);
      Alert.alert("Error", "Unable to fetch videos. Please check internet connection and try again later.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const getVideos = () => {
    setError(false);
    if (!selectedCrop) {
      setError(true);
    } else {
      searchYouTubeVideos(`${selectedCrop} cultivation practices`);
    }
  };

  const navigateToVideo = (video) => {
    navigation.navigate("ResourceVideo", {
      video_title: video.snippet.title,
      selected_crop: selectedCrop,
      video_id: video.id.videoId,
    });
  };

  const renderVideoCard = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.snippet.title}</Text>
        <Text style={styles.cardText}>{item.snippet.channelTitle}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigateToVideo(item)}
        >
          <Text style={styles.buttonText}>Watch Video</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Resources</Text>
      <View style={styles.inputGroup}>
        <Picker
          selectedValue={selectedCrop}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedCrop(itemValue)}
        >
          <Picker.Item label="Select Crop" value={null} />
          <Picker.Item label="Maize" value="maize" />
          <Picker.Item label="Rice" value="rice" />
          <Picker.Item label="Cassava" value="cassava" />
          <Picker.Item label="Yam" value="yam" />
        </Picker>
        <TouchableOpacity style={styles.getButton} onPress={getVideos}>
          <Text style={styles.getButtonText}>Get Resources</Text>
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>Please select a crop</Text>}

      {loading ? ( // Show ActivityIndicator when loading
        <View>
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
          <Text style={{textAlign: 'center'}}>Loading video resources...</Text>
        </View>
      ) : (
        <FlatList
          data={videos}
          renderItem={renderVideoCard}
          keyExtractor={(item) => item.id.videoId}
          contentContainerStyle={styles.videoList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  inputGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  picker: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginRight: 10,
  },
  getButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
  },
  getButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
  videoList: {
    marginTop: 20,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loader: {
    marginTop: 20,
  },
});
