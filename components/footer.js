import { View, Text, Image, StyleSheet, TouchableOpacity, BackHandler, Alert } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";

// Bottom Navigation component
export default function BottomNavigation() {
  const navigation = useNavigation()
  const confirmExitApp = () => {
    Alert.alert(
      "Exit App",
      "Are you sure you want to exit?",
      [
        { text: "No", onPress: () => console.log("Exit cancelled"), style: "cancel" },
        { text: "Yes", onPress: () => BackHandler.exitApp() },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.navContainer}>
      <TouchableOpacity>
      {/* <TouchableOpacity onPress={goHome}> */}
      <Ionicons name="home" size={30} color="white" onPress={() => navigation.navigate('Home')} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('About')}>
      <Ionicons name="information-circle" size={35} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={confirmExitApp}>
      <Ionicons name="exit" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#18864b",
  },
  navText: {
    fontSize: 16,
    color: "#ffffff",
  }
});
