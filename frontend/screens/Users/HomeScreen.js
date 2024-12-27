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
      <Ionicons name={icon} size={24} color={isSelected ? '#FFFFFF' : '#000'} />
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

const RestaurantCard = ({ image, name, rating, category, price, description }) => (
  <TouchableOpacity style={styles.restaurantCard}>
    <Image source={{ uri: image }} style={styles.restaurantImage} />
    <View style={styles.restaurantContent}>
      <Text style={styles.restaurantName}>{name}</Text>
      <View style={styles.restaurantMeta}>
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text style={styles.restaurantRating}>{Number(rating).toFixed(1)}</Text>
        <Text style={styles.restaurantCuisine}>{category}</Text>
        <Text style={styles.restaurantPrice}>${Number(price).toFixed(2)}</Text>
      </View>
      <Text style={styles.restaurantDescription} numberOfLines={2}>{description}</Text>
    </View>
  </TouchableOpacity>
);

RestaurantCard.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  category: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string.isRequired,
};

const HomeScreen = ({ route, navigation }) => {
  const username = route?.params?.username || 'User';
  const [foodItems, setFoodItems] = useState([]);
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDataFetched, setIsDataFetched] = useState(false);

  const categories = [
    { icon: 'grid-outline', name: 'All' },
    { icon: 'pizza-outline', name: 'Appetizers' },
    { icon: 'restaurant-outline', name: 'Main Courses' },
    { icon: 'ice-cream-outline', name: 'Desserts' },
    { icon: 'beer-outline', name: 'Drinks' },
    { icon: 'fast-food-outline', name: 'Snacks' },
  ];

  const fetchFoodItems = useCallback(() => {
    fetch(`${config.API_URL}/api/food-items`)
      .then((response) => response.json())
      .then((data) => {
        const activeItems = data.filter((item) => item.isActive === true);
        setFoodItems(activeItems);
        setFilteredFoodItems(activeItems);
        if (activeItems.length > 0) {
          setIsDataFetched(true);
        }
      })
      .catch((error) => console.error('Error fetching food items:', error));
  }, []);

  useEffect(() => {
    fetchFoodItems();
    let interval;
    if (isDataFetched) {
      interval = setInterval(fetchFoodItems, 5000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isDataFetched, fetchFoodItems]);

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
      price={item.price}
      description={item.description}
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
        ListHeaderComponent={ListHeaderComponent}
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFB347',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
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
    fontSize: 22,
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
    marginHorizontal: 10,
  },
  categoryIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
  },
  selectedCategoryIcon: {
    backgroundColor: '#FFB347',
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  restaurantsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  restaurantCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  restaurantImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  restaurantContent: {
    padding: 15,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  restaurantRating: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
  },
  restaurantCuisine: {
    marginLeft: 10,
    color: '#666',
    fontSize: 14,
  },
  restaurantPrice: {
    color: '#FFB347',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
  restaurantDescription: {
    color: '#666',
    fontSize: 14,
    marginTop: 5,
  },
  noFoodMessage: {
    textAlign: 'center',
    color: '#777',
    fontSize: 18,
    marginTop: 30,
    fontStyle: 'italic',
  },
});

export default HomeScreen;

