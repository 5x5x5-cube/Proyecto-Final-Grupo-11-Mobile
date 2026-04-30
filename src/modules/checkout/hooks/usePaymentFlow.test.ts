import { renderHook, act, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { usePaymentFlow } from './usePaymentFlow';

// ─── Module mocks ─────────────────────────────────────────────────────────────

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@/contexts/LocaleContext', () => ({
  useLocale: jest.fn(),
}));

jest.mock('@/api/hooks/useCart', () => ({
  useCart: jest.fn(),
}));

jest.mock('@/api/hooks/usePayments', () => ({
  useTokenize: jest.fn(),
  useInitiatePayment: jest.fn(),
  usePaymentStatus: jest.fn(),
}));

// ─── Import mocked modules ────────────────────────────────────────────────────

import { useNavigation } from '@react-navigation/native';
import { useLocale } from '@/contexts/LocaleContext';
import { useCart } from '@/api/hooks/useCart';
import { useTokenize, useInitiatePayment, usePaymentStatus } from '@/api/hooks/usePayments';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

const mockUseNavigation = useNavigation as jest.Mock;
const mockUseLocale = useLocale as jest.Mock;
const mockUseCart = useCart as jest.Mock;
const mockUseTokenize = useTokenize as jest.Mock;
const mockUseInitiatePayment = useInitiatePayment as jest.Mock;
const mockUsePaymentStatus = usePaymentStatus as jest.Mock;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildTokenizeMock(overrides: Partial<{ isPending: boolean; mutate: jest.Mock }> = {}) {
  return {
    isPending: false,
    mutate: jest.fn(),
    ...overrides,
  };
}

function buildInitiateMock(overrides: Partial<{ isPending: boolean; mutate: jest.Mock }> = {}) {
  return {
    isPending: false,
    mutate: jest.fn(),
    ...overrides,
  };
}

function buildStatusMock(data: null | { status: string } = null) {
  return { data };
}

function setupDefaults() {
  mockUseNavigation.mockReturnValue({ navigate: mockNavigate, goBack: mockGoBack });
  mockUseLocale.mockReturnValue({ currency: 'COP' });
  mockUseCart.mockReturnValue({ data: { id: 'cart-1' }, isLoading: false });
  mockUseTokenize.mockReturnValue(buildTokenizeMock());
  mockUseInitiatePayment.mockReturnValue(buildInitiateMock());
  mockUsePaymentStatus.mockReturnValue(buildStatusMock());
}

// ─── Tests ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  setupDefaults();
});

