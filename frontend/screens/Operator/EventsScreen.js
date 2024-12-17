import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import config from '../../config';

const EventsScreen = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/api/events`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const toggleEventStatus = async (id, currentStatus) => {
    try {
      await axios.patch(`${config.API_URL}/api/events/${id}/toggle-status`);
      setEvents(events.map(event => 
        event._id === id ? { ...event, active: !currentStatus } : event
      ));
    } catch (error) {
      console.error('Error toggling event status:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const renderEventItem = ({ item }) => (
    <View style={styles.eventCard}>
      <Image source={{ uri: item.image }} style={styles.eventImage} />
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.eventname}</Text>
        <View style={styles.eventDetails}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.eventText}>{item.date}</Text>
        </View>
        <View style={styles.eventDetails}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.eventText}>{item.time}</Text>
        </View>
        <View style={styles.eventDetails}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.eventText}>{item.location}</Text>
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>{item.active ? 'Active' : 'Inactive'}</Text>
          <Switch
            value={item.active}
            onValueChange={() => toggleEventStatus(item._id, item.active)}
            thumbColor={item.active ? '#FF4B3A' : '#ccc'}
            trackColor={{ true: '#FFB3A7', false: '#e6e6e6' }}
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events</Text>
      </View>
      <FlatList
        data={events}
        keyExtractor={(item) => item._id}
        renderItem={renderEventItem}
        contentContainerStyle={styles.eventList}
        showsVerticalScrollIndicator={false} 
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  headerTitle: {
 
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 0,
      textAlign: 'center',
     
    
  },
  eventList: {
    padding: 10,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  eventInfo: {
    padding: 15,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  eventText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  switchLabel: {
    fontSize: 14,
    color: '#666',
  },
});

export default EventsScreen;

