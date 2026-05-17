import React from 'react';
import { render } from '@testing-library/react-native';

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
      render(
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
      render(
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
