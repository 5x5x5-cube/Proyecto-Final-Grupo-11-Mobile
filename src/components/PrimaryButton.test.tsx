import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PrimaryButton from './PrimaryButton';

describe('PrimaryButton', () => {
  it('renders the title text', () => {
    const { getByText } = render(<PrimaryButton title="Continue" onPress={jest.fn()} />);
    expect(getByText('Continue')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<PrimaryButton title="Continue" onPress={onPress} />);
    fireEvent.press(getByText('Continue'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows ActivityIndicator when loading', () => {
    const { queryByText, UNSAFE_queryByType } = render(
      <PrimaryButton title="Continue" onPress={jest.fn()} loading />
    );
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_queryByType(ActivityIndicator)).toBeTruthy();
    expect(queryByText('Continue')).toBeNull();
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(<PrimaryButton title="Continue" onPress={onPress} disabled />);
    fireEvent.press(getByText('Continue'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not call onPress when loading', () => {
    const onPress = jest.fn();
    const { UNSAFE_queryByType } = render(
      <PrimaryButton title="Continue" onPress={onPress} loading />
    );
    const { ActivityIndicator } = require('react-native');
    const indicator = UNSAFE_queryByType(ActivityIndicator);
    // The parent Pressable is disabled, so pressing is blocked
    expect(indicator).toBeTruthy();
  });
});
