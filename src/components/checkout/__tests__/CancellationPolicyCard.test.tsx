jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import CancellationPolicyCard from '../CancellationPolicyCard';

describe('CancellationPolicyCard', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<CancellationPolicyCard />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders the free cancellation translation key', () => {
    const { getByText } = render(<CancellationPolicyCard />);
    expect(getByText('summary.freeCancellation')).toBeTruthy();
  });

  it('renders the cancellation policy translation key', () => {
    const { getByText } = render(<CancellationPolicyCard />);
    expect(getByText('summary.cancellationPolicy')).toBeTruthy();
  });
});
