jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    LinearGradient: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
      React.createElement(View, props, children),
  };
});

import React from 'react';
import { render } from '@testing-library/react-native';
import HotelSummaryCard from './HotelSummaryCard';

describe('HotelSummaryCard', () => {
  const defaultProps = {
    hotelName: 'Grand Plaza Hotel',
    location: 'Bogotá, Colombia',
    roomName: 'Deluxe Suite',
  };

  it('renders hotel name', () => {
    const { getByText } = render(<HotelSummaryCard {...defaultProps} />);
    expect(getByText('Grand Plaza Hotel')).toBeTruthy();
  });

  it('renders location', () => {
    const { getByText } = render(<HotelSummaryCard {...defaultProps} />);
    expect(getByText('Bogotá, Colombia')).toBeTruthy();
  });

  it('renders room name', () => {
    const { getByText } = render(<HotelSummaryCard {...defaultProps} />);
    expect(getByText('Deluxe Suite')).toBeTruthy();
  });

  it('renders without crashing when no gradient is provided (uses default)', () => {
    const { toJSON } = render(<HotelSummaryCard {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders without crashing when a custom gradient is provided', () => {
    const { toJSON } = render(
      <HotelSummaryCard {...defaultProps} gradient={['#FF0000', '#0000FF']} />
    );
    expect(toJSON()).toBeTruthy();
  });
});
