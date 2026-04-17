import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, TextInput, View, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '@/navigation/types';
import { useCart } from '@/api/hooks/useCart';
import { useTokenizeCard, useInitiatePayment, usePaymentStatus } from '@/api/hooks/usePayments';
import { useLocale } from '@/contexts/LocaleContext';
import { palette } from '@/theme/palette';
import Text from '@/components/Text';
import TopBar from '@/components/TopBar';
import ActionBar from '@/components/ActionBar';
import HoldCountdown from '@/modules/checkout/HoldCountdown';
import Card from '@/components/Card';
import Divider from '@/components/Divider';
import PrimaryButton from '@/components/PrimaryButton';
import { styles } from './PaymentScreen.styles';

type PaymentMethod = 'credit' | 'debit' | 'wallet' | 'transfer';

const paymentMethods: { key: PaymentMethod; labelKey: string; icon: string }[] = [
  { key: 'credit', labelKey: 'payment.creditCard', icon: 'credit-card' },
  { key: 'debit', labelKey: 'payment.debitCard', icon: 'bank' },
  { key: 'wallet', labelKey: 'payment.digitalWallet', icon: 'wallet' },
  { key: 'transfer', labelKey: 'payment.transfer', icon: 'swap-horizontal' },
];

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function maskCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  if (digits.length <= 4) {
    return digits.replace(/(.{4})/g, '$1 ').trim();
  }
  const last4 = digits.slice(-4);
  const maskedCount = digits.length - 4;
  const masked = '\u2022'.repeat(maskedCount);
  const full = (masked + last4).padEnd(16, ' ').slice(0, 16);
  return full.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) {
    return digits.slice(0, 2) + '/' + digits.slice(2);
  }
  return digits;
}

function isExpiryMonthValid(value: string): boolean {
  if (value.length < 2) return true;
  const month = parseInt(value.slice(0, 2), 10);
  return month >= 1 && month <= 12;
}

