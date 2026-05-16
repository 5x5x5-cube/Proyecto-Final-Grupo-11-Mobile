import React, { useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Card from '@/components/Card';
import Divider from '@/components/Divider';
import PickerModal from '@/components/PickerModal';
import Text from '@/components/Text';
import { palette } from '@/theme/palette';
import { styles } from './TransferForm.styles';

type BankCode = 'bancolombia' | 'bogota' | 'davivienda' | 'bbva' | 'popular';

export interface TransferFormProps {
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
  onBankChange: (code: string) => void;
  onAccountNumberChange: (num: string) => void;
  onAccountHolderChange: (name: string) => void;
  disabled?: boolean;
}

const BANKS: { code: BankCode; name: string }[] = [
  { code: 'bancolombia', name: 'Bancolombia' },
  { code: 'bogota', name: 'Banco de Bogotá' },
  { code: 'davivienda', name: 'Davivienda' },
  { code: 'bbva', name: 'BBVA' },
  { code: 'popular', name: 'Banco Popular' },
];

const MIN_ACCOUNT_DIGITS = 6;
const MAX_ACCOUNT_DIGITS = 20;

export default function TransferForm({
  bankCode,
  accountNumber,
  accountHolder,
  onBankChange,
  onAccountNumberChange,
  onAccountHolderChange,
  disabled = false,
}: TransferFormProps) {
  const { t } = useTranslation('mobile');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [accountTouched, setAccountTouched] = useState(false);

  const bankOptions = BANKS.map(b => ({ key: b.code, label: b.name }));

  const selectedBankLabel = BANKS.find(b => b.code === bankCode)?.name ?? t('payment.selectBank');

  const isAccountValid =
    accountNumber.length >= MIN_ACCOUNT_DIGITS && accountNumber.length <= MAX_ACCOUNT_DIGITS;
  const showAccountError = accountTouched && accountNumber.length > 0 && !isAccountValid;

  function handleAccountNumberChange(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, MAX_ACCOUNT_DIGITS);
    onAccountNumberChange(digits);
  }

  return (
    <>
      <Card marginBottom={16}>
        {/* Bank selector */}
        <Pressable
          style={styles.fieldRow}
          onPress={() => !disabled && setPickerVisible(true)}
          disabled={disabled}
          accessibilityLabel={t('payment.selectBank')}
          testID="transfer-bank-picker"
        >
          <MaterialCommunityIcons name="bank" size={20} color={palette.onSurfaceVariant} />
          <Text
            variant="body"
            color={bankCode ? palette.onSurface : palette.onSurfaceVariant}
            style={styles.pickerText}
          >
            {selectedBankLabel}
          </Text>
          <MaterialCommunityIcons name="chevron-down" size={18} color={palette.onSurfaceVariant} />
        </Pressable>

        <Divider />

        {/* Account number */}
        <View style={styles.fieldRow}>
          <MaterialCommunityIcons name="numeric" size={20} color={palette.onSurfaceVariant} />
          <TextInput
            style={styles.fieldInput}
            value={accountNumber}
            onChangeText={handleAccountNumberChange}
            onBlur={() => setAccountTouched(true)}
            placeholder={t('payment.accountNumber')}
            placeholderTextColor={palette.onSurfaceVariant}
            keyboardType="number-pad"
            maxLength={MAX_ACCOUNT_DIGITS}
            editable={!disabled}
            testID="transfer-account-number-input"
          />
        </View>

        {showAccountError && (
          <Text variant="caption" color={palette.error} style={styles.errorText}>
            {t('payment.accountNumberInvalid')}
          </Text>
        )}

        <Divider />

        {/* Account holder */}
        <View style={styles.fieldRow}>
          <MaterialCommunityIcons name="account" size={20} color={palette.onSurfaceVariant} />
          <TextInput
            style={styles.fieldInput}
            value={accountHolder}
            onChangeText={onAccountHolderChange}
            placeholder={t('payment.accountHolder')}
            placeholderTextColor={palette.onSurfaceVariant}
            autoCapitalize="words"
            editable={!disabled}
            testID="transfer-account-holder-input"
          />
        </View>
      </Card>

      <PickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        options={bankOptions}
        selected={bankCode as BankCode}
        onSelect={value => {
          onBankChange(value);
          setPickerVisible(false);
        }}
        title={t('payment.selectBank')}
      />
    </>
  );
}
