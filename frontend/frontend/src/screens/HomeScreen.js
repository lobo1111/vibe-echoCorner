import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import NotificationsList from '../components/NotificationsList';
import notificationService from '../services/NotificationService';

const HomeScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch notifications when component mounts
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const notificationsData = await notificationService.getNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError(error.message || 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationPress = async (notification) => {
    try {
      // Mark notification as read when clicked
      await notificationService.markAsRead(notification.id);
      
      // Show notification details
      Alert.alert(
        'Notification', 
        `You clicked on: ${notification.title}`,
        [{ text: 'OK' }]
      );
      
      // Refresh notifications to update read status
      fetchNotifications();
    } catch (error) {
      console.error('Error handling notification press:', error);
      Alert.alert('Error', 'Failed to process notification');
    }
  };

  const handleSeeAllPress = () => {
    Alert.alert('See All', 'View all notifications', [{ text: 'OK' }]);
  };

  const handleRefresh = () => {
    fetchNotifications();
  };

  const renderContent = () => {
    if (isLoading && notifications.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2A2D34" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      );
    }

    if (error && notifications.length === 0) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error}
          </Text>
          <Text 
            style={styles.retryText}
            onPress={handleRefresh}
          >
            Tap to retry
          </Text>
        </View>
      );
    }

    return (
      <>
        <NotificationsList 
          notifications={notifications}
          onNotificationPress={handleNotificationPress}
          onSeeAllPress={handleSeeAllPress}
          isLoading={isLoading}
          onRefresh={handleRefresh}
        />
        
        <View style={styles.contentSection}>
          <Text style={styles.contentTitle}>Recent Content</Text>
          <View style={styles.placeholderContent}>
            <Text style={styles.placeholderText}>Content coming soon...</Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={notifications.length === 0 ? styles.fullHeightContainer : null}
    >
      <View style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Welcome to echoCorner</Text>
          <Text style={styles.welcomeSubtitle}>Your Feed</Text>
        </View>
        
        {renderContent()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F4F4F4', // Secondary color from style guide
  },
  fullHeightContainer: {
    flexGrow: 1,
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
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#505565', // Text secondary color
  },
  errorContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#C53F3F', // Error color
    textAlign: 'center',
    marginBottom: 12,
  },
  retryText: {
    fontSize: 16,
    color: '#6DA9D2', // Blue accent color
    fontWeight: '600',
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