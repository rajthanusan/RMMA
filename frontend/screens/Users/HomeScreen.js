import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import config from '../../config';

const { width } = Dimensions.get('window');

const CategoryItem = ({ icon, name, onPress, isSelected }) => (
  <TouchableOpacity 
    style={[styles.categoryItem, isSelected && styles.selectedCategory]} 
    onPress={onPress}
  >
    <View style={[styles.categoryIcon, isSelected && styles.selectedCategoryIcon]}>
      <Ionicons name={icon} size={24} color={isSelected ? "#FFFFFF" : "#FF4B3A"} />
    </View>
    <Text style={[styles.categoryName, isSelected && styles.selectedCategoryText]}>{name}</Text>
  </TouchableOpacity>
);

const RestaurantCard = ({ image, name, rating, category }) => (
  <TouchableOpacity style={styles.restaurantCard}>
    <Image source={{ uri: image }} style={styles.restaurantImage} />
    <View style={styles.restaurantOverlay}>
      <Text style={styles.restaurantName}>{name}</Text>
      <View style={styles.restaurantMeta}>
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text style={styles.restaurantRating}>{rating}</Text>
        <Text style={styles.restaurantCuisine}>{category}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default function HomeScreen({ route, navigation }) {
  const username = route.params?.username || 'Food Lover';
  const [foodItems, setFoodItems] = useState([]);
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { icon: "restaurant", name: "All" },
    { icon: "pizza", name: "Appetizers" },  
    { icon: "restaurant", name: "Main Courses" },  
    { icon: "ice-cream", name: "Desserts" },  
    { icon: "beer", name: "Drinks" },  
    { icon: "fast-food", name: "Snacks" },  
  ];

  useEffect(() => {
    fetch(`${config.API_URL}/api/food-items`)
      .then((response) => response.json())
      .then((data) => {
        const activeItems = data.filter((item) => item.isActive === true);
        setFoodItems(activeItems);
        setFilteredFoodItems(activeItems);
      })
      .catch((error) => console.error('Error fetching food items:', error));
  }, []);

  useEffect(() => {
    const filtered = foodItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredFoodItems(filtered);
  }, [searchQuery, selectedCategory, foodItems]);

  const handleCategoryPress = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const renderCategoryItem = useCallback(({ item }) => (
    <CategoryItem
      icon={item.icon}
      name={item.name}
      onPress={() => handleCategoryPress(item.name)}
      isSelected={selectedCategory === item.name}
    />
  ), [selectedCategory, handleCategoryPress]);

  const renderRestaurantItem = useCallback(({ item }) => (
    <RestaurantCard
      image={item.image}
      name={item.name}
      rating={item.rating}
      category={item.category}
    />
  ), []);

  const ListHeaderComponent = useCallback(() => (
    <>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {username}!</Text>
          <Text style={styles.subGreeting}>Discover the best foods</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.profileButton}>
            <Icon name="person" size={24} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for restaurants or foods"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <Text style={styles.sectionTitle}>Categories</Text>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.name}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      />

      <Text style={styles.sectionTitle}>Popular Foods</Text>
    </>
  ), [username, navigation, searchQuery, categories, renderCategoryItem]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={filteredFoodItems}
        renderItem={renderRestaurantItem}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={ListHeaderComponent()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.restaurantsContainer}
        ListEmptyComponent={<Text style={styles.noFoodMessage}>Sorry, no foods available right now.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF4B3A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginTop: 30,
    marginBottom: 15,
    color: '#333',
  },
  categoriesContainer: {
    paddingHorizontal: 0,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedCategoryIcon: {
    backgroundColor: '#FF4B3A',
  },
  categoryName: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  selectedCategory: {
    backgroundColor: 'transparent',
  },
  selectedCategoryText: {
    color: '#FF4B3A',
    fontWeight: 'bold',
  },
  restaurantsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  restaurantCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantImage: {
    width: '100%',
    height: 200,
  },
  restaurantOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantRating: {
    marginLeft: 5,
    marginRight: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  restaurantCuisine: {
    color: '#eee',
  },
  noFoodMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

