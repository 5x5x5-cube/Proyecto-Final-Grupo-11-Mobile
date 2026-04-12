import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import ActionBar from './ActionBar';

describe('ActionBar', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(
      <ActionBar>
        <Text>Action</Text>
      </ActionBar>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders children', () => {
    const { getByText } = render(
      <ActionBar>
        <Text>Book Now</Text>
      </ActionBar>
    );
    expect(getByText('Book Now')).toBeTruthy();
  });

  it('renders multiple children', () => {
    const { getByText } = render(
      <ActionBar>
        <Text>Cancel</Text>
        <Text>Confirm</Text>
      </ActionBar>
    );
    expect(getByText('Cancel')).toBeTruthy();
    expect(getByText('Confirm')).toBeTruthy();
  });
});
