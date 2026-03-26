import React from 'react';
import { render } from '@testing-library/react-native';
import InfoGrid from './InfoGrid';

const items = [
  { label: 'Check-in', value: 'Mar 10', sub: '15:00' },
  { label: 'Check-out', value: 'Mar 14' },
];

describe('InfoGrid', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<InfoGrid items={items} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders all item labels', () => {
    const { getByText } = render(<InfoGrid items={items} />);
    expect(getByText('Check-in')).toBeTruthy();
    expect(getByText('Check-out')).toBeTruthy();
  });

  it('renders all item values', () => {
    const { getByText } = render(<InfoGrid items={items} />);
    expect(getByText('Mar 10')).toBeTruthy();
    expect(getByText('Mar 14')).toBeTruthy();
  });

  it('renders sub text when provided', () => {
    const { getByText } = render(<InfoGrid items={items} />);
    expect(getByText('15:00')).toBeTruthy();
  });

  it('does not render sub text when absent', () => {
    const { queryByText } = render(<InfoGrid items={[{ label: 'Nights', value: '4' }]} />);
    expect(queryByText('')).toBeNull();
  });

  it('renders an empty grid without crashing', () => {
    const { toJSON } = render(<InfoGrid items={[]} />);
    expect(toJSON()).toBeTruthy();
  });
});
