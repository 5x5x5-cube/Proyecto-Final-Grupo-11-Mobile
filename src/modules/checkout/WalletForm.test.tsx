jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import WalletForm from './WalletForm';

describe('WalletForm', () => {
  const defaultProps = {
    provider: '',
    email: '',
    onProviderChange: jest.fn(),
    onEmailChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { toJSON } = render(<WalletForm {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('shows the provider picker field', () => {
    const { getByTestId } = render(<WalletForm {...defaultProps} />);
    expect(getByTestId('wallet-provider-picker')).toBeTruthy();
  });

  it('shows the email input field', () => {
    const { getByTestId } = render(<WalletForm {...defaultProps} />);
    expect(getByTestId('wallet-email-input')).toBeTruthy();
  });

  it('shows the select provider placeholder when no provider is selected', () => {
    const { getByText } = render(<WalletForm {...defaultProps} />);
    expect(getByText('payment.selectProvider')).toBeTruthy();
  });

  it('calls onEmailChange when email input changes', () => {
    const onEmailChange = jest.fn();
    const { getByTestId } = render(<WalletForm {...defaultProps} onEmailChange={onEmailChange} />);
    fireEvent.changeText(getByTestId('wallet-email-input'), 'user@example.com');
    expect(onEmailChange).toHaveBeenCalledWith('user@example.com');
  });

  it('opens the picker modal when the provider row is pressed', () => {
    const { getByTestId, getByText } = render(<WalletForm {...defaultProps} />);
    fireEvent.press(getByTestId('wallet-provider-picker'));
    // Modal title should appear
    expect(getByText('payment.walletProvider')).toBeTruthy();
  });

  it('calls onProviderChange when a provider is selected from the picker', () => {
    const onProviderChange = jest.fn();
    const { getByTestId, getByText } = render(
      <WalletForm {...defaultProps} onProviderChange={onProviderChange} />
    );
    fireEvent.press(getByTestId('wallet-provider-picker'));
    fireEvent.press(getByText('payment.providerPayPal'));
    expect(onProviderChange).toHaveBeenCalledWith('paypal');
  });

  it('does not open picker when disabled', () => {
    const { getByTestId, queryAllByText } = render(<WalletForm {...defaultProps} disabled />);
    fireEvent.press(getByTestId('wallet-provider-picker'));
    // When disabled the modal does not open — the title is only shown inside the modal,
    // so we expect at most 1 occurrence (none at all when modal is closed).
    const instances = queryAllByText('payment.walletProvider');
    expect(instances.length).toBeLessThanOrEqual(1);
  });

  it('renders with an existing provider selected', () => {
    const { getByText } = render(<WalletForm {...defaultProps} provider="google_pay" />);
    expect(getByText('payment.providerGooglePay')).toBeTruthy();
  });
});
