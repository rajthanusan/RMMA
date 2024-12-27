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
  const [isDataFetched, setIsDataFetched] = useState(false);


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${config.API_URL}/api/events`);
        const data = await response.json();

        
        const activeEvents = data.filter(event => event.active);

        setEvents(activeEvents);

        
        if (activeEvents.length > 0) {
          setIsDataFetched(true);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    
    fetchEvents();

    
    let interval;
    if (isDataFetched) {
      interval = setInterval(fetchEvents, 5000);
    }

    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isDataFetched]);


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Upcoming Events</Text>
      {events.length === 0 ? (
        <Text style={styles.noEventsMessage}>No events found at this time. Stay tuned!</Text>
      ) : (
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
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false} 
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 20,
    paddingBottom: -30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  listContent: {
    paddingBottom: 20,
  },
  noEventsMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  eventItem: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  eventImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  eventInfo: {
    padding: 15,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  eventDate: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  eventLocation: {
    fontSize: 15,
    color: '#777',
    fontStyle: 'italic',
  },
});
