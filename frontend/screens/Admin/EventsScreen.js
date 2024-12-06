import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, Button, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';  

const initialEvents = [
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
  const [events, setEvents] = useState(initialEvents);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState(null);

  const handleAddEvent = () => {
    if (!title || !date || !image) {
      Alert.alert('Please fill in all fields');
      return;
    }

    const newEvent = {
      id: (events.length + 1).toString(),
      title,
      date,
      image,
    };

    setEvents([...events, newEvent]);
    setTitle('');
    setDate('');
    setImage(null);  
    Alert.alert('Event added successfully');
  };

  const handleImagePick = () => {
    
    setImage(require('../../assets/images/food1.jpeg'));  
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Upcoming Events</Text>
      
      {/* Admin Add Event Form */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Event Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Event Date"
          value={date}
          onChangeText={setDate}
        />
        <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePick}>
          <Text style={styles.imagePickerText}>Pick an Image</Text>
        </TouchableOpacity>
        {image && <Image source={image} style={styles.selectedImage} />}
        <Button title="Add Event" onPress={handleAddEvent} />
      </View>

      {/* Events List */}
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
  formContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
  imagePickerButton: {
    backgroundColor: '#FF4B3A',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  imagePickerText: {
    color: '#fff',
    textAlign: 'center',
  },
  selectedImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginBottom: 10,
  },
});
