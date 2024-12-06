import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';  

const events = [
  {
    id: '1',
    title: 'Wine Tasting Evening',
    date: 'June 15, 2023',
    image: require('../../assets/images/food1.jpeg'),
  },
  {
    id: '2',
    title: 'Chef\'s Special Dinner',
    date: 'July 1, 2023',
    image: require('../../assets/images/food1.jpeg'),
  },
  {
    id: '3',
    title: 'Live Jazz Night',
    date: 'July 10, 2023',
    image: require('../../assets/images/food1.jpeg'),
  },
];

const EventItem = ({ title, date, image }) => (
  <TouchableOpacity style={styles.eventItem}>
    <Image source={image} style={styles.eventImage} />
    <View style={styles.eventInfo}>
      <Text style={styles.eventTitle}>{title}</Text>
      <Text style={styles.eventDate}>{date}</Text>
    </View>
  </TouchableOpacity>
);


EventItem.propTypes = {
  title: PropTypes.string.isRequired,   
  date: PropTypes.string.isRequired,    
  image: PropTypes.any.isRequired,      
};

export default function EventsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Upcoming Events</Text>
      <FlatList
        data={events}
        renderItem={({ item }) => <EventItem {...item} />}
        keyExtractor={item => item.id}
      />
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  eventItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  eventInfo: {
    padding: 15,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
  },
});
