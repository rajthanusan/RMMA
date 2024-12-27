import React, { useState } from "react";
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
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import config from "../../config";

const ProfileOption = ({ icon, title, onPress }) => (
  <TouchableOpacity style={styles.option} onPress={onPress}>
    <Ionicons name={icon} size={24} color="#FFB347" />
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
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleRegister = async () => {
    if (!username.trim()) {
      setUsernameError("Username is required");
      return;
    } else {
      setUsernameError("");
    }

    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email");
      return;
    } else {
      setEmailError("");
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      return;
    } else {
      setPasswordError("");
    }

    try {
      const response = await axios.post(`${config.API_URL}/auth/register`, {
        email,
        password,
        username,
        role: "user",
      });
      const { token, message } = response.data;
      Alert.alert("Success", message);
      setIsRegister(false);
      
      
      setIsLoggedIn(true);
      setUserRole("user");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  const handleLogin = async () => {
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    } else {
      setEmailError("");
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      return;
    } else {
      setPasswordError("");
    }

    try {
      const response = await axios.post(`${config.API_URL}/auth/login`, {
        email,
        password,
      });

      const { token, message, user } = response.data;

      Alert.alert("Success", message);
      setIsLoggedIn(true);
      setUserRole(user.role);
      setUsername(user.email.split("@")[0]); 
      
      

      if (user.role === "manager") {
        navigation.navigate("ManagerPage");
      } else if (user.role === "operator") {
        navigation.navigate("OperatorPage");
      } else {
        navigation.navigate("User");
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Login failed");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole("");
    setEmail("");
    setPassword("");
    setUsername("");
    
    
    navigation.navigate("User");
  };

  const handleInputChange = (field, value) => {
    if (field === "username") setUsername(value);
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);

    if (field === "username" && usernameError) setUsernameError("");
    if (field === "email" && emailError) setEmailError("");
    if (field === "password" && passwordError) setPasswordError("");
  };

  if (isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Image
              source={require("../../assets/images/food1.jpeg")}
              style={styles.profilePic}
            />
            <Text style={styles.name}>{username}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
          <View style={styles.optionsContainer}>
            <ProfileOption
              icon="person-outline"
              title="Edit Profile"
              onPress={() => {}}
            />
            <ProfileOption
              icon="location-outline"
              title="Saved Addresses"
              onPress={() => {}}
            />
            <ProfileOption
              icon="card-outline"
              title="Payment Methods"
              onPress={() => {}}
            />
            <ProfileOption
              icon="notifications-outline"
              title="Notifications"
              onPress={() => {}}
            />
            <ProfileOption
              icon="help-circle-outline"
              title="Help & Support"
              onPress={() => {}}
            />
            <ProfileOption
              icon="settings-outline"
              title="Settings"
              onPress={() => {}}
            />
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
          <Text style={styles.title}>{isRegister ? "Register" : "Login"}</Text>
        </View>

        <View style={styles.formContainer}>
          {isRegister && (
            <TextInput
              style={[styles.input, usernameError ? styles.inputError : null]}
              placeholder="Username"
              value={username}
              onChangeText={(value) => handleInputChange("username", value)}
            />
          )}
          {usernameError && (
            <Text style={styles.errorText}>{usernameError}</Text>
          )}

          <TextInput
            style={[styles.input, emailError ? styles.inputError : null]}
            placeholder="Email"
            value={email}
            onChangeText={(value) => handleInputChange("email", value)}
            keyboardType="email-address"
          />
          {emailError && <Text style={styles.errorText}>{emailError}</Text>}

          <TextInput
            style={[styles.input, passwordError ? styles.inputError : null]}
            placeholder="Password"
            value={password}
            onChangeText={(value) => handleInputChange("password", value)}
            secureTextEntry
          />
          {passwordError && (
            <Text style={styles.errorText}>{passwordError}</Text>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={isRegister ? handleRegister : handleLogin}
          >
            <Text style={styles.buttonText}>
              {isRegister ? "Register" : "Login"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
            <Text style={styles.toggleText}>
              {isRegister
                ? "Already have an account? Login"
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
ProfileScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFB347",
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "#777",
  },
  formContainer: {
    padding: 20,
    backgroundColor: "#fff",
    marginTop: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    height: 50,
    borderColor: "#E5E5E5",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#F7F7F7",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#FFB347",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  toggleText: {
    marginTop: 15,
    textAlign: "center",
    color: "#FFB347",
  },
  optionsContainer: {
    padding: 15,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionTitle: {
    marginLeft: 15,
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#FFB347",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
