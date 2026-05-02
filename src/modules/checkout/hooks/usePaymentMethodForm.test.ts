import { renderHook, act } from '@testing-library/react-native';
import { usePaymentMethodForm } from './usePaymentMethodForm';

describe('usePaymentMethodForm', () => {
  // ─── Default state ──────────────────────────────────────────────────────────

  it('default selected method is credit', () => {
    const { result } = renderHook(() => usePaymentMethodForm());
    expect(result.current.selected).toBe('credit');
  });

  // ─── Card form validation ───────────────────────────────────────────────────

  it('isFormValid is false when card fields are empty', () => {
    const { result } = renderHook(() => usePaymentMethodForm());
    expect(result.current.isFormValid).toBe(false);
  });

  it('isFormValid is true when all card fields are valid', () => {
    const { result } = renderHook(() => usePaymentMethodForm());

    act(() => {
      result.current.handleCardNumberChange('4111111111111111');
      result.current.setCardHolder('Test');
      result.current.handleExpiryChange('12/27');
      result.current.handleCvvChange('123');
    });

    expect(result.current.isFormValid).toBe(true);
  });

  // ─── Wallet form ────────────────────────────────────────────────────────────

  it('switching to wallet makes showWalletForm true and showCardForm false', () => {
    const { result } = renderHook(() => usePaymentMethodForm());

    act(() => {
      result.current.setSelected('wallet');
    });

    expect(result.current.showWalletForm).toBe(true);
    expect(result.current.showCardForm).toBe(false);
  });

  it('wallet: isFormValid is false with empty provider and email', () => {
    const { result } = renderHook(() => usePaymentMethodForm());

    act(() => {
      result.current.setSelected('wallet');
    });

    expect(result.current.isFormValid).toBe(false);
  });

  it('wallet: isFormValid is true with provider and valid email', () => {
    const { result } = renderHook(() => usePaymentMethodForm());

    act(() => {
      result.current.setSelected('wallet');
      result.current.setWalletProvider('PayPal');
      result.current.setWalletEmail('user@example.com');
    });

    expect(result.current.isFormValid).toBe(true);
  });

  // ─── Transfer form ──────────────────────────────────────────────────────────

  it('switching to transfer makes showTransferForm true', () => {
    const { result } = renderHook(() => usePaymentMethodForm());

    act(() => {
      result.current.setSelected('transfer');
    });

    expect(result.current.showTransferForm).toBe(true);
  });

  it('transfer: isFormValid is false with empty fields', () => {
    const { result } = renderHook(() => usePaymentMethodForm());

    act(() => {
      result.current.setSelected('transfer');
    });

    expect(result.current.isFormValid).toBe(false);
  });

  it('transfer: isFormValid is true with bank code, 6+ digit account, and holder name', () => {
    const { result } = renderHook(() => usePaymentMethodForm());

    act(() => {
      result.current.setSelected('transfer');
      result.current.setBankCode('001');
      result.current.setAccountNumber('123456');
      result.current.setAccountHolder('Jane Doe');
    });

    expect(result.current.isFormValid).toBe(true);
  });

  // ─── buildTokenizePayload ───────────────────────────────────────────────────

  it('buildTokenizePayload returns correct shape for credit card', () => {
    const { result } = renderHook(() => usePaymentMethodForm());

    act(() => {
      result.current.handleCardNumberChange('4111111111111111');
      result.current.setCardHolder('Test');
      result.current.handleExpiryChange('12/27');
      result.current.handleCvvChange('123');
    });

    const payload = result.current.buildTokenizePayload();
    expect(payload).toEqual({
      method: 'credit_card',
      cardNumber: '4111111111111111',
      cardHolder: 'Test',
      expiry: '12/27',
      cvv: '123',
    });
  });

  it('buildTokenizePayload returns correct shape for wallet (method: digital_wallet)', () => {
    const { result } = renderHook(() => usePaymentMethodForm());

    act(() => {
      result.current.setSelected('wallet');
      result.current.setWalletProvider('PayPal');
      result.current.setWalletEmail('user@example.com');
    });

    const payload = result.current.buildTokenizePayload();
    expect(payload).toEqual({
      method: 'digital_wallet',
      walletProvider: 'PayPal',
      walletEmail: 'user@example.com',
    });
  });

  it('buildTokenizePayload returns correct shape for transfer', () => {
    const { result } = renderHook(() => usePaymentMethodForm());

    act(() => {
      result.current.setSelected('transfer');
      result.current.setBankCode('001');
      result.current.setAccountNumber('123456');
      result.current.setAccountHolder('Jane Doe');
    });

    const payload = result.current.buildTokenizePayload();
    expect(payload).toEqual({
      method: 'transfer',
      bankCode: '001',
      accountNumber: '123456',
      accountHolder: 'Jane Doe',
    });
  });

  // ─── getApiMethod ───────────────────────────────────────────────────────────

  it('getApiMethod returns credit_card for credit selection', () => {
    const { result } = renderHook(() => usePaymentMethodForm());
    expect(result.current.getApiMethod()).toBe('credit_card');
  });

  it('getApiMethod returns debit_card for debit selection', () => {
    const { result } = renderHook(() => usePaymentMethodForm());

    act(() => {
      result.current.setSelected('debit');
    });

    expect(result.current.getApiMethod()).toBe('debit_card');
  });

  it('getApiMethod returns digital_wallet for wallet selection', () => {
    const { result } = renderHook(() => usePaymentMethodForm());

    act(() => {
      result.current.setSelected('wallet');
    });

    expect(result.current.getApiMethod()).toBe('digital_wallet');
  });

  it('getApiMethod returns transfer for transfer selection', () => {
    const { result } = renderHook(() => usePaymentMethodForm());

    act(() => {
      result.current.setSelected('transfer');
    });

    expect(result.current.getApiMethod()).toBe('transfer');
  });

  // ─── Input helpers ──────────────────────────────────────────────────────────

  it('handleCardNumberChange strips non-digits and limits to 16 characters', () => {
    const { result } = renderHook(() => usePaymentMethodForm());

    act(() => {
      result.current.handleCardNumberChange('4111-1111-1111-11111');
    });

    // Non-digits stripped, capped at 16
    expect(result.current.rawCardNumber).toBe('4111111111111111');
  });

  it('handleExpiryChange auto-formats with slash after month digits', () => {
    const { result } = renderHook(() => usePaymentMethodForm());

    act(() => {
      result.current.handleExpiryChange('1227');
    });

    expect(result.current.expiry).toBe('12/27');
  });

  it('handleCvvChange strips non-digits and limits to 3 characters', () => {
    const { result } = renderHook(() => usePaymentMethodForm());

    act(() => {
      result.current.handleCvvChange('abc1234');
    });

    expect(result.current.cvv).toBe('123');
  });
});
