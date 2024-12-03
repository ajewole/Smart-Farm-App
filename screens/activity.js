import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSQLiteContext } from "expo-sqlite";

const Activity = () => {
  const [newActivity, setNewActivity] = useState('');
  const [activities, setActivities] = useState([]);
  const [activityAdded, setActivityAdded] = useState(false);
  const [ongoingActivities, setOngoingActivities] = useState([]);
  const [completedActivities, setCompletedActivities] = useState([]);

  const db = useSQLiteContext()

  // Create table if it doesn't exist
  useEffect(() => {
    fetchActivities();
  }, []);


  // Fetch activities using getAllAsync (simulated)
  const fetchActivities = async () => {
    try {
      const activitiesData = await db.getAllAsync('SELECT * FROM activities;');
      setOngoingActivities(activitiesData.filter(activity => activity.completed === 0));
      setCompletedActivities(activitiesData.filter(activity => activity.completed === 1));
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error fetching activities: ', error);
    }
  };

  // Add new activity using runAsync (simulated)
  const addActivity = async () => {
    if (newActivity.trim() === '') {
      setActivityAdded(true);
    } else {
      setActivityAdded(false);
      const today = new Date();
      const dateAdded = today.toLocaleDateString('en-GB');
      try {
        const result = await db.runAsync(
          'INSERT INTO activities (name, completed, date_added) VALUES (?, ?, ?);',
          [newActivity, 0, dateAdded]
        );
        const newActivityObj = {
          id: result.insertId,
          name: newActivity,
          completed: 0,
          date_added: dateAdded,
        };
        setActivities((prevActivities) => [...prevActivities, newActivityObj]);
        fetchActivities(); // Refresh the activities list
        setNewActivity('');
      } catch (error) {
        console.error('Error adding activity: ', error);
      }
    }
  };

  // Update activity completion status using runAsync (simulated)
  const handleCheckboxChange = async (activity) => {
    const updatedActivity = { ...activity, completed: activity.completed === 1 ? 0 : 1 };
    try {
      await db.runAsync(
        'UPDATE activities SET completed = ? WHERE id = ?;',
        [updatedActivity.completed, activity.id]
      );
      fetchActivities(); // Refresh the activities list
    } catch (error) {
      console.error('Error updating activity: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daily Activity Planner</Text>

      <View style={styles.addActivity}>
        <TextInput
          style={styles.input}
          value={newActivity}
          onChangeText={setNewActivity}
          placeholder="What are you doing today?"
        />
        <Button title="Add Activity" onPress={addActivity} color="green" />
      </View>

      {activityAdded && <Text style={styles.errorText}>You have not entered the activity</Text>}

      <ScrollView style={styles.listContainer}>
        <View>
          {activities.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <TouchableOpacity onPress={() => handleCheckboxChange(activity)}>
                <Text style={activity.completed ? styles.completed : styles.activityText}>
                  {activity.name}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {ongoingActivities.length > 0 && (
          <View style={styles.ongoingContainer}>
            <Text style={styles.subHeader}>Ongoing Activities</Text>
            {ongoingActivities.map((activity) => (
              <Text key={activity.id}>
                {activity.name} - {activity.date_added}
              </Text>
            ))}
          </View>
        )}

        {completedActivities.length > 0 && (
          <View style={styles.completedContainer}>
            <Text style={styles.subHeader}>Completed Activities</Text>
            {completedActivities.map((activity) => (
              <Text key={activity.id}>
                {activity.name} - {activity.date_added}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  header: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20,
  },
  addActivity: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  listContainer: {
    flex: 1,
  },
  activityItem: {
    marginBottom: 10,
  },
  activityText: {
    fontSize: 16,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  ongoingContainer: {
    marginTop: 20,
  },
  completedContainer: {
    marginTop: 20,
  },
  subHeader: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default Activity;
