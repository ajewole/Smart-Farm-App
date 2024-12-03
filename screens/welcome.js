import { useEffect } from "react";
import { StyleSheet, Text, View, Image, Button, TouchableOpacity } from "react-native";

export default function Welcome({navigation}) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.navigate('Home')
    }, 3000); // Navigate after 3 seconds
    return () => clearTimeout(timeout);
  }, []);

  const goHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Image
          source={require("../assets/images/smartlogo2.jpg")}
          style={styles.img}
        />
        <Text style={styles.title}>Welcome to Smart Farm App</Text>
        <Text style={styles.subtitle}>
          A farmer's companion for smart and precision farming
        </Text>
        <TouchableOpacity onPress={goHome} style={styles.button}>
            <Text style={styles.buttonText}>Click here to continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: '#ffffff'
  },
  main: {
    flex: 1,
    marginTop: 30,
    maxWidth: 960,
    // marginHorizontal: "auto",
    alignItems: "center",
  },
  img: { marginBottom: 30,},
  title: {
    fontSize: 30,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: "#38434D",
  },
  button: {
    backgroundColor: "#214F33", // Bootstrap primary color
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 50,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff", // White text
    fontSize: 20,
    fontWeight: "bold",
  },
});
