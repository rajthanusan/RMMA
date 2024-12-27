import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import HomeScreen from './HomeScreen';
import EventsScreen from './EventsScreen';
import BookTableScreen from './BookTableScreen';
import OperatorAccount from './RegisterAccountScreen';
import FeedbackScreen from './FeedbackScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function LogoutScreen() {
  const navigation = useNavigation();

  React.useEffect(() => {
    
    navigation.navigate('User');
  }, [navigation]);

  return null; 
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Events':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Reservation':
              iconName = focused ? 'restaurant' : 'restaurant-outline';
              break;
              case 'Operator':
                iconName = focused ? 'person' : 'person-outline';
                break;
           
            case 'Feedback':
              iconName = focused ? 'chatbubble' : 'chatbubble-outline';
              break;
            case 'Logout':
              iconName = focused ? 'log-out' : 'log-out-outline';
              break;
            default:
              iconName = 'help-circle-outline'; 
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FFB347',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Reservation" component={BookTableScreen} />
      <Tab.Screen name="Feedback" component={FeedbackScreen} />
      <Tab.Screen name="Operator" component={OperatorAccount} />
      <Tab.Screen 
        name="Logout" 
        component={LogoutScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('User');
          },
        })}
      />
    </Tab.Navigator>
  );
}

export default function ManagerPage() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}

