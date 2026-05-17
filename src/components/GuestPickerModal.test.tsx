import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

import GuestPickerModal from './GuestPickerModal';

describe('GuestPickerModal', () => {
  it('renders without crashing when visible', () => {
    expect(() =>
      render(
        <GuestPickerModal
          visible
          onClose={jest.fn()}
          value={2}
          onChange={jest.fn()}
          title="Guests"
          doneLabel="Done"
        />
      )
    ).not.toThrow();
  });

  it('renders without crashing when not visible', () => {
    expect(() =>
      render(
        <GuestPickerModal visible={false} onClose={jest.fn()} value={2} onChange={jest.fn()} />
      )
    ).not.toThrow();
  });
});
