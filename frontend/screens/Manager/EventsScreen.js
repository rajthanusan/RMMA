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
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import config from '../../config';
import DateTimePicker from '@react-native-community/datetimepicker';

const EventsScreen = () => {
  const [events, setEvents] = useState([]);
  const [eventname, setEventname] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  useEffect(() => {
    fetchEvents();
    fetchRooms();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/api/events`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      Alert.alert('Error', 'Failed to fetch events. Please try again.');
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/api/rooms`);
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      Alert.alert('Error', 'Failed to load rooms!');
    }
  };

  const handleAddEvent = async () => {
    if (!eventname || !date || !time || !location || !selectedImage) {
      Alert.alert('Error', 'All fields and an image are required');
      return;
    }

    const formData = new FormData();
    formData.append('eventname', eventname);
    formData.append('date', date.toISOString().split('T')[0]);
    formData.append('time', time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
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
    
    const [year, month, day] = event.date.split('-');
    const eventDate = new Date(year, month - 1, day);
    setDate(eventDate);
    
    const [hours, minutes] = event.time.split(':');
    const [hourValue, period] = hours.split(' ');
    let hour = parseInt(hourValue, 10);
    if (period && period.toLowerCase() === 'pm' && hour !== 12) {
      hour += 12;
    } else if (period && period.toLowerCase() === 'am' && hour === 12) {
      hour = 0;
    }
    const eventTime = new Date();
    eventTime.setHours(hour, parseInt(minutes, 10), 0);
    setTime(eventTime);
    
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
    setDate(new Date());
    setTime(new Date());
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

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentTime);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const showTimepicker = () => {
    setShowTimePicker(true);
  };

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
            <Ionicons name="create-outline" size={24} color="#FFB347" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteEvent(item._id)}>
            <Ionicons name="trash-outline" size={24} color="#FFB347" />
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
          <TouchableOpacity onPress={showDatepicker} style={styles.input}>
            <Text>{date.toISOString().split('T')[0]}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              testID="datePicker"
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onDateChange}
            />
          )}
          <TouchableOpacity onPress={showTimepicker} style={styles.input}>
            <Text>{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              testID="timePicker"
              value={time}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={onTimeChange}
            />
          )}
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowLocationPicker(true)}
          >
            <Text>{location || 'Select Location'}</Text>
          </TouchableOpacity>
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <FlatList
          data={events}
          keyExtractor={(item) => item._id}
          renderItem={renderEventItem}
          ListHeaderComponent={renderHeader()}
          contentContainerStyle={styles.eventList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      </KeyboardAvoidingView>
      <Modal
        visible={showLocationPicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Location</Text>
            <FlatList
              data={rooms}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.locationItem}
                  onPress={() => {
                    setLocation(item.name);
                    setShowLocationPicker(false);
                  }}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowLocationPicker(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#FFB347',
  },
  headerTitle: {
    fontSize: 28,
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
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFB347',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  imageButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 15,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#FFB347',
    padding: 15,
    borderRadius: 8,
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
    borderRadius: 15,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  eventImage: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  eventInfo: {
    flex: 1,
    padding: 15,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  eventDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  eventActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  locationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    backgroundColor: '#FFB347',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EventsScreen;

