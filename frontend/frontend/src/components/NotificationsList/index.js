import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import NotificationItem from './NotificationItem';
import { notificationListStyles as styles } from './styles';

/**
 * NotificationsList component displays a list of notifications
 * 
 * @param {Object} props
 * @param {Array} props.notifications - Array of notification objects
 * @param {Function} props.onNotificationPress - Function to call when a notification is pressed
 * @param {Function} props.onSeeAllPress - Function to call when "See All" is pressed
 * @returns {React.Component}
 */
const NotificationsList = ({ 
  notifications = [], 
  onNotificationPress, 
  onSeeAllPress 
}) => {
  // In a real app, this would come from API
  // For demo, we'll mark first two as unread
  const [unreadIds] = useState(notifications.length > 0 
    ? [notifications[0].id, notifications.length > 1 ? notifications[1].id : null].filter(Boolean)
    : []);
  
  const isUnread = (notificationId) => unreadIds.includes(notificationId);
  
  const renderItem = ({ item }) => (
    <NotificationItem 
      notification={item} 
      isUnread={isUnread(item.id)}
      onPress={() => onNotificationPress?.(item)}
    />
  );
  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        No notifications at this time
      </Text>
    </View>
  );
  
  return (
    <View style={styles.container} testID="notifications-list">
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Notifications</Text>
        {notifications.length > 0 && (
          <TouchableOpacity 
            onPress={onSeeAllPress}
            testID="see-all-button"
          >
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.listContainer}>
        {notifications.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            testID="notifications-flatlist"
          />
        )}
      </View>
    </View>
  );
};

export default NotificationsList; 