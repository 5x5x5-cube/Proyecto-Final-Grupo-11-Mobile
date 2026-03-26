import React from 'react';
import renderer from 'react-test-renderer';

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

import PickerModal from './PickerModal';

const options = [
  { key: 'a', label: 'Option A' },
  { key: 'b', label: 'Option B' },
];

describe('PickerModal', () => {
  it('renders without crashing when visible', () => {
    expect(() =>
      renderer.create(
        <PickerModal
          visible
          onClose={jest.fn()}
          options={options}
          selected="a"
          onSelect={jest.fn()}
          title="Pick one"
        />
      )
    ).not.toThrow();
  });

  it('renders without crashing when not visible', () => {
    expect(() =>
      renderer.create(
        <PickerModal
          visible={false}
          onClose={jest.fn()}
          options={options}
          selected="a"
          onSelect={jest.fn()}
        />
      )
    ).not.toThrow();
  });
});