describe('usePaymentFlow', () => {
  it('returns isCartLoading: true when cart is loading', () => {
    mockUseCart.mockReturnValue({ data: undefined, isLoading: true });

    const { result } = renderHook(() => usePaymentFlow());

    expect(result.current.isCartLoading).toBe(true);
  });

  it('returns cart data when loaded', () => {
    const cart = { id: 'cart-42', pricing: {} };
    mockUseCart.mockReturnValue({ data: cart, isLoading: false });

    const { result } = renderHook(() => usePaymentFlow());

    expect(result.current.cart).toEqual(cart);
  });

  it('isProcessing is false initially', () => {
    const { result } = renderHook(() => usePaymentFlow());
    expect(result.current.isProcessing).toBe(false);
  });

  it('formEnabled is true initially', () => {
    const { result } = renderHook(() => usePaymentFlow());
    expect(result.current.formEnabled).toBe(true);
  });

  it('submitPayment calls tokenize.mutate with the payload', () => {
    const tokenizeMutateMock = jest.fn();
    mockUseTokenize.mockReturnValue(buildTokenizeMock({ mutate: tokenizeMutateMock }));

    const { result } = renderHook(() => usePaymentFlow());

    const payload = { method: 'credit_card', cardNumber: '4111111111111111' };

    act(() => {
      result.current.submitPayment(payload as any, 'credit_card');
    });

    expect(tokenizeMutateMock).toHaveBeenCalledWith(payload, expect.any(Object));
  });

  it('on tokenize success, calls initiatePayment.mutate', () => {
    const initiateMutateMock = jest.fn();
    mockUseInitiatePayment.mockReturnValue(buildInitiateMock({ mutate: initiateMutateMock }));

    // Simulate tokenize calling onSuccess synchronously
    const tokenizeMutateMock = jest.fn((_, callbacks) => {
      callbacks.onSuccess({ token: 'tok_abc' });
    });
    mockUseTokenize.mockReturnValue(buildTokenizeMock({ mutate: tokenizeMutateMock }));

    const { result } = renderHook(() => usePaymentFlow());

    act(() => {
      result.current.submitPayment({ method: 'credit_card' } as any, 'credit_card');
    });

    expect(initiateMutateMock).toHaveBeenCalledWith(
      { token: 'tok_abc', cartId: 'cart-1', method: 'credit_card', currency: 'COP' },
      expect.any(Object)
    );
  });

  it('sends the selected currency from locale in initiate request', () => {
    mockUseLocale.mockReturnValue({ currency: 'MXN' });

    const initiateMutateMock = jest.fn();
    mockUseInitiatePayment.mockReturnValue(buildInitiateMock({ mutate: initiateMutateMock }));

    const tokenizeMutateMock = jest.fn((_, callbacks) => {
      callbacks.onSuccess({ token: 'tok_mxn' });
    });
    mockUseTokenize.mockReturnValue(buildTokenizeMock({ mutate: tokenizeMutateMock }));

    const { result } = renderHook(() => usePaymentFlow());

    act(() => {
      result.current.submitPayment({ method: 'credit_card' } as any, 'credit_card');
    });

    expect(initiateMutateMock).toHaveBeenCalledWith(
      { token: 'tok_mxn', cartId: 'cart-1', method: 'credit_card', currency: 'MXN' },
      expect.any(Object)
    );
  });

  it('on tokenize error, re-enables form and shows alert', () => {
    jest.spyOn(Alert, 'alert');

    const tokenizeMutateMock = jest.fn((_, callbacks) => {
      callbacks.onError(new Error('network error'));
    });
    mockUseTokenize.mockReturnValue(buildTokenizeMock({ mutate: tokenizeMutateMock }));

    const { result } = renderHook(() => usePaymentFlow());

    act(() => {
      result.current.submitPayment({ method: 'credit_card' } as any, 'credit_card');
    });

    expect(result.current.formEnabled).toBe(true);
    expect(Alert.alert).toHaveBeenCalled();
  });

  it('on payment approved, navigates to Success screen', async () => {
    mockUsePaymentStatus.mockReturnValue(buildStatusMock(null));

    const initiateMutateMock = jest.fn((_, callbacks) => {
      callbacks.onSuccess({ paymentId: 'pay-999' });
    });
    mockUseInitiatePayment.mockReturnValue(buildInitiateMock({ mutate: initiateMutateMock }));

    const tokenizeMutateMock = jest.fn((_, callbacks) => {
      callbacks.onSuccess({ token: 'tok_xyz' });
    });
    mockUseTokenize.mockReturnValue(buildTokenizeMock({ mutate: tokenizeMutateMock }));

    // After paymentId is set the hook calls usePaymentStatus('pay-999').
    // Pre-configure the mock to return approved when paymentId is truthy.
    mockUsePaymentStatus.mockImplementation((paymentId: string | null) => {
      if (paymentId === 'pay-999') return buildStatusMock({ status: 'approved' });
      return buildStatusMock(null);
    });

    const { result, rerender } = renderHook(() => usePaymentFlow());

    act(() => {
      result.current.submitPayment({ method: 'credit_card' } as any, 'credit_card');
    });

    // Re-render so the useEffect picks up the new paymentStatus.data
    rerender({});

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('Success', { paymentId: 'pay-999' });
    });
  });

  it('on payment declined, re-enables form and shows alert', async () => {
    jest.spyOn(Alert, 'alert');

    const initiateMutateMock = jest.fn((_, callbacks) => {
      callbacks.onSuccess({ paymentId: 'pay-declined' });
    });
    mockUseInitiatePayment.mockReturnValue(buildInitiateMock({ mutate: initiateMutateMock }));

    const tokenizeMutateMock = jest.fn((_, callbacks) => {
      callbacks.onSuccess({ token: 'tok_dec' });
    });
    mockUseTokenize.mockReturnValue(buildTokenizeMock({ mutate: tokenizeMutateMock }));

    mockUsePaymentStatus.mockImplementation((paymentId: string | null) => {
      if (paymentId === 'pay-declined') return buildStatusMock({ status: 'declined' });
      return buildStatusMock(null);
    });

    const { result, rerender } = renderHook(() => usePaymentFlow());

    act(() => {
      result.current.submitPayment({ method: 'credit_card' } as any, 'credit_card');
    });

    rerender({});

    await waitFor(() => {
      expect(result.current.formEnabled).toBe(true);
      expect(Alert.alert).toHaveBeenCalled();
    });
  });
});
