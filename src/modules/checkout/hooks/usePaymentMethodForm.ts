import { useState } from 'react';
import { isValidLuhn } from '@/utils/luhn';

export type UIPaymentMethod = 'credit' | 'debit' | 'wallet' | 'transfer';

export function usePaymentMethodForm() {
  const [selected, setSelected] = useState<UIPaymentMethod>('credit');

  // Card fields
  const [rawCardNumber, setRawCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isCardFocused, setIsCardFocused] = useState(false);

  // Wallet fields
  const [walletProvider, setWalletProvider] = useState('');
  const [walletEmail, setWalletEmail] = useState('');

  // Transfer fields
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  // Card validation
  const rawDigits = rawCardNumber.replace(/\D/g, '');
  const isCardNumberComplete = rawDigits.length === 16;
  const isCardNumberValid = isCardNumberComplete && isValidLuhn(rawDigits);

  const isExpiryFormatValid = /^\d{2}\/\d{2}$/.test(expiry);
  const isExpiryNotExpired = (() => {
    if (!isExpiryFormatValid) return true;
    const [mm, yy] = expiry.split('/').map(Number);
    return new Date(2000 + yy, mm) > new Date();
  })();

  const isCardFormValid =
    isCardNumberValid &&
    isExpiryFormatValid &&
    isExpiryNotExpired &&
    cardHolder.trim().length > 0 &&
    cvv.length === 3;

  // Wallet validation
  const isWalletFormValid =
    walletProvider.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(walletEmail);

  // Transfer validation
  const isTransferFormValid =
    bankCode.length > 0 && accountNumber.length >= 6 && accountHolder.trim().length > 0;

  const showCardForm = selected === 'credit' || selected === 'debit';

  const isFormValid = showCardForm
    ? isCardFormValid
    : selected === 'wallet'
      ? isWalletFormValid
      : selected === 'transfer'
        ? isTransferFormValid
        : false;

  function buildTokenizePayload() {
    if (selected === 'wallet') {
      return { method: 'digital_wallet' as const, walletProvider, walletEmail };
    }
    if (selected === 'transfer') {
      return { method: 'transfer' as const, bankCode, accountNumber, accountHolder };
    }
    const apiMethod = selected === 'debit' ? ('debit_card' as const) : ('credit_card' as const);
    return { method: apiMethod, cardNumber: rawCardNumber, cardHolder, expiry, cvv };
  }

  function getApiMethod() {
    if (selected === 'debit') return 'debit_card' as const;
    if (selected === 'wallet') return 'digital_wallet' as const;
    if (selected === 'transfer') return 'transfer' as const;
    return 'credit_card' as const;
  }

  // Card number formatting helpers
  function formatCardDisplay(raw: string): string {
    const digits = raw.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  }

  function maskCardDisplay(raw: string): string {
    const digits = raw.replace(/\D/g, '').slice(0, 16);
    if (digits.length <= 4) return digits.replace(/(.{4})/g, '$1 ').trim();
    const last4 = digits.slice(-4);
    const masked = '\u2022'.repeat(digits.length - 4) + last4;
    return masked
      .padEnd(16, ' ')
      .slice(0, 16)
      .replace(/(.{4})/g, '$1 ')
      .trim();
  }

  const cardDisplayValue = isCardFocused
    ? formatCardDisplay(rawCardNumber)
    : maskCardDisplay(rawCardNumber);

  function handleCardNumberChange(text: string) {
    setRawCardNumber(text.replace(/[^\d]/g, '').slice(0, 16));
  }

  function handleExpiryChange(text: string) {
    const prev = expiry;
    if (text.length < prev.length) {
      if (prev.length === 3 && text.length === 2 && text[1] === '/') {
        setExpiry(text.slice(0, 1));
        return;
      }
      setExpiry(text);
      return;
    }
    const digits = text.replace(/\D/g, '').slice(0, 4);
    const formatted = digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;
    if (formatted.length >= 2) {
      const month = parseInt(formatted.slice(0, 2), 10);
      if (month < 1 || month > 12) return;
    }
    setExpiry(formatted);
  }

  function handleCvvChange(text: string) {
    setCvv(text.replace(/\D/g, '').slice(0, 3));
  }

  return {
    // Method selection
    selected,
    setSelected,
    showCardForm,
    showWalletForm: selected === 'wallet',
    showTransferForm: selected === 'transfer',

    // Card
    rawCardNumber,
    cardHolder,
    setCardHolder,
    expiry,
    cvv,
    cardDisplayValue,
    handleCardNumberChange,
    handleExpiryChange,
    handleCvvChange,
    isCardFocused,
    setIsCardFocused,

    // Wallet
    walletProvider,
    setWalletProvider,
    walletEmail,
    setWalletEmail,

    // Transfer
    bankCode,
    setBankCode,
    accountNumber,
    setAccountNumber,
    accountHolder,
    setAccountHolder,

    // Computed
    isFormValid,
    buildTokenizePayload,
    getApiMethod,
  };
}
