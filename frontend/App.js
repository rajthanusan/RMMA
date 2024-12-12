import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserNavigation from './screens/Users/UserPage';
import ManagerPage from './screens/Manager/ManagerPage';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="User">
      
        <Stack.Screen
          name="User"
          component={UserNavigation}
          options={{ headerShown: false }}
        />

      
        <Stack.Screen
          name="ManagerPage"
          component={ManagerPage}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
