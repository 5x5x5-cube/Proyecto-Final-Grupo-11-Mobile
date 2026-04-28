import React from 'react';
import { render } from '@testing-library/react-native';

const mockIsConnected = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@/hooks/useNetworkStatus', () => ({
  useNetworkStatus: () => ({ isConnected: mockIsConnected() }),
}));

import OfflineBanner from './OfflineBanner';

describe('OfflineBanner', () => {
  it('renders banner when offline', () => {
    mockIsConnected.mockReturnValue(false);
    const { getByText } = render(<OfflineBanner />);
    expect(getByText('offline.banner')).toBeTruthy();
  });

  it('renders nothing when online', () => {
    mockIsConnected.mockReturnValue(true);
    const { toJSON } = render(<OfflineBanner />);
    expect(toJSON()).toBeNull();
  });
});
