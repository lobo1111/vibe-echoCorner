import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { notificationItemStyles as styles } from './styles';

/**
 * Format a date string into a relative time (e.g., "2h ago")
 * @param {string} dateString - ISO date string
 * @returns {string} Relative time string
 */
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  
  // Convert to appropriate time unit
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  
  const diffYear = Math.floor(diffMonth / 12);
  return `${diffYear}y ago`;
};

/**
 * NotificationItem component displays a single notification
 * 
 * @param {Object} props
 * @param {Object} props.notification - Notification data
 * @param {string} props.notification.id - Notification ID
 * @param {string} props.notification.title - Notification title
 * @param {string} props.notification.author - Author of the content
 * @param {string} props.notification.createdAt - Creation date in ISO format
 * @param {number} props.notification.likes - Number of likes
 * @param {number} props.notification.comments - Number of comments
 * @param {boolean} props.isUnread - Whether the notification is unread
 * @param {Function} props.onPress - Function to call when pressed
 * @returns {React.Component}
 */
const NotificationItem = ({ notification, isUnread, onPress }) => {
  const { title, author, createdAt, likes, comments } = notification;
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      testID="notification-item"
    >
      {isUnread && <View style={styles.unreadIndicator} />}
      
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        
        <Text style={styles.author} numberOfLines={1}>
          {author}
        </Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.timeAndStats}>
            <Text style={styles.time}>
              {formatRelativeTime(createdAt)}
            </Text>
            
            <View style={styles.statsContainer}>
              {likes > 0 && (
                <View style={styles.statItem}>
                  <Ionicons name="heart-outline" size={14} color="#7D8491" />
                  <Text style={styles.statText}>{likes}</Text>
                </View>
              )}
              
              {comments > 0 && (
                <View style={styles.statItem}>
                  <Ionicons name="chatbubble-outline" size={14} color="#7D8491" />
                  <Text style={styles.statText}>{comments}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationItem; 