export default function PaymentScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation('mobile');
  const { formatPrice, formatDate } = useLocale();
  const [selected, setSelected] = useState<PaymentMethod>('credit');
  const [rawCardNumber, setRawCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isCardFocused, setIsCardFocused] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [formEnabled, setFormEnabled] = useState(true);

  const nameRef = useRef<TextInput>(null);
  const expiryRef = useRef<TextInput>(null);
  const cvvRef = useRef<TextInput>(null);

  const { data: cart, isLoading: isCartLoading } = useCart();
  const tokenizeCard = useTokenizeCard();
  const initiatePayment = useInitiatePayment();
  const paymentStatus = usePaymentStatus(paymentId);

  const isPolling = !!paymentId && paymentStatus.data?.status === 'processing';
  const loading = tokenizeCard.isPending || initiatePayment.isPending || isPolling;

  // React to polling result
  React.useEffect(() => {
    if (!paymentStatus.data) return;

    const { status, bookingCode } = paymentStatus.data;

    if (status === 'approved') {
      setPaymentId(null);
      navigation.navigate('Success', {
        bookingCode: bookingCode ?? 'TH-2026-00000',
        hotelName: cart?.hotelName ?? '',
        checkIn: cart?.checkIn ?? '',
        checkOut: cart?.checkOut ?? '',
      });
    } else if (status === 'declined') {
      setPaymentId(null);
      setFormEnabled(true);
      Alert.alert(
        t('payment.paymentError'),
        'No se pudo procesar la transacción. Verifique los datos o contacte a su banco.'
      );
    }
  }, [paymentStatus.data?.status]);

  const handleExpired = () => {
    Alert.alert(t('summary.holdExpired'), t('summary.holdExpiredMessage'), [
      { text: t('common.ok'), onPress: () => navigation.navigate('MainTabs') },
    ]);
  };

  if (isCartLoading || !cart) {
    return (
      <View style={styles.container}>
        <TopBar title={t('payment.title')} onBack={() => navigation.goBack()} />
        <ActivityIndicator style={{ marginTop: 32 }} color={palette.primary} />
      </View>
    );
  }

  const { hotelName, checkIn, checkOut, priceBreakdown } = cart;
  const total = priceBreakdown?.total ?? 0;
  const currency = priceBreakdown?.currency ?? 'COP';

  const showCardForm = selected === 'credit' || selected === 'debit';

  // Validation uses raw digit count (without spaces)
  const rawDigits = rawCardNumber.replace(/\D/g, '');
  const isCardFormValid =
    rawDigits.length === 16 &&
    cardHolder.trim().length > 0 &&
    expiry.length === 5 &&
    cvv.length === 3;

  const isPayDisabled = loading || !formEnabled || (showCardForm && !isCardFormValid);

  // Show masked value when card input is not focused, raw formatted when focused
  const cardDisplayValue = isCardFocused
    ? formatCardNumber(rawCardNumber)
    : maskCardNumber(rawCardNumber);

  function handleCardNumberChange(text: string) {
    // Strip dots (mask characters) and non-digits, then store raw digits
    const digits = text.replace(/[^\d]/g, '').slice(0, 16);
    setRawCardNumber(digits);
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
    const formatted = formatExpiry(text);
    if (!isExpiryMonthValid(formatted)) return;
    setExpiry(formatted);
  }

  function handlePay() {
    if (isPayDisabled) return;

    setFormEnabled(false);

    tokenizeCard.mutate(
      { cardNumber: rawCardNumber, cardHolder, expiry, cvv },
      {
        onSuccess: tokenData => {
          initiatePayment.mutate(
            {
              token: tokenData.token,
              amount: total,
              currency,
              method: selected,
            },
            {
              onSuccess: initiateData => {
                setPaymentId(initiateData.paymentId);
              },
              onError: () => {
                setFormEnabled(true);
                Alert.alert(
                  t('payment.paymentError'),
                  'No se pudo procesar la transacción. Verifique los datos o contacte a su banco.'
                );
              },
            }
          );
        },
        onError: () => {
          setFormEnabled(true);
          Alert.alert(
            t('payment.paymentError'),
            'No se pudo procesar la transacción. Verifique los datos o contacte a su banco.'
          );
        },
      }
    );
  }

  return (
    <View style={styles.container}>
      <TopBar title={t('payment.title')} onBack={() => navigation.goBack()} />

      {cart?.holdExpiresAt && (
        <HoldCountdown expiresAt={cart.holdExpiresAt} onExpired={handleExpired} />
      )}

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text variant="button" color={palette.onSurface} style={styles.methodLabel}>
          {t('payment.selectMethod')}
        </Text>

        {/* Payment methods grid */}
        <View style={styles.methodGrid}>
          {paymentMethods.map(method => {
            const isSelected = selected === method.key;
            return (
              <Pressable
                key={method.key}
                style={({ pressed }) => [
                  styles.methodCard,
                  isSelected && styles.methodCardSelected,
                  pressed && { opacity: 0.8 },
                ]}
                onPress={() => setSelected(method.key)}
              >
                <MaterialCommunityIcons
                  name={method.icon as any}
                  size={24}
                  color={isSelected ? palette.primary : palette.onSurfaceVariant}
                />
                <Text
                  variant="bodySmall"
                  color={isSelected ? palette.primary : palette.onSurfaceVariant}
                  style={[styles.methodText, isSelected && styles.methodTextSelected]}
                >
                  {t(method.labelKey)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Card form */}
        {showCardForm && (
          <Card marginBottom={16}>
            <View style={styles.fieldRow}>
              <MaterialCommunityIcons
                name="credit-card"
                size={20}
                color={palette.onSurfaceVariant}
              />
              <TextInput
                style={styles.fieldInput}
                value={cardDisplayValue}
                onChangeText={handleCardNumberChange}
                onFocus={() => setIsCardFocused(true)}
                onBlur={() => setIsCardFocused(false)}
                placeholder={t('payment.cardNumber')}
                placeholderTextColor={palette.onSurfaceVariant}
                keyboardType="number-pad"
                maxLength={19}
                returnKeyType="next"
                onSubmitEditing={() => nameRef.current?.focus()}
                blurOnSubmit={false}
                editable={formEnabled}
              />
            </View>
            <Divider />
            <View style={styles.fieldRow}>
              <MaterialCommunityIcons name="account" size={20} color={palette.onSurfaceVariant} />
              <TextInput
                ref={nameRef}
                style={styles.fieldInput}
                value={cardHolder}
                onChangeText={setCardHolder}
                placeholder={t('payment.cardHolder')}
                placeholderTextColor={palette.onSurfaceVariant}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => expiryRef.current?.focus()}
                blurOnSubmit={false}
                editable={formEnabled}
              />
            </View>
            <Divider />
            <View style={styles.fieldRowSplit}>
              <View style={styles.fieldHalf}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color={palette.onSurfaceVariant}
                />
                <TextInput
                  ref={expiryRef}
                  style={styles.fieldInput}
                  value={expiry}
                  onChangeText={handleExpiryChange}
                  placeholder={t('payment.expiry')}
                  placeholderTextColor={palette.onSurfaceVariant}
                  keyboardType="number-pad"
                  maxLength={5}
                  returnKeyType="next"
                  onSubmitEditing={() => cvvRef.current?.focus()}
                  blurOnSubmit={false}
                  editable={formEnabled}
                />
              </View>
              <View style={styles.fieldHalfDivider} />
              <View style={styles.fieldHalf}>
                <MaterialCommunityIcons name="lock" size={20} color={palette.onSurfaceVariant} />
                <TextInput
                  ref={cvvRef}
                  style={styles.fieldInput}
                  value={cvv}
                  onChangeText={text => setCvv(text.replace(/\D/g, '').slice(0, 3))}
                  placeholder={t('payment.cvv')}
                  placeholderTextColor={palette.onSurfaceVariant}
                  keyboardType="number-pad"
                  maxLength={3}
                  secureTextEntry
                  returnKeyType="done"
                  editable={formEnabled}
                />
              </View>
            </View>
          </Card>
        )}

        {/* Mini summary */}
        <Card marginBottom={16}>
          <Text variant="body" color={palette.onSurface} style={styles.summaryTitle}>
            {hotelName}
          </Text>
          <View style={styles.summaryRow}>
            <Text variant="bodySmall" color={palette.onSurfaceVariant} style={styles.summaryLabel}>
              {t('success.dates')}
            </Text>
            <Text variant="bodySmall" color={palette.onSurface} style={styles.summaryValue}>
              {formatDate(new Date(checkIn), 'short')} - {formatDate(new Date(checkOut), 'short')}
            </Text>
          </View>
          <Divider style={styles.summaryDividerSpacing} />
          <View style={styles.summaryRow}>
            <Text variant="body" color={palette.onSurface} style={styles.summaryTotalLabel}>
              {t('payment.total')}
            </Text>
            <Text variant="body" color={palette.onSurface} style={styles.summaryTotalValue}>
              {formatPrice(total)}
            </Text>
          </View>
        </Card>

        {/* Security note */}
        <View style={styles.securityRow}>
          <MaterialCommunityIcons name="lock" size={14} color={palette.onSurfaceVariant} />
          <Text variant="caption" color={palette.onSurfaceVariant} style={styles.securityText}>
            {t('payment.securityNote')}
          </Text>
        </View>
      </ScrollView>

      <ActionBar>
        <PrimaryButton
          title={
            loading
              ? t('payment.processingPayment')
              : t('payment.payButton', { amount: formatPrice(total) })
          }
          onPress={handlePay}
          loading={loading}
          disabled={isPayDisabled}
        />
      </ActionBar>
    </View>
  );
}
