import { View, Text, Image, StyleSheet, TouchableOpacity, BackHandler, Alert } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

// Header component with a logo
export default function Header(props) {
  return (
    <View style={styles.header}>
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />
      <Text style={styles.title}>{props.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    // marginTop: 50,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    // backgroundColor: "#18864b",
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff"
  }
});
