import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FilterChip from './FilterChip';

describe('FilterChip', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<FilterChip label="Price" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders the label text', () => {
    const { getByText } = render(<FilterChip label="Rating" />);
    expect(getByText('Rating')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<FilterChip label="Stars" onPress={onPress} />);
    fireEvent.press(getByText('Stars'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders in unselected state by default', () => {
    const { toJSON } = render(<FilterChip label="Pool" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders in selected state', () => {
    const { getByText } = render(<FilterChip label="Pool" selected />);
    expect(getByText('Pool')).toBeTruthy();
  });
});
