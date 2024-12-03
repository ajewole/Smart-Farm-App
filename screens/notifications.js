import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import Icon from "react-native-vector-icons/FontAwesome";

// Function to get notifications
const Notification = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const db = useSQLiteContext();

  useEffect(() => {
    async function fetchNotifications() {
      const notificationsList = [];
      const result = await db.getAllAsync(
        `SELECT o.name, o.status, o.start_date, o.min_duration, o.max_duration, c.id AS crop_id, c.name AS crop_name
               FROM operations o
               JOIN crops c ON o.crop_id = c.id`,
        []
      );

      result.forEach((row) => {
        if (row.status === "Ongoing") {
          // Convert start_date to a Unix timestamp
          const startDate = new Date(row.start_date).getTime() / 1000; // Convert to seconds
          const currentPeriod = Date.now() / 1000; // Get current timestamp in seconds
          const diff = (currentPeriod - startDate) / 86400; // Difference in days (86400 seconds in a day)

          // Check if operation is within the warning period
          if (diff > row.min_duration && diff < row.max_duration) {
            const warn = `${row.name} operation for ${row.crop_name} will soon be due`;
            notificationsList.push({
              message: warn,
              id: row.crop_id,
              crop_name: row.crop_name,
            });
          }

          // Check if operation is overdue
          if (diff > row.max_duration) {
            const due = `${row.name} operation for ${row.crop_name} is already due`;
            notificationsList.push({
              message: due,
              id: row.crop_id,
              crop_name: row.crop_name,
            });
          }
        }
      });

      // result.forEach((row) => {
      //   if (row.status == "Ongoing") {
      //     const startDate = moment(row.start_date);
      //     const startPeriod = startDate.unix(); // Convert start date to Unix timestamp
      //     const currentPeriod = moment().unix(); // Get current timestamp
      //     const diff = (currentPeriod - startPeriod) / 86400; // Difference in days (86400 seconds in a day)

      //     // Check if operation is within the warning period
      //     if (diff > row.min_duration && diff < row.max_duration) {
      //       const warn = `${row.name} operation for ${row.crop_name} will soon be due`;
      //       notificationsList.push({
      //         message: warn,
      //         id: row.crop_id,
      //         crop_name: row.crop_name,
      //       });
      //     }

      //     // Check if operation is overdue
      //     if (diff > row.max_duration) {
      //       const due = `${row.name} operation for ${row.crop_name} is already due`;
      //       notificationsList.push({
      //         message: due,
      //         id: row.crop_id,
      //         crop_name: row.crop_name,
      //       });
      //     }
      //   }
      // });

      setNotifications(notificationsList);
      // console.log("Notifications: ", result);
    }
    fetchNotifications();
  }, []);

  const handleNavigate = (id, name) => {
    navigation.navigate("CropOperation", { crop_id: id, crop_name: name });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <ScrollView>
        {notifications.length > 0 ? (
          <>
            {notifications.map((notification, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.message}>{notification.message}</Text>
                <TouchableOpacity
                  onPress={() => {
                    handleNavigate(notification.id, notification.crop_name);
                  }}
                >
                  <Icon name="paper-plane" size={20} color="#0B5ED7" />
                </TouchableOpacity>
              </View>
            ))}
          </>
        ) : (
          <Text style={{ textAlign: "center" }}>No notifications Yet</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 10,
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  message: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default Notification;
