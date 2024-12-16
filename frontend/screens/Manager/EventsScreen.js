import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import config from '../../config';

const EventsScreen = () => {
  const [events, setEvents] = useState([]);
  const [eventname, setEventname] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/api/events`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      Alert.alert('Error', 'Failed to fetch events. Please try again.');
    }
  };

  const handleAddEvent = async () => {
    if (!eventname || !date || !time || !location || !selectedImage) {
      Alert.alert('Error', 'All fields and an image are required');
      return;
    }

    const formData = new FormData();
    formData.append('eventname', eventname);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('location', location);
    formData.append('image', {
      uri: selectedImage.uri,
      name: selectedImage.uri.split('/').pop(),
      type: 'image/jpeg',
    });

    try {
      if (editingEvent) {
        await axios.put(`${config.API_URL}/api/events/${editingEvent._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        Alert.alert('Success', 'Event updated successfully');
      } else {
        await axios.post(`${config.API_URL}/api/events`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        Alert.alert('Success', 'Event added successfully');
      }
      fetchEvents();
      clearForm();
      setIsAddingEvent(false);
      setEditingEvent(null);
    } catch (error) {
      console.error('Error adding/updating event:', error);
      Alert.alert('Error', 'Could not add/update the event. Please try again.');
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventname(event.eventname);
    setDate(event.date);
    setTime(event.time);
    setLocation(event.location);
    setSelectedImage({ uri: event.image });
    setIsAddingEvent(true);
  };

  const handleDeleteEvent = async (id) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${config.API_URL}/api/events/${id}`);
              Alert.alert('Success', 'Event deleted successfully');
              fetchEvents();
            } catch (error) {
              console.error('Error deleting event:', error);
              Alert.alert('Error', 'Could not delete the event. Please try again.');
            }
          },
        },
      ]
    );
  };

  const clearForm = () => {
    setEventname('');
    setDate('');
    setTime('');
    setLocation('');
    setSelectedImage(null);
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Error', 'Permission to access media library is required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
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
        <View style={styles.eventActions}>
          <TouchableOpacity onPress={() => handleEditEvent(item)}>
            <Ionicons name="create-outline" size={24} color="#FF4B3A" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteEvent(item._id)}>
            <Ionicons name="trash-outline" size={24} color="#FF4B3A" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setIsAddingEvent(!isAddingEvent);
            if (isAddingEvent) {
              clearForm();
              setEditingEvent(null);
            }
          }}
        >
          <Ionicons name={isAddingEvent ? "close" : "add"} size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {isAddingEvent && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>{editingEvent ? 'Edit Event' : 'Add New Event'}</Text>
          <TextInput
            placeholder="Event Name"
            value={eventname}
            onChangeText={setEventname}
            style={styles.input}
          />
          <TextInput
            placeholder="Date (e.g., YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
            style={styles.input}
          />
          <TextInput
            placeholder="Time (e.g., 10:00 AM)"
            value={time}
            onChangeText={setTime}
            style={styles.input}
          />
          <TextInput
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
            style={styles.input}
          />
          <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
            <Ionicons name="image-outline" size={24} color="#fff" />
            <Text style={styles.imageButtonText}>Pick an Image</Text>
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
          )}
          <TouchableOpacity style={styles.submitButton} onPress={handleAddEvent}>
            <Text style={styles.submitButtonText}>
              {editingEvent ? 'Update Event' : 'Add Event'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <FlatList
            data={events}
            keyExtractor={(item) => item._id}
            renderItem={renderEventItem}
            ListHeaderComponent={renderHeader()}
            contentContainerStyle={styles.eventList}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FF4B3A',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    padding: 8,
  },
  formContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4B3A',
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
  },
  imageButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 15,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#FF4B3A',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventList: {
    paddingBottom: 20,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventImage: {
    width: 120,
    height: 120,
  },
  eventInfo: {
    flex: 1,
    padding: 15,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  eventDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  eventText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  eventActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
});

export default EventsScreen;
