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

const CategoryItem = ({ icon, name, onPress, isSelected }) => (
  <TouchableOpacity style={[styles.categoryItem, isSelected && styles.selectedCategoryItem]} onPress={() => onPress(name)}>
    <View style={[styles.categoryIcon, isSelected && styles.selectedCategoryIcon]}>
      <Ionicons name={icon} size={24} color={isSelected ? "#FFFFFF" : "#FFB347"} />
    </View>
    <Text style={[styles.categoryName, isSelected && { color: '#FFB347' }]}>{name}</Text>
  </TouchableOpacity>
);

CategoryItem.propTypes = {
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
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
  image: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired,
  cuisine: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default function HomeScreen() {
  const [foodItems, setFoodItems] = useState([]);
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const [newFoodItem, setNewFoodItem] = useState({
    image: '',
    name: '',
    rating: '',
    category: '',
    price: '',
    description: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryOptions] = useState(['Appetizers', 'Main Courses', 'Desserts', 'Drinks', 'Snacks']);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  const handleFormSubmit = async () => {
    const currentItem = editingItem || newFoodItem;
    if (!currentItem.name || !currentItem.rating || !currentItem.category || !currentItem.price || !currentItem.description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const formData = new FormData();
    if (currentItem.image) {
      formData.append('image', {
        uri: currentItem.image,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });
    }
    formData.append('name', currentItem.name);
    formData.append('rating', currentItem.rating);
    formData.append('category', currentItem.category);
    formData.append('price', currentItem.price.toString()); 
    formData.append('description', currentItem.description);

    try {
      let response;
      if (editingItem) {
        response = await axios.put(`${config.API_URL}/api/food-items/${editingItem._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('Food item updated:', response.data);
      } else {
        response = await axios.post(`${config.API_URL}/api/food-items`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('Food item added:', response.data);
      }
      
      const updatedItems = await fetchFoodItems();
      setFoodItems(updatedItems);
      setFilteredFoodItems(updatedItems);
      setNewFoodItem({ image: '', name: '', rating: '', category: '', price: '', description: '' });
      setEditingItem(null);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error managing food item:', error.response?.data || error.message);
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
    setSelectedCategory(category);
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
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
        <Text style={styles.dropdownText}>{editingItem ? editingItem.category : newFoodItem.category || 'Select Category'}</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={editingItem ? editingItem.price.toString() : newFoodItem.price.toString()}
        onChangeText={(text) => {
          const numericPrice = text.replace(/[^0-9.]/g, '');
          if (editingItem) {
            setEditingItem({ ...editingItem, price: numericPrice });
          } else {
            setNewFoodItem({ ...newFoodItem, price: numericPrice });
          }
        }}
        keyboardType="numeric"
      />
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Description"
        value={editingItem ? editingItem.description : newFoodItem.description}
        onChangeText={(text) => editingItem ? setEditingItem({ ...editingItem, description: text }) : setNewFoodItem({ ...newFoodItem, description: text })}
        multiline
      />
      <TouchableOpacity style={styles.addButton} onPress={handleFormSubmit}>
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
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Manager!</Text>
            <Text style={styles.subGreeting}>Manage your food items</Text>
          </View>
          <TouchableOpacity>
            <Icon name="person" size={40} color="#FFB347" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddForm(!showAddForm)}>
          <Text style={styles.addButtonText}>{showAddForm ? 'Hide Add Form' : 'Add New Food Item'}</Text>
        </TouchableOpacity>

        {(showAddForm || editingItem) && renderFoodForm()}

        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          <CategoryItem icon="grid-outline" name="All" onPress={handleCategoryFilter} isSelected={selectedCategory === 'All'} />
          <CategoryItem icon="pizza-outline" name="Appetizers" onPress={handleCategoryFilter} isSelected={selectedCategory === 'Appetizers'} />
          <CategoryItem icon="restaurant-outline" name="Main Courses" onPress={handleCategoryFilter} isSelected={selectedCategory === 'Main Courses'} />
          <CategoryItem icon="ice-cream-outline" name="Desserts" onPress={handleCategoryFilter} isSelected={selectedCategory === 'Desserts'} />
          <CategoryItem icon="beer-outline" name="Drinks" onPress={handleCategoryFilter} isSelected={selectedCategory === 'Drinks'} />
          <CategoryItem icon="fast-food-outline" name="Snacks" onPress={handleCategoryFilter} isSelected={selectedCategory === 'Snacks'} />
        </ScrollView>

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
              <Text style={styles.foodPrice}>Price: ${item.price}</Text>
              <Text style={styles.foodDescription} numberOfLines={2}>{item.description}</Text>
              <View style={styles.foodItemActions}>
                <TouchableOpacity onPress={() => setEditingItem(item)}>
                  <Ionicons name="create-outline" size={24} color="#FFB347" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteFoodItem(item._id)}>
                  <Ionicons name="trash-outline" size={24} color="#FFB347" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

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
    backgroundColor: '#FFB347',
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
    color: '#FFB347',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#FFB347',
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
    opacity: 0.7,
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
  selectedCategoryItem: {
    opacity: 1,
  },
  selectedCategoryIcon: {
    backgroundColor: '#FFB347',
  },
  selectedCategoryName: {
    color: '#FFB347',
    fontWeight: 'bold',
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
  foodPrice: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  foodDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  foodItemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
});

