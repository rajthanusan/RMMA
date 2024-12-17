import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, TouchableOpacity, FlatList, Alert, View, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import config from '../../config';
import { Ionicons} from '@expo/vector-icons';

export default function AdminFeedbackScreen() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

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



  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSend = async (feedback) => {
    if (!subject || !message) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    if (!validateEmail(feedback.email)) {
      Alert.alert('Error', 'Invalid email format.');
      return;
    }

    try {
      await axios.post(`${config.API_URL}/api/feedback/respond`, {
        email: feedback.email,
        subject,
        message,
      });
      Alert.alert('Success', 'Response sent successfully.');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Error sending response:', error);
      Alert.alert('Error', 'Unable to send response. Please try again later.');
    }
  };

  const renderFeedbackItem = ({ item }) => (
    <View style={styles.feedbackItem}>
      <Text style={styles.feedbackText}><Text style={styles.bold}>Name:</Text> {item.name}</Text>
      <Text style={styles.feedbackText}><Text style={styles.bold}>Email:</Text> {item.email}</Text>
      <Text style={styles.feedbackText}><Text style={styles.bold}>Feedback:</Text> {item.feedback}</Text>

      <TextInput
        style={styles.input}
        placeholder="Subject"
        value={subject}
        onChangeText={setSubject}
      />
      <TextInput
        style={[styles.input, styles.messageInput]}
        placeholder="Message"
        value={message}
        onChangeText={setMessage}
        multiline
      />

      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={() => handleSend(item)}>
          <Ionicons name="send" size={30} color="#4CAF50" />
        </TouchableOpacity>

      </View>
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
        showsVerticalScrollIndicator={false}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  feedbackText: {
    fontSize: 16,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#F1F1F1',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    fontSize: 16,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', 
    marginTop: 15,
  },
  iconButton: {
    backgroundColor: '#F1F1F1',
    padding: 10,
    borderRadius: 50,
    alignItems: 'left',
    justifyContent: 'left',
  },
});
