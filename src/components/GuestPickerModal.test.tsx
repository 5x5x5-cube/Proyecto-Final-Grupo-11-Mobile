import React from 'react';
import renderer from 'react-test-renderer';

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

import GuestPickerModal from './GuestPickerModal';

describe('GuestPickerModal', () => {
  it('renders without crashing when visible', () => {
    expect(() =>
      renderer.create(
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
      renderer.create(
        <GuestPickerModal visible={false} onClose={jest.fn()} value={2} onChange={jest.fn()} />
      )
    ).not.toThrow();
  });
});
