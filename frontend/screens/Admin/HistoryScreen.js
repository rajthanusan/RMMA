import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';  // Import PropTypes

const history = [
  { id: '1', date: '2023-05-15', action: 'Reservation', details: 'Table for 4 at 7:00 PM' },
  { id: '2', date: '2023-05-10', action: 'Order', details: 'Takeout order #1234' },
  { id: '3', date: '2023-05-05', action: 'Event', details: 'Attended Wine Tasting Evening' },
];

const HistoryItem = ({ date, action, details }) => (
  <View style={styles.historyItem}>
    <Text style={styles.historyDate}>{date}</Text>
    <Text style={styles.historyAction}>{action}</Text>
    <Text style={styles.historyDetails}>{details}</Text>
  </View>
);

// Prop validation for HistoryItem
HistoryItem.propTypes = {
  date: PropTypes.string.isRequired,     // date should be a required string
  action: PropTypes.string.isRequired,   // action should be a required string
  details: PropTypes.string.isRequired,  // details should be a required string
};

export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your History</Text>
      <FlatList
        data={history}
        renderItem={({ item }) => <HistoryItem {...item} />}
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
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  historyAction: {
    fontSize: 14,
    color: '#FF4B3A',
    marginBottom: 5,
  },
  historyDetails: {
    fontSize: 14,
    color: '#666',
  },
});
