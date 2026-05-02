import React from 'react';
import { ActivityIndicator, ScrollView, View, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useLocale } from '@/contexts/LocaleContext';
import { palette } from '@/theme/palette';
import Text from '@/components/Text';
import TopBar from '@/components/TopBar';
import ActionBar from '@/components/ActionBar';
import HoldCountdown from '@/modules/checkout/HoldCountdown';
import CardForm from '@/modules/checkout/CardForm';
import WalletForm from '@/modules/checkout/WalletForm';
import TransferForm from '@/modules/checkout/TransferForm';
import Card from '@/components/Card';
import Divider from '@/components/Divider';
import PrimaryButton from '@/components/PrimaryButton';
import { usePaymentFlow } from '@/modules/checkout/hooks/usePaymentFlow';
import { usePaymentMethodForm } from '@/modules/checkout/hooks/usePaymentMethodForm';
import type { UIPaymentMethod } from '@/modules/checkout/hooks/usePaymentMethodForm';
import { styles } from './PaymentScreen.styles';

const paymentMethods: { key: UIPaymentMethod; labelKey: string; icon: string }[] = [
  { key: 'credit', labelKey: 'payment.creditCard', icon: 'credit-card' },
  { key: 'debit', labelKey: 'payment.debitCard', icon: 'bank' },
  { key: 'wallet', labelKey: 'payment.digitalWallet', icon: 'wallet' },
  { key: 'transfer', labelKey: 'payment.transfer', icon: 'swap-horizontal' },
];

export default function PaymentScreen() {
  const { t } = useTranslation('mobile');
  const { formatFixedPrice, formatDate } = useLocale();

  const flow = usePaymentFlow();
  const form = usePaymentMethodForm();

  if (flow.isCartLoading || !flow.cart) {
    return (
      <View style={styles.container}>
        <TopBar title={t('payment.title')} onBack={flow.goBack} />
        <ActivityIndicator style={{ marginTop: 32 }} color={palette.primary} />
      </View>
    );
  }

  const { hotelName, checkIn, checkOut } = flow.cart;
  const total = Number(flow.cart.pricing?.total ?? flow.cart.priceBreakdown?.total ?? 0);
  const cartCurrency =
    flow.cart.pricing?.currency ??
    (flow.cart.priceBreakdown as { currency?: string } | undefined)?.currency;

  const isPayDisabled = flow.isProcessing || !flow.formEnabled || !form.isFormValid;

  function handlePay() {
    if (isPayDisabled) return;
    const payload = form.buildTokenizePayload();
    const method = form.getApiMethod();
    flow.submitPayment(payload, method);
  }

  return (
    <View style={styles.container}>
      <TopBar title={t('payment.title')} onBack={flow.goBack} />

      {flow.cart?.holdExpiresAt && (
        <HoldCountdown expiresAt={flow.cart.holdExpiresAt} onExpired={flow.handleExpired} />
      )}

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text variant="button" color={palette.onSurface} style={styles.methodLabel}>
          {t('payment.selectMethod')}
        </Text>

        {/* Payment methods grid */}
        <View style={styles.methodGrid}>
          {paymentMethods.map(method => {
            const isSelected = form.selected === method.key;
            return (
              <Pressable
                key={method.key}
                style={({ pressed }) => [
                  styles.methodCard,
                  isSelected && styles.methodCardSelected,
                  pressed && { opacity: 0.8 },
                ]}
                onPress={() => form.setSelected(method.key)}
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

        {/* Form per selected method */}
        {form.showCardForm && (
          <CardForm
            cardNumber={form.rawCardNumber}
            cardHolder={form.cardHolder}
            expiry={form.expiry}
            cvv={form.cvv}
            onCardNumberChange={form.handleCardNumberChange}
            onCardHolderChange={form.setCardHolder}
            onExpiryChange={form.handleExpiryChange}
            onCvvChange={form.handleCvvChange}
            disabled={!flow.formEnabled}
            cardDisplayValue={form.cardDisplayValue}
            onCardFocus={() => form.setIsCardFocused(true)}
            onCardBlur={() => form.setIsCardFocused(false)}
          />
        )}

        {form.showWalletForm && (
          <WalletForm
            provider={form.walletProvider}
            email={form.walletEmail}
            onProviderChange={form.setWalletProvider}
            onEmailChange={form.setWalletEmail}
            disabled={!flow.formEnabled}
          />
        )}

        {form.showTransferForm && (
          <TransferForm
            bankCode={form.bankCode}
            accountNumber={form.accountNumber}
            accountHolder={form.accountHolder}
            onBankChange={form.setBankCode}
            onAccountNumberChange={form.setAccountNumber}
            onAccountHolderChange={form.setAccountHolder}
            disabled={!flow.formEnabled}
          />
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
              {formatFixedPrice(total, cartCurrency)}
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
            flow.isProcessing
              ? t('payment.processingPayment')
              : t('payment.payButton', { amount: formatFixedPrice(total, cartCurrency) })
          }
          onPress={handlePay}
          loading={flow.isProcessing}
          disabled={isPayDisabled}
        />
      </ActionBar>
    </View>
  );
}
