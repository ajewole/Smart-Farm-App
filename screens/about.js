import { View, Text } from "react-native";
import React from "react";

const About = () => {
  return (
    <View>
      <Text
        style={{
          fontSize: 25,
          textAlign: "center",
          marginTop: 20,
          fontWeight: "bold",
        }}
      >
        About Smart Farm App
      </Text>
      <Text style={{ fontSize: 15, textAlign: "justify", padding: 15 }}>
        The Smart Farm App is a user-friendly mobile application designed to
        enhance modern farming by streamlining farm management and
        decision-making. It enables farmers to register farms, plan and track
        crop cultivation, manage daily activities, and receive notifications for
        essential tasks. The app also provides access to curated resources on
        best farming practices and integrates smart decision support to
        recommend optimal actions. With features like real-time monitoring and
        control, it empowers farmers to boost productivity and efficiency while
        reducing waste.
      </Text>
      <Text style={{ fontSize: 20, textAlign: "center", marginTop: 20 }}>
        Copyright &copy; {new Date().getFullYear()}
      </Text>
      <Text style={{ fontSize: 15, textAlign: "center", marginTop: 20 }}>
        This app was designed and built by{" "}
        <Text style={{ fontWeight: "bold" }}>
          Ibrahim Ayodeji and Akeem Taofeek
        </Text>{" "}
        under the supervison of{" "}
        <Text style={{ fontWeight: "bold" }}>Dr Peter O. Ajewole</Text> in the
        Department of Agricultural and Bio-Environmental Engineering, The
        Federal Polytechnic, Ado-Ekiti, Nigeria. For more information, contact
        or whatsapp <Text style={{ fontWeight: "bold" }}>07068675164.</Text>
      </Text>
    </View>
  );
};

export default About;
