import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";

export default function CropCultivation({navigation}) {
  const [crops, setCrops] = useState([]);
 
  const db = useSQLiteContext()
  
  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getCrops()
    })
  }, []);

  async function getCrops() {
    const result = await db.getAllAsync(`SELECT * FROM crops`);
    console.log("Crops: ", result)
  }

  const handleNavigate = (id, name) => {
    navigation.navigate('CropOperation', { crop_id: id, crop_name: name });
  };

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Select Crop</Text>
    <View style={styles.row}>
      <View style={styles.cardContainer}>
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => handleNavigate(1, 'Maize')}
        >
          <Image 
            source={require('../assets/images/maize.png')} 
            style={styles.menuLogo} 
          />
          <Text>Maize</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}>
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => handleNavigate(2, 'Rice')}
        >
          <Image 
            source={require('../assets/images/rice.png')} 
            style={styles.menuLogo} 
          />
          <Text>Rice</Text>
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.row}>
      <View style={styles.cardContainer}>
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => handleNavigate(3, 'Cassava')}
        >
          <Image 
            source={require('../assets/images/cassava.png')} 
            style={styles.menuLogo} 
          />
          <Text>Cassava</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}>
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => handleNavigate(4, 'Yam')}
        >
          <Image 
            source={require('../assets/images/yam.png')} 
            style={styles.menuLogo} 
          />
          <Text>Yam</Text>
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