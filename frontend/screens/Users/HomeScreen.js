import React from 'react';
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
import PropTypes from 'prop-types'; // Import PropTypes

// CategoryItem Component
const CategoryItem = ({ icon, name }) => (
  <TouchableOpacity style={styles.categoryItem}>
    <View style={styles.categoryIcon}>
      <Ionicons name={icon} size={24} color="#FF4B3A" />
    </View>
    <Text style={styles.categoryName}>{name}</Text>
  </TouchableOpacity>
);

// Add PropTypes for CategoryItem
CategoryItem.propTypes = {
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

// RestaurantCard Component
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

// Add PropTypes for RestaurantCard
RestaurantCard.propTypes = {
  image: PropTypes.node.isRequired, // Image is a React node (e.g., require image)
  name: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired,
  cuisine: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

// HomeScreen Component
export default function HomeScreen({ route, navigation }) {
  const username = route.params?.username || 'User';

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
          <RestaurantCard
            image={require('../../assets/images/food1.jpeg')}
            name="Burger Palace"
            rating="4.8"
            cuisine="American"
            onPress={() => navigation.navigate('Restaurant', { id: 1 })}
          />
          <RestaurantCard
            image={require('../../assets/images/food1.jpeg')}
            name="Sushi Haven"
            rating="4.6"
            cuisine="Japanese"
            onPress={() => navigation.navigate('Restaurant', { id: 2 })}
          />
          <RestaurantCard
            image={require('../../assets/images/food1.jpeg')}
            name="Pizza Paradise"
            rating="4.7"
            cuisine="Italian"
            onPress={() => navigation.navigate('Restaurant', { id: 3 })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Add PropTypes for HomeScreen
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
