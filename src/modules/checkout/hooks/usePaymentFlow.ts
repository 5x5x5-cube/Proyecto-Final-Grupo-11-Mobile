import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '@/navigation/types';
import { useLocale } from '@/contexts/LocaleContext';
import { useCart } from '@/api/hooks/useCart';
import { useTokenize, useInitiatePayment, usePaymentStatus } from '@/api/hooks/usePayments';
import type { PaymentMethod as ApiPaymentMethod } from '@/api/hooks/usePayments';

export function usePaymentFlow() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation('mobile');

  const { currency } = useLocale();
  const { data: cart, isLoading: isCartLoading } = useCart();
  const tokenize = useTokenize();
  const initiatePayment = useInitiatePayment();

  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [formEnabled, setFormEnabled] = useState(true);

  const paymentStatus = usePaymentStatus(paymentId);

  const isPolling = !!paymentId && paymentStatus.data?.status === 'processing';
  const isProcessing = tokenize.isPending || initiatePayment.isPending || isPolling;

  // React to polling result
  const statusRef = React.useRef(paymentStatus.data?.status);
  statusRef.current = paymentStatus.data?.status;

  useEffect(() => {
    const status = statusRef.current;
    if (!status || !paymentId) return;

    if (status === 'approved') {
      const pid = paymentId;
      // Defer state updates to avoid cascading renders within effect
      setTimeout(() => {
        setPaymentId(null);
        navigation.navigate('Success', { paymentId: pid });
      }, 0);
    } else if (status === 'declined') {
      setTimeout(() => {
        setPaymentId(null);
        setFormEnabled(true);
        Alert.alert(t('payment.paymentError'), t('payment.declinedMessage'));
      }, 0);
    }
  }, [paymentStatus.data?.status]);

  const handleExpired = () => {
    Alert.alert(t('summary.holdExpired'), t('summary.holdExpiredMessage'), [
      { text: t('common.ok'), onPress: () => navigation.navigate('MainTabs') },
    ]);
  };

  function submitPayment(tokenizePayload: Record<string, unknown>, apiMethod: ApiPaymentMethod) {
    setFormEnabled(false);

    tokenize.mutate(tokenizePayload as any, {
      onSuccess: tokenData => {
        initiatePayment.mutate(
          { token: tokenData.token, cartId: cart!.id, method: apiMethod, currency },
          {
            onSuccess: initiateData => setPaymentId(initiateData.paymentId),
            onError: () => {
              setFormEnabled(true);
              Alert.alert(t('payment.paymentError'), t('payment.declinedMessage'));
            },
          }
        );
      },
      onError: () => {
        setFormEnabled(true);
        Alert.alert(t('payment.paymentError'), t('payment.declinedMessage'));
      },
    });
  }

  return {
    cart,
    isCartLoading,
    isProcessing,
    formEnabled,
    handleExpired,
    submitPayment,
    goBack: () => navigation.goBack(),
  };
}
