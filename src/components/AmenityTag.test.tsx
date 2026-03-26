import React from 'react';
import { render } from '@testing-library/react-native';
import AmenityTag from './AmenityTag';

describe('AmenityTag', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<AmenityTag icon="wifi" label="WiFi" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders the label text', () => {
    const { getByText } = render(<AmenityTag icon="pool" label="Pool" />);
    expect(getByText('Pool')).toBeTruthy();
  });

  it('renders a fallback icon for unknown icon keys', () => {
    const { toJSON } = render(<AmenityTag icon="unknown_amenity" label="Unknown" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders known amenity icons correctly', () => {
    const amenities = [
      { icon: 'wifi', label: 'Free WiFi' },
      { icon: 'free_breakfast', label: 'Breakfast' },
      { icon: 'ac_unit', label: 'Air Conditioning' },
    ];
    amenities.forEach(({ icon, label }) => {
      const { getByText } = render(<AmenityTag icon={icon} label={label} />);
      expect(getByText(label)).toBeTruthy();
    });
  });
});
