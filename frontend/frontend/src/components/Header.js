import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProfileIcon from './ProfileIcon';

/**
 * Header component for the application
 * 
 * @param {Object} props Component props
 * @param {Function} props.onProfilePress Function to call when the profile icon is pressed
 * @param {Function} props.onProfile Function to call when the profile option is selected
 * @param {Function} props.onLogout Function to call when the logout option is selected
 * @returns {React.Component} The Header component
 */
const Header = ({ onProfilePress, onProfile, onLogout }) => {
  return (
    <View style={styles.header} testID="header">
      <View style={styles.titleContainer}>
        <Text style={styles.title}>echoCorner</Text>
        <Text style={styles.welcomeText}>Welcome to echoCorner!</Text>
      </View>
      <ProfileIcon onPress={onProfilePress} onProfile={onProfile} onLogout={onLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 70,
    backgroundColor: '#2A2D34', // Primary color from style guide
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    position: 'relative',
    zIndex: 10,
  },
  titleContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F4F4F4', // Secondary color from style guide
  },
  welcomeText: {
    fontSize: 14,
    color: '#F4F4F4', // Secondary color from style guide
    marginTop: 2,
  },
});

export default Header; 