import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import PropTypes from 'prop-types'; 
import config from '../../config';


const CategoryItem = ({ icon, name, onPress }) => (
  <TouchableOpacity style={styles.categoryItem} onPress={() => onPress(name)}>
    <View style={styles.categoryIcon}>
      <Ionicons name={icon} size={24} color="#FF4B3A" />
    </View>
    <Text style={styles.categoryName}>{name}</Text>
  </TouchableOpacity>
);

CategoryItem.propTypes = {
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};


const RestaurantCard = ({ image, name, rating, cuisine, onPress }) => (
  <TouchableOpacity style={styles.restaurantCard} onPress={onPress}>
    <Image source={image} style={styles.restaurantImage} />
    <View style={styles.restaurantInfo}>
      <Text style={styles.restaurantName}>{name}</Text>
      <View style={styles.restaurantMeta}>
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text style={styles.restaurantRating}>{rating}</Text>
        <Text style={styles.restaurantCuisine}>{cuisine}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

RestaurantCard.propTypes = {
  image: PropTypes.node.isRequired, 
  name: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired,
  cuisine: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};


export default function HomeScreen({ navigation }) {
  const [foodItems, setFoodItems] = useState([]);
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const [newFoodItem, setNewFoodItem] = useState({
    image: '',
    name: '',
    rating: '',
    category: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryOptions] = useState(['Appetizers', 'Main Courses', 'Desserts', 'Drinks', 'Snacks']);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);


  useEffect(() => {
    const loadFoodItems = async () => {
      const data = await fetchFoodItems();
      setFoodItems(data);
      setFilteredFoodItems(data);
    };
    loadFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/api/food-items`);
      return response.data;
    } catch (error) {
      console.error('Error fetching food items:', error.response?.data || error.message);
      return [];
    }
  };

  const handleAddFoodItem = async () => {
    if (!newFoodItem.image || !newFoodItem.name || !newFoodItem.rating || !newFoodItem.category) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const formData = new FormData();
    formData.append('image', {
      uri: newFoodItem.image,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });
    formData.append('name', newFoodItem.name);
    formData.append('rating', newFoodItem.rating);
    formData.append('category', newFoodItem.category);

    try {
      const response = await axios.post(`${config.API_URL}/api/food-items`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Food item added:', response.data);
      const updatedItems = await fetchFoodItems();
      setFoodItems(updatedItems);
      setFilteredFoodItems(updatedItems);
      setNewFoodItem({ image: '', name: '', rating: '', category: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding food item:', error.response?.data || error.message);
    }
  };

  const handleEditFoodItem = async () => {
    if (!editingItem || !editingItem.name || !editingItem.rating || !editingItem.category) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const formData = new FormData();
    if (editingItem.image && editingItem.image !== editingItem.originalImage) {
      formData.append('image', {
        uri: editingItem.image,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });
    }
    formData.append('name', editingItem.name);
    formData.append('rating', editingItem.rating);
    formData.append('category', editingItem.category);

    try {
      const response = await axios.put(`${config.API_URL}/api/food-items/${editingItem._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Food item updated:', response.data);
      const updatedItems = await fetchFoodItems();
      setFoodItems(updatedItems);
      setFilteredFoodItems(updatedItems);
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating food item:', error.response?.data || error.message);
    }
  };

  const handleDeleteFoodItem = async (id) => {
    try {
      await axios.delete(`${config.API_URL}/api/food-items/${id}`);
      const updatedItems = await fetchFoodItems();
      setFoodItems(updatedItems);
      setFilteredFoodItems(updatedItems);
    } catch (error) {
      console.error('Error deleting food item:', error.response?.data || error.message);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'We need access to your media library to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      if (editingItem) {
        setEditingItem({ ...editingItem, image: result.assets[0].uri });
      } else {
        setNewFoodItem({ ...newFoodItem, image: result.assets[0].uri });
      }
    }
  };

  const handleCategorySelect = (category) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, category });
    } else {
      setNewFoodItem({ ...newFoodItem, category });
    }
    setModalVisible(false);
  };

  const handleCategoryFilter = (category) => {
    if (category === 'All') {
      setFilteredFoodItems(foodItems);
    } else {
      const filteredItems = foodItems.filter((item) => item.category === category);
      setFilteredFoodItems(filteredItems);
    }
  };

  const renderFoodForm = () => (
    <View style={styles.addFoodContainer}>
      <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
        <Text style={styles.imagePickerText}>Pick an Image</Text>
      </TouchableOpacity>
      {(editingItem ? editingItem.image : newFoodItem.image) ? (
        <Image source={{ uri: editingItem ? editingItem.image : newFoodItem.image }} style={styles.imagePreview} />
      ) : null}
      <TextInput
        style={styles.input}
        placeholder="Food Name"
        value={editingItem ? editingItem.name : newFoodItem.name}
        onChangeText={(text) => editingItem ? setEditingItem({ ...editingItem, name: text }) : setNewFoodItem({ ...newFoodItem, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Rating (e.g., 4.5)"
        value={editingItem ? editingItem.rating : newFoodItem.rating}
        onChangeText={(text) => editingItem ? setEditingItem({ ...editingItem, rating: text }) : setNewFoodItem({ ...newFoodItem, rating: text })}
      />
      <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
        <Text style={styles.dropdownText}>{editingItem ? editingItem.category : newFoodItem.category || 'Select Category'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={editingItem ? handleEditFoodItem : handleAddFoodItem}>
        <Text style={styles.addButtonText}>{editingItem ? 'Update Food Item' : 'Add Food Item'}</Text>
      </TouchableOpacity>
      {editingItem && (
        <TouchableOpacity style={[styles.addButton, { backgroundColor: '#999' }]} onPress={() => setEditingItem(null)}>
          <Text style={styles.addButtonText}>Cancel Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Manager!</Text>
            <Text style={styles.subGreeting}>Manage your food items</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Icon name="person" size={40} color="#FF4B3A" />
          </TouchableOpacity>
        </View>

        {/* Add Food Button */}
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddForm(!showAddForm)}>
          <Text style={styles.addButtonText}>{showAddForm ? 'Hide Add Form' : 'Add New Food Item'}</Text>
        </TouchableOpacity>

        {/* Add/Edit Food Form */}
        {(showAddForm || editingItem) && renderFoodForm()}

        {/* Categories Section */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          <CategoryItem icon="list" name="All" onPress={handleCategoryFilter} />
          <CategoryItem icon="restaurant" name="Appetizers" onPress={handleCategoryFilter} />
          <CategoryItem icon="pizza" name="Main Courses" onPress={handleCategoryFilter} />
          <CategoryItem icon="ice-cream" name="Desserts" onPress={handleCategoryFilter} />
          <CategoryItem icon="beer" name="Drinks" onPress={handleCategoryFilter} />
          <CategoryItem icon="fast-food" name="Snacks" onPress={handleCategoryFilter} />
        </ScrollView>

        {/* Food Items Section */}
        <View style={styles.foodItemsContainer}>
          {filteredFoodItems.map((item) => (
            <View key={item._id} style={styles.foodItemCard}>
              <Image
                source={{ uri: item.image }}
                style={styles.foodImage}
                onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
              />
              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.foodCategory}>{item.category}</Text>
              <Text style={styles.foodRating}>Rating: {item.rating}</Text>
              <View style={styles.foodItemActions}>
  <TouchableOpacity onPress={() => setEditingItem(item)}>
    <Ionicons name="create-outline" size={24} color="#FF4B3A" />
  </TouchableOpacity>
  <TouchableOpacity onPress={() => handleDeleteFoodItem(item._id)}>
    <Ionicons name="trash-outline" size={24} color="#FF4B3A" />
  </TouchableOpacity>


                
              </View>
            </View>
          ))}
        </View>

        {/* Modal for category selection */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <FlatList
                data={categoryOptions}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleCategorySelect(item)}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

HomeScreen.propTypes = {
  route: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subGreeting: {
    fontSize: 14,
    color: '#777',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 20,
  },
  searchText: {
    fontSize: 14,
    marginLeft: 10,
    color: '#999',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
    marginLeft: 20,
    color: '#333',
  },
  addFoodContainer: {
    paddingHorizontal: 20,
  },
  imagePickerButton: {
    backgroundColor: '#FF4B3A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    margin: 10,
  },
  imagePickerText: {
    color: '#FFF',
    fontSize: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  input: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  dropdown: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  dropdownText: {
    color: '#777',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  modalCloseButton: {
    marginTop: 15,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#FFF',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#FF4B3A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 15,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 12,
  },
  foodItemsContainer: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  foodItemCard: {
    backgroundColor: '#FFF',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 3,
  },
  foodImage: {
     width: '100%',
    height: 150,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  foodCategory: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  foodRating: {
    fontSize: 14,
    color: '#777',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  foodItemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
});

