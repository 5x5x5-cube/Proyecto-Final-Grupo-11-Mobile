import React, { useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Card from '@/components/Card';
import Divider from '@/components/Divider';
import PickerModal from '@/components/PickerModal';
import Text from '@/components/Text';
import { palette } from '@/theme/palette';
import { styles } from './WalletForm.styles';

export type WalletProvider = 'paypal' | 'google_pay' | 'apple_pay';

export interface WalletFormProps {
  provider: string;
  email: string;
  onProviderChange: (provider: string) => void;
  onEmailChange: (email: string) => void;
  disabled?: boolean;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function WalletForm({
  provider,
  email,
  onProviderChange,
  onEmailChange,
  disabled = false,
}: WalletFormProps) {
  const { t } = useTranslation('mobile');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const providerOptions: { key: WalletProvider; label: string }[] = [
    { key: 'paypal', label: t('payment.providerPayPal') },
    { key: 'google_pay', label: t('payment.providerGooglePay') },
    { key: 'apple_pay', label: t('payment.providerApplePay') },
  ];

  const selectedLabel =
    providerOptions.find(o => o.key === provider)?.label ?? t('payment.selectProvider');

  const isEmailValid = EMAIL_REGEX.test(email);
  const showEmailError = emailTouched && email.length > 0 && !isEmailValid;

  return (
    <>
      <Card marginBottom={16}>
        {/* Provider selector */}
        <Pressable
          style={styles.fieldRow}
          onPress={() => !disabled && setPickerVisible(true)}
          disabled={disabled}
          accessibilityLabel={t('payment.walletProvider')}
          testID="wallet-provider-picker"
        >
          <MaterialCommunityIcons name="wallet" size={20} color={palette.onSurfaceVariant} />
          <Text
            variant="body"
            color={provider ? palette.onSurface : palette.onSurfaceVariant}
            style={styles.pickerText}
          >
            {selectedLabel}
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={18}
            color={palette.onSurfaceVariant}
          />
        </Pressable>

        <Divider />

        {/* Email field */}
        <View style={styles.fieldRow}>
          <MaterialCommunityIcons name="email-outline" size={20} color={palette.onSurfaceVariant} />
          <TextInput
            style={styles.fieldInput}
            value={email}
            onChangeText={text => onEmailChange(text.trim())}
            onBlur={() => setEmailTouched(true)}
            placeholder={t('payment.walletEmailPlaceholder')}
            placeholderTextColor={palette.onSurfaceVariant}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!disabled}
            testID="wallet-email-input"
          />
        </View>

        {showEmailError && (
          <Text variant="caption" color={palette.error} style={styles.errorText}>
            {t('payment.walletEmailInvalid')}
          </Text>
        )}
      </Card>

      <PickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        options={providerOptions}
        selected={provider as WalletProvider}
        onSelect={value => {
          onProviderChange(value);
          setPickerVisible(false);
        }}
        title={t('payment.walletProvider')}
      />
    </>
  );
}
