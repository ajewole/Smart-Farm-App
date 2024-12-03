import { useEffect, useState, Suspense } from "react";
import { StatusBar } from "expo-status-bar";
import { SQLiteProvider } from "expo-sqlite";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import Home from "./screens/home";
import CropCultivation from "./screens/cropcultivation";
import Header from "./components/header";
import BottomNavigation from "./components/footer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import CropOperation from "./screens/cropoperation";
import Welcome from "./screens/welcome";
import Resources from "./screens/resources";
import ResourceVideo from "./screens/resourcevideo";
import Notification from "./screens/notifications";
import Activity from "./screens/activity";
import About from "./screens/about";

const Stack = createNativeStackNavigator();

export default function App() {
  const [dbLoaded, setDbLoaded] = useState(false);

  return (
    <NavigationContainer>
      <Suspense
        fallback={
          <View style={{flex: 1}}>
            <ActivityIndicator size={"large"} />
            <Text>Loading database...</Text>
          </View>
        }
      >
        <SQLiteProvider
          databaseName="mydata.db"
          useSuspense
          assetSource={{ assetId: require("./assets/mydata.db") }}
        >
          <View style={styles.container}>
            <Stack.Navigator
              screenOptions={{
                headerTintColor: "white", // Change arrow color
              }}
            >
              <Stack.Screen
                name="Welcome"
                component={Welcome}
                options={{
                  headerTitle: () => <Header title="Smart Farm App" />,
                  headerStyle: {
                    backgroundColor: "#18864b",
                    height: 120,
                  },
                }}
              />
              <Stack.Screen
                name="Home"
                component={Home}
                options={{
                  headerTitle: () => <Header title="Smart Farm App" />,
                  headerStyle: {
                    backgroundColor: "#18864b",
                    height: 120,
                  },
                }}
              />
              <Stack.Screen
                name="About"
                component={About}
                options={{
                  headerTitle: () => <Header title="Smart Farm App" />,
                  headerStyle: {
                    backgroundColor: "#18864b",
                    height: 120,
                  },
                }}
              />
              <Stack.Screen
                name="CropCultivation"
                component={CropCultivation}
                options={{
                  headerTitle: () => <Header title="Crop Cultivation" />,
                  headerStyle: {
                    backgroundColor: "#18864b",
                    height: 120,
                  },
                }}
              />
              <Stack.Screen
                name="CropOperation"
                component={CropOperation}
                options={{
                  headerTitle: () => <Header title="Crop Operations" />,
                  headerStyle: {
                    backgroundColor: "#18864b",
                    height: 120,
                  },
                }}
              />
              <Stack.Screen
                name="Resources"
                component={Resources}
                options={{
                  headerTitle: () => <Header title="Resources" />,
                  headerStyle: {
                    backgroundColor: "#18864b",
                    height: 120,
                  },
                }}
              />
              <Stack.Screen
                name="ResourceVideo"
                component={ResourceVideo}
                options={{
                  headerTitle: () => <Header title="Resource Video" />,
                  headerStyle: {
                    backgroundColor: "#18864b",
                    height: 120,
                  },
                }}
              />
              <Stack.Screen
                name="Notification"
                component={Notification}
                options={{
                  headerTitle: () => <Header title="Notifications" />,
                  headerStyle: {
                    backgroundColor: "#18864b",
                    height: 120,
                  },
                }}
              />
              <Stack.Screen
                name="Activity"
                component={Activity}
                options={{
                  headerTitle: () => <Header title="Activity Planner" />,
                  headerStyle: {
                    backgroundColor: "#18864b",
                    height: 120,
                  },
                }}
              />
            </Stack.Navigator>
            <BottomNavigation />
          </View>
        </SQLiteProvider>
      </Suspense>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // // justifyContent: "center",
    // marginTop: 50,
  },
});
