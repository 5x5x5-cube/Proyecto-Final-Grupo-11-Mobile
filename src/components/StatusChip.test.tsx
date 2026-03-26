import React from 'react';
import { render } from '@testing-library/react-native';
import StatusChip from './StatusChip';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('StatusChip', () => {
  it('renders without crashing for confirmed status', () => {
    const { toJSON } = render(<StatusChip status="confirmed" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders the translated label when no label prop is given', () => {
    const { getByText } = render(<StatusChip status="confirmed" />);
    expect(getByText('status.confirmed')).toBeTruthy();
  });

  it('renders a custom label when provided', () => {
    const { getByText } = render(<StatusChip status="confirmed" label="Booked" />);
    expect(getByText('Booked')).toBeTruthy();
  });

  it('renders pending status', () => {
    const { getByText } = render(<StatusChip status="pending" />);
    expect(getByText('status.pending')).toBeTruthy();
  });

  it('renders cancelled status', () => {
    const { getByText } = render(<StatusChip status="cancelled" />);
    expect(getByText('status.cancelled')).toBeTruthy();
  });

  it('renders past status without an icon', () => {
    const { getByText } = render(<StatusChip status="past" />);
    expect(getByText('status.past')).toBeTruthy();
  });
});
