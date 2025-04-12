import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * ProfileIcon component for the application
 * 
 * @param {Object} props Component props
 * @param {Function} props.onPress Function to call when the icon is pressed
 * @returns {React.Component} The ProfileIcon component
 */
const ProfileIcon = ({ onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={styles.container} 
      activeOpacity={0.7}
      testID="profile-icon"
    >
      <View style={styles.iconContainer}>
        <Ionicons name="person" size={24} color="#F4F4F4" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  iconContainer: {
    backgroundColor: '#7D8491', // Accent color from style guide
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfileIcon; 