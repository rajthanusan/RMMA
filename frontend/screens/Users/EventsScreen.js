import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import config from '../../config'; 


const EventItem = ({ title, date, time, image, location }) => (
  <TouchableOpacity style={styles.eventItem}>
    <Image source={{ uri: image }} style={styles.eventImage} />
    <View style={styles.eventInfo}>
      <Text style={styles.eventTitle}>{title}</Text>
      <Text style={styles.eventDate}>{date} | {time}</Text>
      <Text style={styles.eventLocation}>{location}</Text>
    </View>
  </TouchableOpacity>
);

EventItem.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired, 
  location: PropTypes.string.isRequired,
};

export default function EventsScreen() {
  const [events, setEvents] = useState([]);

  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${config.API_URL}/api/events`);
        const data = await response.json();
        setEvents(data); 
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Upcoming Events</Text>
      <FlatList
        data={events}
        renderItem={({ item }) => (
          <EventItem
            title={item.eventname}
            date={item.date}
            time={item.time}
            image={item.image}
            location={item.location}
          />
        )}
        keyExtractor={item => item._id}
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  eventItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  eventImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  eventInfo: {
    padding: 15,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  eventLocation: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});
