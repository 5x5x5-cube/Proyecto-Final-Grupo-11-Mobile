import React, { useRef } from 'react';
import { TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { palette } from '@/theme/palette';
import Card from '@/components/Card';
import Divider from '@/components/Divider';
import { styles } from './CardForm.styles';

export interface CardFormProps {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
  onCardNumberChange: (v: string) => void;
  onCardHolderChange: (v: string) => void;
  onExpiryChange: (v: string) => void;
  onCvvChange: (v: string) => void;
  disabled?: boolean;
  cardDisplayValue?: string;
  onCardFocus?: () => void;
  onCardBlur?: () => void;
}

export default function CardForm({
  cardHolder,
  expiry,
  cvv,
  onCardNumberChange,
  onCardHolderChange,
  onExpiryChange,
  onCvvChange,
  disabled = false,
  cardDisplayValue,
  onCardFocus,
  onCardBlur,
}: CardFormProps) {
  const { t } = useTranslation('mobile');
  const nameRef = useRef<TextInput>(null);
  const expiryRef = useRef<TextInput>(null);
  const cvvRef = useRef<TextInput>(null);

  return (
    <Card marginBottom={16}>
      <View style={styles.fieldRow}>
        <MaterialCommunityIcons name="credit-card" size={20} color={palette.onSurfaceVariant} />
        <TextInput
          style={styles.fieldInput}
          value={cardDisplayValue}
          onChangeText={onCardNumberChange}
          onFocus={onCardFocus}
          onBlur={onCardBlur}
          placeholder={t('payment.cardNumber')}
          placeholderTextColor={palette.onSurfaceVariant}
          keyboardType="number-pad"
          maxLength={19}
          returnKeyType="next"
          onSubmitEditing={() => nameRef.current?.focus()}
          blurOnSubmit={false}
          editable={!disabled}
        />
      </View>
      <Divider />
      <View style={styles.fieldRow}>
        <MaterialCommunityIcons name="account" size={20} color={palette.onSurfaceVariant} />
        <TextInput
          ref={nameRef}
          style={styles.fieldInput}
          value={cardHolder}
          onChangeText={onCardHolderChange}
          placeholder={t('payment.cardHolder')}
          placeholderTextColor={palette.onSurfaceVariant}
          autoCapitalize="words"
          returnKeyType="next"
          onSubmitEditing={() => expiryRef.current?.focus()}
          blurOnSubmit={false}
          editable={!disabled}
        />
      </View>
      <Divider />
      <View style={styles.fieldRowSplit}>
        <View style={styles.fieldHalf}>
          <MaterialCommunityIcons name="calendar" size={20} color={palette.onSurfaceVariant} />
          <TextInput
            ref={expiryRef}
            style={styles.fieldInput}
            value={expiry}
            onChangeText={onExpiryChange}
            placeholder={t('payment.expiry')}
            placeholderTextColor={palette.onSurfaceVariant}
            keyboardType="number-pad"
            maxLength={5}
            returnKeyType="next"
            onSubmitEditing={() => cvvRef.current?.focus()}
            blurOnSubmit={false}
            editable={!disabled}
          />
        </View>
        <View style={styles.fieldHalfDivider} />
        <View style={styles.fieldHalf}>
          <MaterialCommunityIcons name="lock" size={20} color={palette.onSurfaceVariant} />
          <TextInput
            ref={cvvRef}
            style={styles.fieldInput}
            value={cvv}
            onChangeText={onCvvChange}
            placeholder={t('payment.cvv')}
            placeholderTextColor={palette.onSurfaceVariant}
            keyboardType="number-pad"
            maxLength={3}
            secureTextEntry
            returnKeyType="done"
            editable={!disabled}
          />
        </View>
      </View>
    </Card>
  );
}
