import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import NotificationsList from '../components/NotificationsList';
import { mockNotifications } from '../data/mockNotifications';

const HomeScreen = () => {
  const [notifications] = useState(mockNotifications);

  const handleNotificationPress = (notification) => {
    Alert.alert(
      'Notification', 
      `You clicked on: ${notification.title}`,
      [{ text: 'OK' }]
    );
  };

  const handleSeeAllPress = () => {
    Alert.alert('See All', 'View all notifications', [{ text: 'OK' }]);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Welcome to echoCorner</Text>
          <Text style={styles.welcomeSubtitle}>Your Feed</Text>
        </View>
        
        <NotificationsList 
          notifications={notifications}
          onNotificationPress={handleNotificationPress}
          onSeeAllPress={handleSeeAllPress}
        />
        
        <View style={styles.contentSection}>
          <Text style={styles.contentTitle}>Recent Content</Text>
          <View style={styles.placeholderContent}>
            <Text style={styles.placeholderText}>Content coming soon...</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F4F4F4', // Secondary color from style guide
  },
  container: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 32,
  },
  welcomeContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 22, // H2 from style guide
    fontWeight: '600', // Semi-Bold from style guide
    color: '#2A2D34', // Primary color from style guide
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#505565', // Text secondary color
  },
  contentSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2A2D34', // Primary color from style guide
    marginBottom: 16,
  },
  placeholderContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E1E2E5',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 16,
    color: '#7D8491', // Accent color from style guide
    fontStyle: 'italic',
  },
});

export default HomeScreen; 