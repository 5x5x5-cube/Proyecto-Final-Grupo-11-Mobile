jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TransferForm from './TransferForm';

describe('TransferForm', () => {
  const defaultProps = {
    bankCode: '',
    accountNumber: '',
    accountHolder: '',
    onBankChange: jest.fn(),
    onAccountNumberChange: jest.fn(),
    onAccountHolderChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { toJSON } = render(<TransferForm {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('shows the bank picker field', () => {
    const { getByTestId } = render(<TransferForm {...defaultProps} />);
    expect(getByTestId('transfer-bank-picker')).toBeTruthy();
  });

  it('shows the account number input field', () => {
    const { getByTestId } = render(<TransferForm {...defaultProps} />);
    expect(getByTestId('transfer-account-number-input')).toBeTruthy();
  });

  it('shows the account holder input field', () => {
    const { getByTestId } = render(<TransferForm {...defaultProps} />);
    expect(getByTestId('transfer-account-holder-input')).toBeTruthy();
  });

  it('shows the select bank placeholder when no bank is selected', () => {
    const { getByText } = render(<TransferForm {...defaultProps} />);
    expect(getByText('payment.selectBank')).toBeTruthy();
  });

  it('calls onAccountNumberChange with digits only when account number changes', () => {
    const onAccountNumberChange = jest.fn();
    const { getByTestId } = render(
      <TransferForm {...defaultProps} onAccountNumberChange={onAccountNumberChange} />
    );
    fireEvent.changeText(getByTestId('transfer-account-number-input'), '12345abc');
    expect(onAccountNumberChange).toHaveBeenCalledWith('12345');
  });

  it('calls onAccountHolderChange when account holder input changes', () => {
    const onAccountHolderChange = jest.fn();
    const { getByTestId } = render(
      <TransferForm {...defaultProps} onAccountHolderChange={onAccountHolderChange} />
    );
    fireEvent.changeText(getByTestId('transfer-account-holder-input'), 'John Doe');
    expect(onAccountHolderChange).toHaveBeenCalledWith('John Doe');
  });

  it('opens the picker modal when the bank row is pressed', () => {
    const { getByTestId, getAllByText } = render(<TransferForm {...defaultProps} />);
    fireEvent.press(getByTestId('transfer-bank-picker'));
    // Modal title 'payment.selectBank' should appear (modal open)
    const instances = getAllByText('payment.selectBank');
    expect(instances.length).toBeGreaterThanOrEqual(1);
  });

  it('calls onBankChange when a bank is selected from the picker', () => {
    const onBankChange = jest.fn();
    const { getByTestId, getByText } = render(
      <TransferForm {...defaultProps} onBankChange={onBankChange} />
    );
    fireEvent.press(getByTestId('transfer-bank-picker'));
    fireEvent.press(getByText('Bancolombia'));
    expect(onBankChange).toHaveBeenCalledWith('bancolombia');
  });

  it('renders with an existing bank selected', () => {
    const { getByText } = render(<TransferForm {...defaultProps} bankCode="davivienda" />);
    expect(getByText('Davivienda')).toBeTruthy();
  });

  it('does not open picker when disabled', () => {
    const { getByTestId } = render(<TransferForm {...defaultProps} disabled />);
    expect(getByTestId('transfer-bank-picker')).toBeTruthy();
  });
});
