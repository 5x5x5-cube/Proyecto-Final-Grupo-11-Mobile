import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  View,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/types';
import { useCart } from '../api/hooks/useCart';
import { useInitiatePayment } from '../api/hooks/usePayments';
import { useLocale } from '../contexts/LocaleContext';
import { palette } from '../theme/palette';
import TopBar from '../components/TopBar';
import ActionBar from '../components/ActionBar';
import HoldCountdown from '../components/checkout/HoldCountdown';

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
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const nameRef = useRef<TextInput>(null);
  const expiryRef = useRef<TextInput>(null);
  const cvvRef = useRef<TextInput>(null);

  const { data: cart } = useCart();
  const initiatePayment = useInitiatePayment();

  const hotelName = cart?.hotelName ?? '';
  const total = cart?.priceBreakdown?.total ?? 0;
  const checkIn = cart?.checkIn ?? '2026-03-20';
  const checkOut = cart?.checkOut ?? '2026-03-25';
  const loading = initiatePayment.isPending;

  const handleExpired = () => {
    Alert.alert(t('summary.holdExpired'), t('summary.holdExpiredMessage'), [
      { text: 'OK', onPress: () => navigation.navigate('MainTabs') },
    ]);
  };

  const showCardForm = selected === 'credit' || selected === 'debit';

  const isCardFormValid =
    cardNumber.length === 19 &&
    cardHolder.trim().length > 0 &&
    expiry.length === 5 &&
    cvv.length === 3;

  const isPayDisabled = loading || (showCardForm && !isCardFormValid);

  function handleCardNumberChange(text: string) {
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);
  }

  function handleExpiryChange(text: string) {
    const prev = expiry;
    // Allow deleting the slash naturally
    if (text.length < prev.length) {
      // If user deletes the slash, also remove the preceding digit
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
    initiatePayment.mutate(
      { cardNumber, cardHolder, expiry, cvv, method: selected, total },
      {
        onSuccess: (data: any) =>
          navigation.navigate('Success', {
            bookingCode: data?.bookingCode ?? 'TH-2026-48291',
            hotelName,
            checkIn,
            checkOut,
          }),
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
        <Text style={styles.methodLabel}>{t('payment.selectMethod')}</Text>

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
                <Text style={[styles.methodText, isSelected && styles.methodTextSelected]}>
                  {t(method.labelKey)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Card form */}
        {showCardForm && (
          <View style={styles.cardForm}>
            <View style={styles.fieldRow}>
              <MaterialCommunityIcons
                name="credit-card"
                size={20}
                color={palette.onSurfaceVariant}
              />
              <TextInput
                style={styles.fieldInput}
                value={cardNumber}
                onChangeText={handleCardNumberChange}
                placeholder={t('payment.cardNumber')}
                placeholderTextColor={palette.onSurfaceVariant}
                keyboardType="number-pad"
                maxLength={19}
                returnKeyType="next"
                onSubmitEditing={() => nameRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.fieldDivider} />
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
              />
            </View>
            <View style={styles.fieldDivider} />
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
                />
              </View>
            </View>
          </View>
        )}

        {/* Mini summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{hotelName}</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('success.dates')}</Text>
            <Text style={styles.summaryValue}>
              {formatDate(new Date(checkIn), 'short')} - {formatDate(new Date(checkOut), 'short')}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLabel}>{t('payment.total')}</Text>
            <Text style={styles.summaryTotalValue}>{formatPrice(total)}</Text>
          </View>
        </View>

        {/* Security note */}
        <View style={styles.securityRow}>
          <MaterialCommunityIcons name="lock" size={14} color={palette.onSurfaceVariant} />
          <Text style={styles.securityText}>{t('payment.securityNote')}</Text>
        </View>
      </ScrollView>

      <ActionBar>
        <Pressable
          style={({ pressed }) => [
            styles.payButton,
            isPayDisabled && styles.payButtonDisabled,
            pressed && !isPayDisabled && { opacity: 0.8 },
          ]}
          onPress={handlePay}
          disabled={isPayDisabled}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>
              {t('payment.payButton', { amount: formatPrice(total) })}
            </Text>
          )}
        </Pressable>
      </ActionBar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.surface,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 90,
  },
  methodLabel: {
    fontSize: 15,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    color: palette.onSurface,
    marginBottom: 12,
  },
  methodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  methodCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.outlineVariant,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  methodCardSelected: {
    borderColor: palette.primary,
    borderWidth: 2,
    backgroundColor: palette.primaryContainer,
  },
  methodText: {
    fontSize: 13,
    fontFamily: 'Roboto_500Medium',
    color: palette.onSurfaceVariant,
  },
  methodTextSelected: {
    color: palette.primary,
  },
  cardForm: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.outlineVariant,
    padding: 16,
    marginBottom: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  fieldInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: palette.onSurface,
    padding: 0,
  },
  fieldDivider: {
    height: 1,
    backgroundColor: palette.outlineVariant,
  },
  fieldRowSplit: {
    flexDirection: 'row',
    gap: 0,
    paddingVertical: 8,
  },
  fieldHalf: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fieldHalfDivider: {
    width: 1,
    backgroundColor: palette.outlineVariant,
    marginHorizontal: 8,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.outlineVariant,
    padding: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 14,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    color: palette.onSurface,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: 'Roboto_400Regular',
    color: palette.onSurfaceVariant,
  },
  summaryValue: {
    fontSize: 13,
    fontFamily: 'Roboto_400Regular',
    color: palette.onSurface,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: palette.outlineVariant,
    marginVertical: 8,
  },
  summaryTotalLabel: {
    fontSize: 14,
    fontFamily: 'Roboto_700Bold',
    fontWeight: 'bold',
    color: palette.onSurface,
  },
  summaryTotalValue: {
    fontSize: 14,
    fontFamily: 'Roboto_700Bold',
    fontWeight: 'bold',
    color: palette.onSurface,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  securityText: {
    fontSize: 12,
    fontFamily: 'Roboto_400Regular',
    color: palette.onSurfaceVariant,
  },
  payButton: {
    backgroundColor: palette.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  payButtonDisabled: {
    opacity: 0.5,
  },
  payButtonText: {
    fontSize: 15,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    color: '#fff',
  },
});
