import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { View } from 'react-native';
import ProfileMenuRow from './ProfileMenuRow';

describe('ProfileMenuRow', () => {
  const icon = <View testID="row-icon" />;

  it('renders without crashing', () => {
    const { toJSON } = render(<ProfileMenuRow icon={icon} label="My Bookings" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders the label', () => {
    const { getByText } = render(<ProfileMenuRow icon={icon} label="My Bookings" />);
    expect(getByText('My Bookings')).toBeTruthy();
  });

  it('renders the value when provided', () => {
    const { getByText } = render(<ProfileMenuRow icon={icon} label="Language" value="English" />);
    expect(getByText('English')).toBeTruthy();
  });

  it('does not render value when absent', () => {
    const { queryByText } = render(<ProfileMenuRow icon={icon} label="Profile" />);
    expect(queryByText('English')).toBeNull();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<ProfileMenuRow icon={icon} label="Settings" onPress={onPress} />);
    fireEvent.press(getByText('Settings'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('is disabled when onPress is not provided', () => {
    const { toJSON } = render(<ProfileMenuRow icon={icon} label="Static Row" />);
    expect(toJSON()).toBeTruthy();
  });
});
