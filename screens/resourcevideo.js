import React, { useState, useCallback } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

export default function ResourceVideo({ route }) {
  const { video_title, selected_crop, video_id } = route.params;
  const [isPlaying, setIsPlaying] = useState(true);
  const [playerState, setPlayerState] = useState(null);

  const handlePlayerStateChange = useCallback((state) => {
    console.log("Player State:", state);
    setPlayerState(state);
  }, []);

  const handleError = (e) => {
    console.error("YouTube Player Error:", e.error);
  };

  const handlePlayerReady = () => {
    console.log("YouTube Player Ready!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {selected_crop.toUpperCase()} Cultivation Resource
      </Text>
      <Text style={styles.subheading}>Video Title - {video_title}</Text>

      <YoutubePlayer
        height={300}
        width="100%" // Ensure the width is set
        play={isPlaying}
        videoId={String(video_id)}
        onError={handleError}
        onReady={handlePlayerReady}
        onChangeState={handlePlayerStateChange}
        webViewStyle={{ backgroundColor: 'transparent' }} // Set background to transparent
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsPlaying(!isPlaying)}
      >
        <Text style={styles.buttonText}>{isPlaying ? "Pause" : "Play"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  subheading: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#1e90ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  stateText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
  },
});
