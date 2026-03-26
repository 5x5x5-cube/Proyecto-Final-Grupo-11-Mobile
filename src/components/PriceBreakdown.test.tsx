import React from 'react';
import { render } from '@testing-library/react-native';
import PriceBreakdown from './PriceBreakdown';

const rows = [
  { label: 'Room rate x 4 nights', value: '$400' },
  { label: 'Taxes & fees', value: '$60' },
];

describe('PriceBreakdown', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<PriceBreakdown rows={rows} totalLabel="Total" totalValue="$460" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders all row labels', () => {
    const { getByText } = render(
      <PriceBreakdown rows={rows} totalLabel="Total" totalValue="$460" />
    );
    expect(getByText('Room rate x 4 nights')).toBeTruthy();
    expect(getByText('Taxes & fees')).toBeTruthy();
  });

  it('renders all row values', () => {
    const { getByText } = render(
      <PriceBreakdown rows={rows} totalLabel="Total" totalValue="$460" />
    );
    expect(getByText('$400')).toBeTruthy();
    expect(getByText('$60')).toBeTruthy();
  });

  it('renders the total label and value', () => {
    const { getByText } = render(
      <PriceBreakdown rows={rows} totalLabel="Total" totalValue="$460" />
    );
    expect(getByText('Total')).toBeTruthy();
    expect(getByText('$460')).toBeTruthy();
  });

  it('renders with empty rows', () => {
    const { getByText } = render(
      <PriceBreakdown rows={[]} totalLabel="Grand Total" totalValue="$0" />
    );
    expect(getByText('Grand Total')).toBeTruthy();
    expect(getByText('$0')).toBeTruthy();
  });
});
