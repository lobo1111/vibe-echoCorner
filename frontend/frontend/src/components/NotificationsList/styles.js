import { StyleSheet } from 'react-native';

export const notificationListStyles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2A2D34', // Primary color from style guide
  },
  seeAllText: {
    fontSize: 14,
    color: '#7D8491', // Accent color from style guide
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#7D8491', // Accent color from style guide
    textAlign: 'center',
  },
  listContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export const notificationItemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E2E5',
    backgroundColor: '#FFFFFF',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6DA9D2', // Blue accent color
    marginRight: 8,
    alignSelf: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2A2D34', // Primary color from style guide
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  author: {
    fontSize: 14,
    color: '#505565', // Text secondary color
  },
  timeAndStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
    color: '#7D8491', // Accent color from style guide
    marginRight: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  statText: {
    fontSize: 12,
    color: '#7D8491', // Accent color from style guide
    marginLeft: 2,
  },
}); 