jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      opts ? `${key}:${JSON.stringify(opts)}` : key,
  }),
}));

jest.mock('../../../i18n', () => ({
  changeLanguage: jest.fn(),
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import { LocaleProvider } from '../../../contexts/LocaleContext';
import BookingInfoGrid from '../BookingInfoGrid';

function renderWithLocale(ui: React.ReactElement) {
  return render(<LocaleProvider>{ui}</LocaleProvider>);
}

describe('BookingInfoGrid', () => {
  const defaultProps = {
    checkIn: '2026-04-10',
    checkOut: '2026-04-13',
    nights: 3,
    guests: 2,
  };

  it('renders without crashing', () => {
    const { toJSON } = renderWithLocale(<BookingInfoGrid {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders check-in label', () => {
    const { getByText } = renderWithLocale(<BookingInfoGrid {...defaultProps} />);
    expect(getByText('summary.checkIn')).toBeTruthy();
  });

  it('renders check-out label', () => {
    const { getByText } = renderWithLocale(<BookingInfoGrid {...defaultProps} />);
    expect(getByText('summary.checkOut')).toBeTruthy();
  });

  it('renders nights count via translation key', () => {
    const { getByText } = renderWithLocale(<BookingInfoGrid {...defaultProps} />);
    expect(getByText(`summary.nights:${JSON.stringify({ count: 3 })}`)).toBeTruthy();
  });

  it('renders guests count via translation key', () => {
    const { getByText } = renderWithLocale(<BookingInfoGrid {...defaultProps} />);
    expect(getByText(`summary.guestsValue:${JSON.stringify({ count: 2 })}`)).toBeTruthy();
  });
});
