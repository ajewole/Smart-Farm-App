import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import WeatherApp from '../components/weather';


export default function Home({navigation}) {
  return (
    <View style={styles.container}>
      <WeatherApp />
      <Text style={styles.title}>Select Menu</Text>
      <View style={styles.row}>
        <View style={styles.cardContainer}>
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('CropCultivation')}
          >
            <Image 
              source={require('../assets/images/cropcultivation.jpg')} 
              style={styles.menuLogo} 
            />
            <Text>Crop Cultivation</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardContainer}>
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('Resources')}
          >
            <Image 
              source={require('../assets/images/resources.jpg')} 
              style={styles.menuLogo} 
            />
            <Text>Resources</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.cardContainer}>
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('Notification')}
          >
            <Image 
              source={require('../assets/images/notification.png')} 
              style={styles.menuLogo} 
            />
            <Text>Notifications</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardContainer}>
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('Activity')}
          >
            <Image 
              source={require('../assets/images/activityplanner.jpg')} 
              style={styles.menuLogo} 
            />
            <Text>Activity Planner</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  cardContainer: {
    justifyContent:'center',
    alignItems: 'center',
    textAlign: 'center',
    marginHorizontal: 10,
    // height: 300
  },
  card: {
    alignItems: 'center',
    padding: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    width: 150,
    padding: 10
  },
  menuLogo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
});