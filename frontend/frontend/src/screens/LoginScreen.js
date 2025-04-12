import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Auth } from '../config/auth';

const LoginScreen = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Clear previous errors
    setError('');
    
    // Validate input
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    // Set loading state
    setLoading(true);

    try {
      // Attempt to sign in with our safe Auth wrapper
      await Auth.signIn(email, password);
      
      // If successful, navigate to home screen
      navigate('Home');
    } catch (err) {
      // Handle authentication errors
      console.error('Login error:', err);
      
      if (err.code === 'UserNotFoundException' || err.code === 'NotAuthorizedException') {
        setError('Invalid email or password');
      } else if (err.code === 'UserNotConfirmedException') {
        setError('Please confirm your account');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.loginContainer}>
        <Text style={styles.title}>echoCorner</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
        
        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            testID="email-input"
          />
        </View>
        
        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            testID="password-input"
          />
        </View>
        
        {/* Error Message */}
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}
        
        {/* Login Button */}
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin}
          disabled={loading}
          testID="login-button"
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.loginButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4', // Secondary color from style guide
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // From style guide
    padding: 24, // Page margins from style guide
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28, // H1 from style guide
    fontWeight: 'bold',
    color: '#2A2D34', // Primary color from style guide
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16, // Body Regular from style guide
    color: '#6B6B6B', // Text Secondary from style guide
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14, // Body Small from style guide
    color: '#1A1A1A', // Text Primary from style guide
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF', // Input field from style guide
    borderWidth: 1,
    borderColor: '#DADADA', // Input border from style guide
    borderRadius: 4, // Input radius from style guide
    padding: 12,
    fontSize: 16, // Body Regular from style guide
  },
  errorText: {
    fontSize: 14, // Body Small from style guide
    color: '#FF4C4C', // Error color from style guide
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: '#4CAF50', // Accent color from style guide
    borderRadius: 6, // Button radius from style guide
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16, // Body Regular from style guide
    fontWeight: '600',
  }
});

export default LoginScreen; 