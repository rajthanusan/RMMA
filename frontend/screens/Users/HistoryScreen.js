import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';


import RestaurantImage from '../../assets/images/restaurant-image.jpg';
import ChefJohnImage from '../../assets/images/chef-1.jpg';
import ChefJaneImage from '../../assets/images/chef-2.jpg';
import ChefEmilyImage from '../../assets/images/chef-3.jpg';

const awards = [
  { id: '1', icon: 'award', title: 'Best Fine Dining Experience - 2020' },
  { id: '2', icon: 'star', title: 'Top 10 Restaurants in the Country - 2022' },
  { id: '3', icon: 'medal', title: 'Culinary Excellence Award - 2021' },
];

const teamMembers = [
  { id: '1', name: 'Chef John Doe', role: 'Head Chef', experience: '20 years', image: ChefJohnImage },
  { id: '2', name: 'Jane Smith', role: 'Sous Chef', experience: '15 years', image: ChefJaneImage },
  { id: '3', name: 'Emily Brown', role: 'Pastry Chef', experience: '10 years', image: ChefEmilyImage },
];

export default function RestaurantHistoryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>About Our Restaurant</Text>

        {/* Restaurant Image */}
        <Image source={RestaurantImage} style={styles.restaurantImage} />

        {/* Restaurant History */}
        <Text style={styles.sectionTitle}>Our Story</Text>
        <Text style={styles.paragraph}>
          Established in 1998, our restaurant has been a cornerstone of culinary excellence in the city. Known for our
          farm-to-table philosophy, we source the freshest ingredients to craft unforgettable dining experiences.
        </Text>

        {/* Awards Section */}
        <Text style={styles.sectionTitle}>Awards and Recognition</Text>
        <FlatList
          data={awards}
          keyExtractor={(item) => item.id}
          nestedScrollEnabled={true}
          renderItem={({ item }) => (
            <View style={styles.awardItem}>
              <FontAwesome5 name={item.icon} size={24} color="#FF4B3A" style={styles.awardIcon} />
              <Text style={styles.awardText}>{item.title}</Text>
            </View>
          )}
        />

        {/* Team Section */}
        <Text style={styles.sectionTitle}>Meet Our Team</Text>
        <FlatList
          data={teamMembers}
          keyExtractor={(item) => item.id}
          nestedScrollEnabled={true}
          renderItem={({ item }) => (
            <View style={styles.teamMember}>
              <Image source={item.image} style={styles.teamImage} />
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>{item.name}</Text>
                <Text style={styles.teamRole}>{item.role}</Text>
                <Text style={styles.teamExperience}>Experience: {item.experience}</Text>
              </View>
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  restaurantImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
   
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    textAlign: 'justify',
  },
  awardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  awardIcon: {
    marginRight: 10,
  },
  awardText: {
    fontSize: 16,
    color: '#333',
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  teamImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  teamRole: {
    fontSize: 14,
    color: '#555',
  },
  teamExperience: {
    fontSize: 14,
    color: '#777',
  },
});
