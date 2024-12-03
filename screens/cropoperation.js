import React, { useState, useEffect, useLocalSearchParams } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import Icon from "react-native-vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function CropOperation({ navigation, route }) {
  const { crop_id, crop_name } = route.params; // Extract the parameter
  const [operations, setOperations] = useState([]);
  const [startDate, setStartDate] = useState(new Date()); // Stores the selected date
  const [startDateClicked, setStartDateClicked] = useState(false);
  const [operationId, setOperationId] = useState(null);
  const [startDateError, setStartDateError] = useState("");
  const [showDateInput, setShowDateInput] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState({}); // State to track checkbox status

  const db = useSQLiteContext();

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getOperations();
    });
  }, []);

  async function getOperations() {
    const result = await db.getAllAsync(
      `SELECT * FROM operations WHERE crop_id = ?`,
      [crop_id]
    );
    setOperations(result);
    console.log("Operations: ", result);
    // Initialize checkbox state for each operation
    const initialCheckboxStates = {};
    result.forEach((item) => {
      initialCheckboxStates[item.id] = item.status === "Completed"; // Pre-check if status is "Completed"
    });
    setCheckboxStates(initialCheckboxStates);
  }

  const editStartDate = (id) => {
    setOperationId(id);
    setStartDateClicked(true);
  };

  const cancelStartDate = (id) => {
    setOperationId(id);
    setShowDateInput(false);
  };

  // Function to handle the date change
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    if (event.type === "dismissed") {
      setStartDateClicked(false);
      setShowDateInput(false);
      setOperationId(null); // Clear the selected operation
      setStartDate(new Date()); // Reset the date picker to the current date
      return;
    }
    if (currentDate) {
      const day = String(currentDate.getDate()).padStart(2, "0"); // Get day and pad with 0 if necessary
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based, add 1 and pad
      const year = currentDate.getFullYear(); // Get year
      const formattedDate = `${day}-${month}-${year}`; // Format as DD-MM-YYYY
      setStartDate(formattedDate); // Update the selected date
    }
    setStartDateClicked(false); // Close the date picker
    setShowDateInput(true);
    console.log(currentDate);
  };

  const saveStartDate = async (operationId) => {
    Alert.alert("Save Start Date", "Do you want to save the start date?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          setStartDateError("");
          setShowDateInput(false);

          try {
            const [day, month, year] = startDate.split("-");
            const newDate = `${year}-${month}-${day}`; // Convert to ISO format
            const result = await db.runAsync(
              `UPDATE operations SET start_date = ?, status = ? WHERE id = ? AND crop_id = ?`,
              [newDate, "Ongoing", operationId, crop_id]
            );
            console.log("Success updating operation", result);
            console.log(newDate);
            getOperations();
          } catch (error) {
            console.error("Error saving start date:", error);
          }
        },
      },
    ]);
  };

  const handleCheckboxChange = async (operationId, isChecked) => {
    Alert.alert(
      "Completion Confirmation",
      "Do you want to set completion date for this operation and change status to 'Completed'?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            const updatedCheckboxStates = {
              ...checkboxStates,
              [operationId]: isChecked,
            };
            setCheckboxStates(updatedCheckboxStates);
            // Update database based on checkbox state
            const status = isChecked ? "Completed" : "Ongoing";
            const completionDate = isChecked
              ? new Date().toISOString().split("T")[0]
              : null;
            try {
              await db.runAsync(
                `UPDATE operations SET status = ?, completion_date = ? WHERE id = ? AND crop_id = ?`,
                [status, completionDate, operationId, crop_id]
              );
              console.log(
                `Operation ${operationId} updated to status: ${status}`
              );
              getOperations();
            } catch (error) {
              console.error("Error updating operation:", error);
            }
          },
        },
      ]
    );
  };
  const resetStatus = async (id) => {
    Alert.alert(
      "Reset Operation Status",
      "Do you want to reset the operation status and change it to 'Not Started' ?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            const status = "Not Started";
            const currentDate = new Date();

            // Format as DD-MM-YYYY
            const day = String(currentDate.getDate()).padStart(2, "0");
            const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
            const year = currentDate.getFullYear();

            // Combine into desired format
            const formattedDate = `${day}-${month}-${year}`;
            const start_date = formattedDate;
            const completion_date = formattedDate;
            try {
              await db.runAsync(
                `UPDATE operations SET status = ?, start_date = ?, completion_date = ? WHERE id = ?`,
                [status, start_date, completion_date, id]
              );
              console.log(
                `Operation ${operationId} updated to status: ${status}`
              );
              getOperations();
            } catch (error) {
              console.error("Error updating operation:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{crop_name} Cultivation Operations</Text>
      <FlatList
        data={operations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text>
              <Text style={{ fontWeight: "bold" }}>
                Operation Description:{" "}
              </Text>{" "}
              {item.description}
            </Text>
            <View style={styles.statusView}>
              <Text style={{ fontWeight: "bold" }}>Status: </Text>
              <Text
                style={[
                  styles.statusBadge,
                  item.status === "Not Started" && styles.notStarted,
                  item.status === "Ongoing" && styles.started,
                  item.status === "Completed" && styles.completed,
                ]}
              >
                {item.status}
              </Text>
              {item.status == "Not Started" && (
                <TouchableOpacity
                  onPress={() => editStartDate(item.id)}
                  style={styles.editIcon}
                >
                  <View>
                    <Icon name="edit" size={20} color="#0B5ED7" />
                  </View>
                </TouchableOpacity>
              )}
              {item.status != "Not Started" && (
                <TouchableOpacity
                  onPress={() => resetStatus(item.id)}
                  style={styles.editIcon}
                >
                  <View style={styles.resetContainer}>
                    <Icon name="refresh" size={20} color="#0B5ED7" />
                    <Text style={{ marginLeft: 5 }}>Reset</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
            {startDateClicked && operationId === item.id ? (
              <>
                <Text>Choose Start Date: </Text>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={new Date()}
                  mode="date" // You can also use "time" or "datetime"
                  display="default" // Controls how the picker is displayed
                  onChange={onChange}
                />
              </>
            ) : null}
            {showDateInput && operationId === item.id && (
              <View style={styles.dateContainer}>
                <Text style={{ fontWeight: "bold", marginRight: 5 }}>
                  Selected Date:
                </Text>
                <TextInput
                  style={styles.dateInput}
                  value={startDate}
                  editable={false}
                />
                <TouchableOpacity
                  onPress={() => saveStartDate(item.id)}
                  style={styles.editIcon}
                >
                  <Icon name="save" size={20} color="#0B5ED7" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => cancelStartDate(item.id)}
                  style={styles.closeIcon}
                >
                  <Icon name="close" size={20} color="red" />
                </TouchableOpacity>
              </View>
            )}
            {item.status == "Ongoing" && (
              <>
                <Text style={{ marginTop: 5 }}>
                  <Text style={{ fontWeight: "bold" }}>Date Started: </Text>
                  {item.start_date
                    ? new Date(item.start_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "Not Set"}
                </Text>
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() =>
                      handleCheckboxChange(item.id, !checkboxStates[item.id])
                    }
                  >
                    <Icon
                      name={
                        checkboxStates[item.id] ? "check-square" : "square-o"
                      }
                      size={24}
                      color="#0B5ED7"
                    />
                    <Text style={styles.checkboxLabel}>Mark as done</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {item.status == "Completed" && (
              <>
                <Text style={{ marginTop: 5 }}>
                  <Text style={{ fontWeight: "bold" }}>Date Started: </Text>
                  {item.start_date
                    ? new Date(item.start_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "Not Set"}
                </Text>
                <Text style={{ marginTop: 5 }}>
                  <Text style={{ fontWeight: "bold" }}>Date Completed: </Text>
                  {item.completion_date
                    ? new Date(item.completion_date).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )
                    : "Not Set"}
                </Text>
              </>
            )}
          </View>
        )}
      />
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
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 10,
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  dateContainer: {
    flex: 1,
    flexDirection: "row",
    marginTop: 5,
    alignItems: "center",
  },
  dateInput: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginRight: 5,
  },
  editIcon: {
    fontSize: 18,
    color: "#0B5ED7",
    marginLeft: 10,
  },
  closeIcon: {
    fontSize: 18,
    marginLeft: 20,
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
  statusView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    textAlign: "center",
    fontSize: 12,
    color: "#fff",
  },
  notStarted: {
    backgroundColor: "#dc3545",
  },
  started: {
    backgroundColor: "#ffc107",
  },
  completed: {
    backgroundColor: "#28a745",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
  },
  startDateContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  resetContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 30,
  },
});
