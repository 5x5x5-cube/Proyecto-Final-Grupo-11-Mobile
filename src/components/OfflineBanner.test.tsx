import React from 'react';
import { render } from '@testing-library/react-native';
import OfflineBanner from './OfflineBanner';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('OfflineBanner', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<OfflineBanner />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders the offline banner translation key', () => {
    const { getByText } = render(<OfflineBanner />);
    expect(getByText('offline.banner')).toBeTruthy();
  });
});
