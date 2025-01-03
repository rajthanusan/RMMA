import React, { useState } from 'react';
import { Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import config from '../../config';

export default function BookTableScreen() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [person, setPerson] = useState(''); 
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [message, setMessage] = useState(''); 
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  
  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  const validatePhone = (phone) => {
    const phonePattern = /^[0-9]{10}$/;  
    return phonePattern.test(phone);
  };

  const handleReservation = () => {
    
    if (email && phone && person && date && time) {
      
      if (!validateEmail(email)) {
        Alert.alert('Error', 'Please enter a valid email address.', [{ text: 'OK' }]);
        return;
      }

      
      if (!validatePhone(phone)) {
        Alert.alert('Error', 'Please enter a valid 10-digit phone number.', [{ text: 'OK' }]);
        return;
      }

      const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

      const hours = time.getHours();
      const minutes = time.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedTime = `${(hours % 12 || 12).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;

      const reservationData = {
        name: email, 
        phone,
        person, 
        reservationDate: formattedDate,
        time: formattedTime,
        message, 
        email,
      };

      fetch(`${config.API_URL}/api/book-table`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); 
        Alert.alert(
          'Reservation Request Sent',
          `Thank you, ${email}! Your reservation request for ${person} guests on ${formattedDate} at ${formattedTime} has been sent. You will receive a confirmation message shortly.`,
          [{ text: 'OK' }]
        );
        
        
        setEmail('');
        setPhone('');
        setPerson('');
        setDate(new Date());
        setTime(new Date());
        setMessage(''); 
      })
      .catch((error) => {
        console.error('Error:', error);
        Alert.alert('Error', 'There was an issue with your reservation. Please try again.', [{ text: 'OK' }]);
      });
    } else {
      Alert.alert('Error', 'Please fill in all fields', [{ text: 'OK' }]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Book a Table</Text>
        <TextInput
          style={styles.input}
          placeholder="Your Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Number of Guests"
          value={person} 
          onChangeText={setPerson}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Message (Optional)"
          value={message} 
          onChangeText={setMessage}
        />
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {date.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.timeButtonText}>
            {`${(time.getHours() % 12 || 12).toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')} ${time.getHours() >= 12 ? 'PM' : 'AM'}`}
          </Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="spinner"
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (selectedTime) setTime(selectedTime);
            }}
          />
        )}

        <TouchableOpacity
          style={styles.reserveButton}
          onPress={handleReservation}
        >
          <Text style={styles.reserveButtonText}>Reserve Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  dateButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  timeButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  timeButtonText: {
    fontSize: 16,
    color: '#333',
  },
  reserveButton: {
    backgroundColor: '#FFB347',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  reserveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
