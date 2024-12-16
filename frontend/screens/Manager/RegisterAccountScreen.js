import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, View, Alert, FlatList } from 'react-native';
import axios from 'axios';
import config from '../../config';

export default function RegisterAccountScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [operators, setOperators] = useState([]);
  const [isRegister, setIsRegister] = useState(false);

  
  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/api/users`);
        const operatorList = response.data.filter(user => user.role === 'operator');
        setOperators(operatorList);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch operators');
      }
    };

    fetchOperators();
  }, [isRegister]); 

  
  const handleRegister = async () => {
    if (!username.trim()) {
      setUsernameError('Username is required');
      return;
    } else {
      setUsernameError('');
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      return;
    } else {
      setEmailError('');
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      return;
    } else {
      setPasswordError('');
    }

    try {
      const response = await axios.post(`${config.API_URL}/api/register`, {
        username,
        email,
        password,
        role: 'operator',
      });
      Alert.alert('Success', response.data.message);

      
      setOperators(prevOperators => [
        ...prevOperators,
        { username, email, role: 'operator' } 
      ]);

      
      setUsername('');
      setEmail('');
      setPassword('');
      
      setIsRegister(true);  
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Registration failed');
    }
  };

  
  const handleDeleteUser = async (id) => {
    try {
      const response = await axios.delete(`${config.API_URL}/api/users/${id}`);
      Alert.alert('Success', response.data.message);

      
      setOperators(operators.filter(user => user._id !== id));
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to delete user');
    }
  };

  
  const renderOperator = ({ item }) => (
    <View style={styles.operatorContainer}>
      <Text style={styles.operatorText}>{item.username} ({item.email})</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteUser(item._id)}  
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Add Operator Account</Text>
      </View>

      {/* Registration Form */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>ADD OPERATOR</Text>
      </TouchableOpacity>

      {/* Operators List */}
      <View style={styles.operatorsSection}>
        <Text style={styles.operatorsHeader}>Current Operators</Text>
        <FlatList
  data={operators}
  renderItem={renderOperator}
  keyExtractor={item => item._id}  
/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  registerButton: {
    backgroundColor: '#FF4B3A',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 5,
  },
  operatorsSection: {
    marginTop: 40,
  },
  operatorsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  operatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  operatorText: {
    fontSize: 16,
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
