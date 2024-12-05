import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserNavigation from './screens/Users/UserPage';
import AdminPage from './screens/Admin/AdminPage';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="User">
        {/* User Navigation */}
        <Stack.Screen
          name="User"
          component={UserNavigation}
          options={{ headerShown: false }}
        />

        {/* Admin Navigation */}
        <Stack.Screen
          name="AdminPage"
          component={AdminPage}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
