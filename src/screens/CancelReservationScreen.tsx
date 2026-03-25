import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/types';
import { palette } from '../theme/palette';
import { useLocale } from '../contexts/LocaleContext';
import { useBookingDetail, useCancelBooking } from '../api/hooks/useBookings';
import TopBar from '../components/TopBar';

export default function CancelReservationScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route =
    useRoute<NativeStackScreenProps<RootStackParamList, 'CancelReservation'>['route']>();
  const { t } = useTranslation('mobile');
  const { formatPrice } = useLocale();

  const { data: reservationData } = useBookingDetail(route.params.id ?? 1);
  const cancelBooking = useCancelBooking();
  const reservation = (reservationData as any) ?? { code: '', totalPriceCop: 0 };

  return (
    <View style={styles.container}>
      <TopBar title={t('cancelReservation.title')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 24 + insets.bottom }]}>
        {/* Warning icon */}
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="alert" size={32} color={palette.error} />
        </View>

        {/* Title and code */}
        <Text style={styles.title}>{t('cancelReservation.title')}</Text>
        <Text style={styles.codeText}>{reservation.code}</Text>

        {/* Cancellation policy */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('cancelReservation.cancellationPolicy')}</Text>
          <Text style={styles.policyText}>{t('cancelReservation.cancellationPolicyText')}</Text>
        </View>

        {/* Refund detail */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('cancelReservation.refundDetail')}</Text>
          <View style={styles.refundRow}>
            <Text style={styles.refundLabel}>{t('cancelReservation.amountPaid')}</Text>
            <Text style={styles.refundValue}>{formatPrice(reservation.totalPriceCop)}</Text>
          </View>
          <View style={styles.refundRow}>
            <Text style={styles.refundLabel}>
              {t('cancelReservation.refund', { percent: 100 })}
            </Text>
            <Text style={styles.refundValue}>{formatPrice(reservation.totalPriceCop)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.refundRow}>
            <Text style={styles.totalLabel}>{t('cancelReservation.totalRefund')}</Text>
            <Text style={styles.totalValue}>{formatPrice(reservation.totalPriceCop)}</Text>
          </View>
        </View>

        {/* Refund method */}
        <View style={styles.card}>
          <View style={styles.methodRow}>
            <MaterialCommunityIcons
              name="credit-card-outline"
              size={20}
              color={palette.onSurfaceVariant}
            />
            <View style={styles.methodInfo}>
              <Text style={styles.methodCard}>VISA ****4242</Text>
              <Text style={styles.methodTime}>{t('cancelReservation.refundTime')}</Text>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonsRow}>
          <Pressable style={styles.outlinedButton} onPress={() => navigation.goBack()}>
            <Text style={styles.outlinedButtonText}>{t('cancelReservation.back')}</Text>
          </Pressable>
          <Pressable
            style={[styles.errorFilledButton, cancelBooking.isPending && { opacity: 0.6 }]}
            onPress={() => {
              cancelBooking.mutate(route.params.id ?? 1, {
                onSuccess: () => navigation.navigate('MainTabs'),
              });
            }}
            disabled={cancelBooking.isPending}
          >
            <Text style={styles.errorFilledButtonText}>{t('cancelReservation.confirm')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: palette.errorContainer,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.onSurface,
    textAlign: 'center',
    marginBottom: 4,
  },
  codeText: {
    fontSize: 13,
    color: palette.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.outlineVariant,
    padding: 16,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.onSurface,
    marginBottom: 8,
  },
  policyText: {
    fontSize: 12,
    color: palette.onSurfaceVariant,
    lineHeight: 19,
  },
  refundRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  refundLabel: {
    fontSize: 14,
    color: palette.onSurfaceVariant,
  },
  refundValue: {
    fontSize: 14,
    color: palette.onSurface,
  },
  divider: {
    height: 1,
    backgroundColor: palette.outlineVariant,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.onSurface,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.success,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodCard: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.onSurface,
    marginBottom: 2,
  },
  methodTime: {
    fontSize: 12,
    color: palette.onSurfaceVariant,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  outlinedButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: palette.outline,
    borderRadius: 12,
    paddingVertical: 14,
  },
  outlinedButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.onSurface,
  },
  errorFilledButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.error,
    borderRadius: 12,
    paddingVertical: 14,
  },
  errorFilledButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});
