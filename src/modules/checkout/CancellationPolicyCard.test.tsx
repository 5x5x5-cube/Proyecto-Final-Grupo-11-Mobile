jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      if (params) return `${key} ${JSON.stringify(params)}`;
      return key;
    },
  }),
}));

jest.mock('@/contexts/LocaleContext', () => ({
  useLocale: () => ({
    formatDate: (date: Date | string) => {
      const d = typeof date === 'string' ? new Date(date) : date;
      return d.toLocaleDateString('es');
    },
  }),
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import CancellationPolicyCard from './CancellationPolicyCard';

describe('CancellationPolicyCard', () => {
  it('renders generic fallback without checkIn', () => {
    const { getByText } = render(<CancellationPolicyCard />);
    expect(getByText('summary.freeCancellation')).toBeTruthy();
    expect(getByText('summary.cancellationPolicy')).toBeTruthy();
  });

  it('renders date-based breakdown with checkIn', () => {
    const { getByText } = render(<CancellationPolicyCard checkIn="2026-06-15" />);
    expect(getByText(/summary.freeCancellationUntil/)).toBeTruthy();
    expect(getByText(/summary.halfChargeLabel/)).toBeTruthy();
    expect(getByText(/summary.noRefundFrom/)).toBeTruthy();
  });
});
