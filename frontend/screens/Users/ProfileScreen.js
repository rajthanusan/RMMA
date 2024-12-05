import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';

const ProfileOption = ({ icon, title, onPress }) => (
  <TouchableOpacity style={styles.option} onPress={onPress}>
    <Ionicons name={icon} size={24} color="#FF4B3A" />
    <Text style={styles.optionTitle}>{title}</Text>
  </TouchableOpacity>
);

ProfileOption.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default function ProfileScreen({ navigation }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://192.168.8.119:5000/api/register', {
        username,
        email,
        password,
        role: 'user', // Explicitly set the role (optional; default is handled server-side)
      });
      Alert.alert('Success', response.data.message);
      setIsRegister(false); // Switch to login mode after registration
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Registration failed');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.8.119:5000/api/login', {
        email,
        password,
      });

      const { message, role } = response.data; // Removed 'token'

      Alert.alert('Success', message);
      setIsLoggedIn(true); // Set logged-in state

      if (role === 'admin') {
        navigation.navigate('AdminPage'); // Navigate to AdminPage
      } else {
        navigation.navigate('User'); // Navigate to User page
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Login failed');
    }
  };

  if (isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Image source={require('../../assets/images/food1.jpeg')} style={styles.profilePic} />
            <Text style={styles.name}>{username}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
          <View style={styles.optionsContainer}>
            <ProfileOption icon="person-outline" title="Edit Profile" onPress={() => {}} />
            <ProfileOption icon="location-outline" title="Saved Addresses" onPress={() => {}} />
            <ProfileOption icon="card-outline" title="Payment Methods" onPress={() => {}} />
            <ProfileOption icon="notifications-outline" title="Notifications" onPress={() => {}} />
            <ProfileOption icon="help-circle-outline" title="Help & Support" onPress={() => {}} />
            <ProfileOption icon="settings-outline" title="Settings" onPress={() => {}} />
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={() => setIsLoggedIn(false)}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{isRegister ? 'Register' : 'Login'}</Text>
        </View>

        <View style={styles.formContainer}>
          {isRegister && (
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={isRegister ? handleRegister : handleLogin}
          >
            <Text style={styles.buttonText}>
              {isRegister ? 'Register' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
            <Text style={styles.toggleText}>
              {isRegister
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

ProfileScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4B3A',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#777',
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    height: 50,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#F7F7F7',
  },
  button: {
    backgroundColor: '#FF4B3A',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#FF4B3A',
    fontSize: 16,
  },
  optionsContainer: {
    marginTop: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  optionTitle: {
    marginLeft: 15,
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#FF4B3A',
    borderRadius: 8,
    padding: 15,
    margin: 20,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

