import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import QRScanner from './src/components/QRScanner';
import History from './src/components/History';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Scanner') {
                iconName = 'qr-code-scanner';
              } else if (route.name === 'History') {
                iconName = 'history';
              }

              return <MaterialIcons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#2196F3',
            tabBarInactiveTintColor: 'gray',
            headerShown: true,
          })}
        >
          <Tab.Screen 
            name="Scanner" 
            component={QRScanner}
            options={{
              title: 'QR Scanner',
            }}
          />
          <Tab.Screen 
            name="History" 
            component={History}
            options={{
              title: 'Scan History',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
