import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/types';
import { mockHotels } from '../data/mockHotels';
import { useLocale } from '../contexts/LocaleContext';
import { palette } from '../theme/palette';
import TopBar from '../components/TopBar';
import ActionBar from '../components/ActionBar';

type PaymentMethod = 'credit' | 'debit' | 'wallet' | 'transfer';

const paymentMethods: { key: PaymentMethod; label: string; icon: string }[] = [
  { key: 'credit', label: 'Credito', icon: 'credit-card' },
  { key: 'debit', label: 'Debito', icon: 'bank' },
  { key: 'wallet', label: 'Billetera', icon: 'wallet' },
  { key: 'transfer', label: 'Transferencia', icon: 'swap-horizontal' },
];

export default function PaymentScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation('mobile');
  const { formatPrice, formatDate } = useLocale();
  const [selected, setSelected] = useState<PaymentMethod>('credit');

  const hotel = mockHotels[0];
  const nights = 5;
  const nightsTotal = hotel.pricePerNight * nights;
  const taxes = Math.round(nightsTotal * 0.19);
  const total = nightsTotal + taxes;

  const showCardForm = selected === 'credit' || selected === 'debit';

  return (
    <View style={styles.container}>
      <TopBar title={t('payment.title')} onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.methodLabel}>Selecciona un metodo</Text>

        {/* Payment methods grid */}
        <View style={styles.methodGrid}>
          {paymentMethods.map((method) => {
            const isSelected = selected === method.key;
            return (
              <Pressable
                key={method.key}
                style={[
                  styles.methodCard,
                  isSelected && styles.methodCardSelected,
                ]}
                onPress={() => setSelected(method.key)}
              >
                <MaterialCommunityIcons
                  name={method.icon as any}
                  size={24}
                  color={isSelected ? palette.primary : palette.onSurfaceVariant}
                />
                <Text
                  style={[
                    styles.methodText,
                    isSelected && styles.methodTextSelected,
                  ]}
                >
                  {method.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Card form */}
        {showCardForm && (
          <View style={styles.cardForm}>
            <View style={styles.fieldRow}>
              <MaterialCommunityIcons name="credit-card" size={20} color={palette.onSurfaceVariant} />
              <Text style={styles.fieldValue}>4242 {'\u2022\u2022\u2022\u2022'} {'\u2022\u2022\u2022\u2022'} {'\u2022\u2022\u2022\u2022'}</Text>
            </View>
            <View style={styles.fieldDivider} />
            <View style={styles.fieldRow}>
              <MaterialCommunityIcons name="account" size={20} color={palette.onSurfaceVariant} />
              <Text style={styles.fieldValue}>Carlos Martinez</Text>
            </View>
            <View style={styles.fieldDivider} />
            <View style={styles.fieldRowSplit}>
              <View style={styles.fieldHalf}>
                <MaterialCommunityIcons name="calendar" size={20} color={palette.onSurfaceVariant} />
                <Text style={styles.fieldValue}>12/28</Text>
              </View>
              <View style={styles.fieldHalf}>
                <MaterialCommunityIcons name="lock" size={20} color={palette.onSurfaceVariant} />
                <Text style={styles.fieldValue}>{'\u2022\u2022\u2022'}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Mini summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{hotel.name}</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Fechas</Text>
            <Text style={styles.summaryValue}>
              {formatDate(new Date('2026-03-20'), 'short')} - {formatDate(new Date('2026-03-25'), 'short')}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>{formatPrice(total)}</Text>
          </View>
        </View>

        {/* Security note */}
        <View style={styles.securityRow}>
          <MaterialCommunityIcons name="lock" size={14} color={palette.onSurfaceVariant} />
          <Text style={styles.securityText}>Pago seguro con encriptacion SSL de 256 bits</Text>
        </View>
      </ScrollView>

      <ActionBar>
        <Pressable
          style={styles.payButton}
          onPress={() => navigation.navigate('Success')}
        >
          <Text style={styles.payButtonText}>Pagar {formatPrice(total)}</Text>
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
  fieldValue: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: palette.onSurface,
  },
  fieldDivider: {
    height: 1,
    backgroundColor: palette.outlineVariant,
  },
  fieldRowSplit: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 8,
  },
  fieldHalf: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  payButtonText: {
    fontSize: 15,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    color: '#fff',
  },
});
