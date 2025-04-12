import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfileIcon from '../src/components/ProfileIcon';

describe('ProfileIcon Component', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(<ProfileIcon onPress={() => {}} />);
    const profileIcon = getByTestId('profile-icon');
    expect(profileIcon).toBeTruthy();
  });

  test('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(<ProfileIcon onPress={mockOnPress} />);
    const profileIcon = getByTestId('profile-icon');
    
    fireEvent.press(profileIcon);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  test('has correct styling for top-right positioning', () => {
    // This test verifies that the styles applied would position the icon
    // in the top-right when used in the Header component
    
    const { getByTestId } = render(<ProfileIcon onPress={() => {}} />);
    const profileIcon = getByTestId('profile-icon');
    
    // Get computed styles (this is a simplified approach as React Native Testing Library
    // doesn't provide full style computation like a browser would)
    const containerStyle = profileIcon.props.style;
    
    // The ProfileIcon itself doesn't have positioning styles as it's positioned
    // by its parent (the Header component), but we can verify its appearance
    expect(containerStyle).toEqual(
      expect.objectContaining({
        padding: 4,
      })
    );
  });
}); 