import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CategoryItem = ({ icon, name }) => (
  <TouchableOpacity style={styles.categoryItem}>
    <View style={styles.categoryIcon}>
      <Ionicons name={icon} size={24} color="#FF4B3A" />
    </View>
    <Text style={styles.categoryName}>{name}</Text>
  </TouchableOpacity>
);

const RestaurantCard = ({ image, name, rating, category }) => (
  <TouchableOpacity style={styles.restaurantCard}>
    <Image source={{ uri: image }} style={styles.restaurantImage} />
    <View style={styles.restaurantInfo}>
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
  const username = route.params?.username || 'User';
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    fetch('http://192.168.8.119:5000/api/food-items')
      .then((response) => response.json())
      .then((data) => setFoodItems(data))
      .catch((error) => console.error('Error fetching food items:', error));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {username}!</Text>
            <Text style={styles.subGreeting}>What would you like to eat?</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Icon name="person" size={40} color="#FF4B3A" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <Text style={styles.searchText}>Search for restaurants or foods</Text>
        </View>

        {/* Categories Section */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          <CategoryItem icon="list" name="All" />
          <CategoryItem icon="restaurant" name="Appetizers" />
          <CategoryItem icon="pizza" name="Main Courses" />
          <CategoryItem icon="ice-cream" name="Desserts" />
          <CategoryItem icon="beer" name="Drinks" />
          <CategoryItem icon="fast-food" name="Snacks" />
        </ScrollView>

        {/* Popular Restaurants Section */}
        <Text style={styles.sectionTitle}>Popular Restaurants</Text>
        <View style={styles.restaurantsContainer}>
          {foodItems.map((item) => (
            <RestaurantCard
              key={item._id}
              image={item.image}
              name={item.name}
              rating={item.rating}
              category={item.category}
            />
          ))}
        </View>
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchText: {
    marginLeft: 10,
    color: '#999',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 15,
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
  restaurantsContainer: {
    paddingHorizontal: 20,
  },
  restaurantCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
  },
  restaurantImage: {
    width: '100%',
    height: 150,
  },
  restaurantInfo: {
    padding: 15,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantRating: {
    marginLeft: 5,
    marginRight: 10,
    fontWeight: 'bold',
  },
  restaurantCuisine: {
    color: '#666',
  },
});
