import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello World</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F4', // Secondary color from style guide
  },
  text: {
    fontSize: 22, // H2 from style guide
    fontWeight: '600', // Semi-Bold from style guide
    color: '#1A1A1A', // Text Primary from style guide
  },
});

export default HomeScreen; 