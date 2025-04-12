import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet, Text, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * ProfileIcon component for the application
 * 
 * @param {Object} props Component props
 * @param {Function} props.onPress Function to call when the icon is pressed
 * @param {Function} props.onProfile Function to call when profile is selected
 * @param {Function} props.onLogout Function to call when logout is selected
 * @returns {React.Component} The ProfileIcon component
 */
const ProfileIcon = ({ onPress, onProfile, onLogout }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleIconPress = () => {
    setMenuVisible(true);
    if (onPress) onPress();
  };

  const handleMenuClose = () => {
    setMenuVisible(false);
  };

  const handleProfilePress = () => {
    setMenuVisible(false);
    if (onProfile) onProfile();
  };

  const handleLogout = () => {
    setMenuVisible(false);
    if (onLogout) onLogout();
  };

  return (
    <View>
      <TouchableOpacity 
        onPress={handleIconPress} 
        style={styles.container} 
        activeOpacity={0.7}
        testID="profile-icon"
      >
        <View style={styles.iconContainer}>
          <Ionicons name="person" size={24} color="#F4F4F4" />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={handleMenuClose}
      >
        <Pressable style={styles.modalOverlay} onPress={handleMenuClose}>
          <View style={styles.menuContainer} testID="profile-dropdown-menu">
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleProfilePress}
              testID="profile-button"
            >
              <Ionicons name="person-outline" size={20} color="#2A2D34" />
              <Text style={styles.menuText}>Profile</Text>
            </TouchableOpacity>
            
            <View style={styles.menuDivider} />
            
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleLogout}
              testID="logout-button"
            >
              <Ionicons name="log-out-outline" size={20} color="#2A2D34" />
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    padding: 8,
    marginTop: 70,
    marginRight: 16,
    minWidth: 180,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 4,
  },
  menuText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#2A2D34',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E1E2E5',
    marginHorizontal: 4,
  },
});

export default ProfileIcon; 