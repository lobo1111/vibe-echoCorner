import React from 'react';
import { render } from '@testing-library/react-native';
import Header from '../src/components/Header';

describe('Header Component', () => {
  test('renders with title and ProfileIcon', () => {
    const { getByText, getByTestId } = render(<Header onProfilePress={() => {}} />);
    
    // Check if the title is rendered
    const title = getByText('echoCorner');
    expect(title).toBeTruthy();
    
    // Check if the ProfileIcon is rendered
    const profileIcon = getByTestId('profile-icon');
    expect(profileIcon).toBeTruthy();
  });

  test('ProfileIcon is positioned in the top-right corner', () => {
    const { getByTestId } = render(<Header onProfilePress={() => {}} />);
    
    // Get the Header component (the container)
    const header = getByTestId('header');
    
    // Verify the header has the correct styles for positioning
    expect(header.props.style).toEqual(
      expect.objectContaining({
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 60,
        paddingHorizontal: 16,
      })
    );
    
    // With flexDirection: 'row' and justifyContent: 'space-between',
    // the title will be on the left and the ProfileIcon will be on the right
    // This is how React Native handles layout for top-right positioning
  });

  test('calls onProfilePress when ProfileIcon is pressed', () => {
    const mockOnProfilePress = jest.fn();
    const { getByTestId } = render(<Header onProfilePress={mockOnProfilePress} />);
    
    // Get the ProfileIcon
    const profileIcon = getByTestId('profile-icon');
    
    // Simulate a press
    profileIcon.props.onPress();
    
    // Verify the callback was called
    expect(mockOnProfilePress).toHaveBeenCalledTimes(1);
  });
}); 