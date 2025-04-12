import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProfileIcon from './ProfileIcon';

/**
 * Header component for the application
 * 
 * @param {Object} props Component props
 * @param {Function} props.onProfilePress Function to call when the profile icon is pressed
 * @returns {React.Component} The Header component
 */
const Header = ({ onProfilePress }) => {
  return (
    <View style={styles.header} testID="header">
      <Text style={styles.title}>echoCorner</Text>
      <ProfileIcon onPress={onProfilePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 60,
    backgroundColor: '#2A2D34', // Primary color from style guide
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    position: 'relative',
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F4F4F4', // Secondary color from style guide
  },
});

export default Header; 