jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../i18n', () => ({
  changeLanguage: jest.fn(),
}));

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CardForm from './CardForm';

const defaultProps = {
  cardNumber: '',
  cardHolder: '',
  expiry: '',
  cvv: '',
  onCardNumberChange: jest.fn(),
  onCardHolderChange: jest.fn(),
  onExpiryChange: jest.fn(),
  onCvvChange: jest.fn(),
  cardDisplayValue: '',
};

describe('CardForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { toJSON } = render(<CardForm {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders card number placeholder', () => {
    const { getByPlaceholderText } = render(<CardForm {...defaultProps} />);
    expect(getByPlaceholderText('payment.cardNumber')).toBeTruthy();
  });

  it('renders card holder placeholder', () => {
    const { getByPlaceholderText } = render(<CardForm {...defaultProps} />);
    expect(getByPlaceholderText('payment.cardHolder')).toBeTruthy();
  });

  it('renders expiry placeholder', () => {
    const { getByPlaceholderText } = render(<CardForm {...defaultProps} />);
    expect(getByPlaceholderText('payment.expiry')).toBeTruthy();
  });

  it('renders cvv placeholder', () => {
    const { getByPlaceholderText } = render(<CardForm {...defaultProps} />);
    expect(getByPlaceholderText('payment.cvv')).toBeTruthy();
  });

  it('calls onCardNumberChange when card number input changes', () => {
    const onCardNumberChange = jest.fn();
    const { getByPlaceholderText } = render(
      <CardForm {...defaultProps} onCardNumberChange={onCardNumberChange} />
    );
    fireEvent.changeText(getByPlaceholderText('payment.cardNumber'), '4111');
    expect(onCardNumberChange).toHaveBeenCalledWith('4111');
  });

  it('calls onCardHolderChange when holder name changes', () => {
    const onCardHolderChange = jest.fn();
    const { getByPlaceholderText } = render(
      <CardForm {...defaultProps} onCardHolderChange={onCardHolderChange} />
    );
    fireEvent.changeText(getByPlaceholderText('payment.cardHolder'), 'John Doe');
    expect(onCardHolderChange).toHaveBeenCalledWith('John Doe');
  });

  it('calls onExpiryChange when expiry changes', () => {
    const onExpiryChange = jest.fn();
    const { getByPlaceholderText } = render(
      <CardForm {...defaultProps} onExpiryChange={onExpiryChange} />
    );
    fireEvent.changeText(getByPlaceholderText('payment.expiry'), '12/27');
    expect(onExpiryChange).toHaveBeenCalledWith('12/27');
  });

  it('calls onCvvChange when cvv changes', () => {
    const onCvvChange = jest.fn();
    const { getByPlaceholderText } = render(
      <CardForm {...defaultProps} onCvvChange={onCvvChange} />
    );
    fireEvent.changeText(getByPlaceholderText('payment.cvv'), '123');
    expect(onCvvChange).toHaveBeenCalledWith('123');
  });

  it('disables all inputs when disabled prop is true', () => {
    const { getByPlaceholderText } = render(<CardForm {...defaultProps} disabled />);
    expect(getByPlaceholderText('payment.cardNumber').props.editable).toBe(false);
    expect(getByPlaceholderText('payment.cardHolder').props.editable).toBe(false);
    expect(getByPlaceholderText('payment.expiry').props.editable).toBe(false);
    expect(getByPlaceholderText('payment.cvv').props.editable).toBe(false);
  });

  it('enables all inputs when disabled prop is false', () => {
    const { getByPlaceholderText } = render(<CardForm {...defaultProps} disabled={false} />);
    expect(getByPlaceholderText('payment.cardNumber').props.editable).toBe(true);
    expect(getByPlaceholderText('payment.cardHolder').props.editable).toBe(true);
    expect(getByPlaceholderText('payment.expiry').props.editable).toBe(true);
    expect(getByPlaceholderText('payment.cvv').props.editable).toBe(true);
  });

  it('displays the cardDisplayValue in the card number input', () => {
    const { getByPlaceholderText } = render(
      <CardForm {...defaultProps} cardDisplayValue="4111 •••• •••• 1234" />
    );
    expect(getByPlaceholderText('payment.cardNumber').props.value).toBe('4111 •••• •••• 1234');
  });

  it('calls onCardFocus and onCardBlur when card number is focused/blurred', () => {
    const onCardFocus = jest.fn();
    const onCardBlur = jest.fn();
    const { getByPlaceholderText } = render(
      <CardForm {...defaultProps} onCardFocus={onCardFocus} onCardBlur={onCardBlur} />
    );
    const input = getByPlaceholderText('payment.cardNumber');
    fireEvent(input, 'focus');
    expect(onCardFocus).toHaveBeenCalledTimes(1);
    fireEvent(input, 'blur');
    expect(onCardBlur).toHaveBeenCalledTimes(1);
  });
});
