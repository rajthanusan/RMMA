import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, TouchableOpacity, FlatList, Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import config from '../../config';

export default function AdminFeedbackScreen() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/api/feedback`);
        setFeedbackList(response.data);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        Alert.alert('Error', 'Unable to fetch feedback. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${config.API_URL}/api/feedback/${id}`);
      setFeedbackList(feedbackList.filter((item) => item._id !== id));
      Alert.alert('Success', 'Feedback has been deleted successfully.');
    } catch (error) {
      console.error('Error deleting feedback:', error);
      Alert.alert('Error', 'Unable to delete feedback. Please try again later.');
    }
  };

  
  const renderFeedbackItem = ({ item }) => (
    <View style={styles.feedbackItem}>
      <Text style={styles.feedbackText}><Text style={styles.bold}>Name:</Text> {item.name}</Text>
      <Text style={styles.feedbackText}><Text style={styles.bold}>Email:</Text> {item.email}</Text>
      <Text style={styles.feedbackText}><Text style={styles.bold}>Feedback:</Text> {item.feedback}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item._id)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Feedback</Text>
      
      {loading ? (
        <Text>Loading feedback...</Text>
      ) : feedbackList.length === 0 ? (
        <Text>No feedback available.</Text>
      ) : (
        <FlatList
          data={feedbackList}
          keyExtractor={(item) => item._id}
          renderItem={renderFeedbackItem}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F7F7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  feedbackItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  feedbackText: {
    fontSize: 16,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF4B3A',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
