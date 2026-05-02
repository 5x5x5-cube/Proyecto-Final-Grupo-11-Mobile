import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '@/navigation/types';
import { palette } from '@/theme/palette';
import { useLocale } from '@/contexts/LocaleContext';
import { useBookingDetail, useCancelBooking } from '@/api/hooks/useBookings';
import TopBar from '@/components/TopBar';
import Text from '@/components/Text';
import Card from '@/components/Card';
import Divider from '@/components/Divider';
import { styles } from './CancelReservationScreen.styles';

export default function CancelReservationScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route =
    useRoute<NativeStackScreenProps<RootStackParamList, 'CancelReservation'>['route']>();
  const { t } = useTranslation('mobile');
  const { formatFixedPrice } = useLocale();

  const { data: reservationData } = useBookingDetail(route.params.id ?? 1);
  const cancelBooking = useCancelBooking();
  const reservation = (reservationData as any) ?? { code: '', totalPrice: 0 };
  const refundAmount = Number(reservation?.totalPrice ?? reservation?.totalPriceCop ?? 0);
  const fp = (amount: number) => formatFixedPrice(amount, reservation?.currency);

  return (
    <View style={styles.container}>
      <TopBar title={t('cancelReservation.title')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 24 + insets.bottom }]}>
        {/* Warning icon */}
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="alert" size={32} color={palette.error} />
        </View>

        {/* Title and code */}
        <Text variant="h3" color={palette.onSurface} style={styles.title}>
          {t('cancelReservation.title')}
        </Text>
        <Text variant="bodySmall" color={palette.onSurfaceVariant} style={styles.codeText}>
          {reservation.code}
        </Text>

        {/* Cancellation policy */}
        <Card marginBottom={14}>
          <Text variant="bodySmall" color={palette.onSurface} style={styles.cardTitle}>
            {t('cancelReservation.cancellationPolicy')}
          </Text>
          <Text variant="caption" color={palette.onSurfaceVariant} style={styles.policyText}>
            {t('cancelReservation.cancellationPolicyText')}
          </Text>
        </Card>

        {/* Refund detail */}
        <Card marginBottom={14}>
          <Text variant="bodySmall" color={palette.onSurface} style={styles.cardTitle}>
            {t('cancelReservation.refundDetail')}
          </Text>
          <View style={styles.refundRow}>
            <Text variant="body" color={palette.onSurfaceVariant}>
              {t('cancelReservation.amountPaid')}
            </Text>
            <Text variant="body" color={palette.onSurface}>
              {fp(refundAmount)}
            </Text>
          </View>
          <View style={styles.refundRow}>
            <Text variant="body" color={palette.onSurfaceVariant}>
              {t('cancelReservation.refund', { percent: 100 })}
            </Text>
            <Text variant="body" color={palette.onSurface}>
              {fp(refundAmount)}
            </Text>
          </View>
          <Divider style={styles.dividerSpacing} />
          <View style={styles.refundRow}>
            <Text variant="body" color={palette.onSurface}>
              {t('cancelReservation.totalRefund')}
            </Text>
            <Text variant="body" style={styles.totalValue}>
              {fp(refundAmount)}
            </Text>
          </View>
        </Card>

        {/* Refund method */}
        <Card marginBottom={14}>
          <View style={styles.methodRow}>
            <MaterialCommunityIcons
              name="credit-card-outline"
              size={20}
              color={palette.onSurfaceVariant}
            />
            <View style={styles.methodInfo}>
              <Text variant="body" color={palette.onSurface} style={styles.methodCard}>
                VISA ****4242
              </Text>
              <Text variant="caption" color={palette.onSurfaceVariant}>
                {t('cancelReservation.refundTime')}
              </Text>
            </View>
          </View>
        </Card>

        {/* Buttons */}
        <View style={styles.buttonsRow}>
          <Pressable style={styles.outlinedButton} onPress={() => navigation.goBack()}>
            <Text variant="button" color={palette.onSurface}>
              {t('cancelReservation.back')}
            </Text>
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
            <Text variant="button" color={palette.onPrimary}>
              {t('cancelReservation.confirm')}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
