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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';  

import config from '../../config';

const CategoryItem = ({ icon, name, onPress, isSelected }) => (
  <TouchableOpacity
    style={[styles.categoryItem, isSelected && styles.selectedCategory]}
    onPress={onPress}
  >
    <View style={[styles.categoryIcon, isSelected && styles.selectedCategoryIcon]}>
      <Ionicons name={icon} size={24} color={isSelected ? '#FFFFFF' : '#FF4B3A'} />
    </View>
    <Text style={[styles.categoryName, isSelected && styles.selectedCategoryText]}>{name}</Text>
  </TouchableOpacity>
);

CategoryItem.propTypes = { 
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
};

const RestaurantCard = ({ image, name, rating, category }) => (
  <TouchableOpacity style={styles.restaurantCard}>
    <Image source={{ uri: image }} style={styles.restaurantImage} />
    <View style={styles.restaurantOverlay}>
      <Text style={styles.restaurantName}>{name}</Text>
      <View style={styles.restaurantMeta}>
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text style={styles.restaurantRating}>{Number(rating).toFixed(1)}</Text>
        <Text style={styles.restaurantCuisine}>{category}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

RestaurantCard.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  category: PropTypes.string.isRequired,
};

const HomeScreen = ({ route, navigation }) => {
  const username = route?.params?.username || 'User';
  const [foodItems, setFoodItems] = useState([]);
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { icon: 'grid-outline', name: 'All' },
    { icon: 'pizza-outline', name: 'Appetizers' },
    { icon: 'restaurant-outline', name: 'Main Courses' },
    { icon: 'ice-cream-outline', name: 'Desserts' }, 
    { icon: 'beer-outline', name: 'Drinks' },
    { icon: 'fast-food-outline', name: 'Snacks' },
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
          <Text style={styles.subGreeting}>Taste Perfection, Every Time</Text>
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
          placeholder="Find your favorite foods here"
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
};

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
    bottom: 10,
    left: 10,
    right: 10,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  restaurantRating: {
    marginLeft: 5,
    color: '#fff',
  },
  restaurantCuisine: {
    marginLeft: 10,
    color: '#fff',
  },
  noFoodMessage: {
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
    marginTop: 30,
  },
});

export default HomeScreen;

