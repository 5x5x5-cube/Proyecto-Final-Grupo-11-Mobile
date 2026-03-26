import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TopBar from './TopBar';

describe('TopBar', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<TopBar title="Hotel Details" onBack={jest.fn()} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders the title text', () => {
    const { getByText } = render(<TopBar title="My Bookings" onBack={jest.fn()} />);
    expect(getByText('My Bookings')).toBeTruthy();
  });

  it('calls onBack when the back button is pressed', () => {
    const onBack = jest.fn();
    const { getByTestId } = render(<TopBar title="Details" onBack={onBack} />);
    fireEvent.press(getByTestId('topbar-back-button'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders different titles correctly', () => {
    const { getByText, rerender } = render(<TopBar title="Profile" onBack={jest.fn()} />);
    expect(getByText('Profile')).toBeTruthy();
    rerender(<TopBar title="Settings" onBack={jest.fn()} />);
    expect(getByText('Settings')).toBeTruthy();
  });
});
