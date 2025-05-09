import React, { useState, useEffect } from 'react';
import 'regenerator-runtime/runtime';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Auth } from './src/config/auth';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import Header from './src/components/Header';

// Simple navigation state since we're having issues with React Navigation
const SCREENS = {
  HOME: 'HOME',
  LOGIN: 'LOGIN'
};

// Helper for safer localStorage access in different environments
const safeLocalStorage = {
  getItem: (key) => {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
      return null;
    } catch (error) {
      console.warn('localStorage access error:', error);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn('localStorage set error:', error);
    }
  },
  removeItem: (key) => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn('localStorage remove error:', error);
    }
  }
};

// Make localStorage available to our Auth module in all environments
if (!global.localStorage) {
  global.localStorage = safeLocalStorage;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(SCREENS.LOGIN);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on load
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        setIsLoading(true);
        await Auth.currentAuthenticatedUser();
        setIsAuthenticated(true);
        setCurrentScreen(SCREENS.HOME);
      } catch (err) {
        console.log('User not authenticated');
        setIsAuthenticated(false);
        setCurrentScreen(SCREENS.LOGIN);
      } finally {
        setIsLoading(false);
      }
    };

    // Run authentication check
    checkAuthState();
  }, []);

  // Handle navigation between screens
  const navigate = (screenName) => {
    setCurrentScreen(screenName);
  };
  
  // Handle profile icon press
  const handleProfilePress = () => {
    // This is just for the icon click, not menu selection
    // We no longer need to show an alert here as the menu will appear
  };
  
  // Handle profile option selection
  const handleProfile = () => {
    Alert.alert('Profile', 'Profile settings will be available in a future update!');
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await Auth.signOut();
      setIsAuthenticated(false);
      setCurrentScreen(SCREENS.LOGIN);
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Logout Error', 'Failed to log out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Wait until auth check is complete before rendering
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F4F4' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Render the appropriate screen
  return (
    <View style={styles.container}>
      {currentScreen === SCREENS.LOGIN ? (
        <LoginScreen 
          navigate={(screen) => {
            if (screen === 'Home') setCurrentScreen(SCREENS.HOME);
          }} 
        />
      ) : (
        <>
          <Header 
            onProfilePress={handleProfilePress} 
            onProfile={handleProfile}
            onLogout={handleLogout} 
          />
          <View style={styles.contentContainer}>
            <HomeScreen />
          </View>
        </>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  contentContainer: {
    flex: 1,
  },
});
