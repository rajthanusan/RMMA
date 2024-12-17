import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, TouchableOpacity, ScrollView, Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import config from '../../config';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function AdminReservationScreen() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    axios.get(`${config.API_URL}/api/reserve`)
      .then((response) => {
        const sortedReservations = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setReservations(sortedReservations);
      })
      .catch((error) => {
        console.error("Error fetching reservations:", error);
      });
  }, []);

 

  const handleApprove = (id) => {
    axios.put(`${config.API_URL}/api/reserve/${id}/approve`)
      .then((response) => {
        const updatedReservation = response.data.updatedReservation;
        setReservations(reservations.map(reservation =>
          reservation._id === id ? { ...reservation, status: 'Approved' } : reservation
        ));
        Alert.alert("Reservation Approved", `The reservation has been approved. An email has been sent to ${updatedReservation.email}.`);
      })
      .catch((error) => {
        console.error("Error approving reservation:", error);
        Alert.alert("Error", "Failed to approve the reservation.");
      });
  };

  const handleReject = (id) => {
    axios.put(`${config.API_URL}/api/reserve/${id}/reject`)
      .then((response) => {
        const updatedReservation = response.data.updatedReservation;
        setReservations(reservations.map(reservation =>
          reservation._id === id ? { ...reservation, status: 'Rejected' } : reservation
        ));
        Alert.alert("Reservation Rejected", `The reservation has been rejected. An email has been sent to ${updatedReservation.email}.`);
      })
      .catch((error) => {
        console.error("Error rejecting reservation:", error);
        Alert.alert("Error", "Failed to reject the reservation.");
      });
  };

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}  
        showsHorizontalScrollIndicator={false} 
      >
        <Text style={styles.title}>Reservations</Text>

        {reservations.length === 0 ? (
          <Text style={styles.noDataText}>No reservations available.</Text>
        ) : (
          reservations.map((reservation) => (
            <View key={reservation._id} style={styles.reservationCard}>
              <Text style={styles.reservationTitle}>{reservation.email}</Text>
              <Text style={styles.reservationDetails}>Phone: {reservation.phone}</Text>
              <Text style={styles.reservationDetails}>Guests: {reservation.guests}</Text>
              <Text style={styles.reservationDetails}>Date: {reservation.date}</Text>
              <Text style={styles.reservationDetails}>Time: {reservation.time}</Text>
              <Text style={styles.reservationDetails}>Status: {reservation.status || 'Pending'}</Text>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleApprove(reservation._id)}
                >
                  <Icon name="check-circle" size={30} color="#4CAF50" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleReject(reservation._id)}
                >
                  <Icon name="cancel" size={30} color="#FF4B3A" />
                </TouchableOpacity>

               
               
              </View>
            </View>
          ))
        )}
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  noDataText: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  reservationCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  reservationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  reservationDetails: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  iconButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
});
