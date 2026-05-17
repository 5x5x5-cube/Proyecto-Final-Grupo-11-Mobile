import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

import DatePickerModal from './DatePickerModal';

const options = [
  { key: 'd1', label: 'March 15', date: '2026-03-15' },
  { key: 'd2', label: 'March 20', date: '2026-03-20' },
];

describe('DatePickerModal', () => {
  it('renders without crashing when visible', () => {
    expect(() =>
      render(
        <DatePickerModal
          visible
          onClose={jest.fn()}
          options={options}
          selected="2026-03-15"
          onSelect={jest.fn()}
          title="Select date"
        />
      )
    ).not.toThrow();
  });

  it('renders without crashing when not visible', () => {
    expect(() =>
      render(
        <DatePickerModal
          visible={false}
          onClose={jest.fn()}
          options={options}
          selected="2026-03-15"
          onSelect={jest.fn()}
        />
      )
    ).not.toThrow();
  });
});
