import React from 'react';
import { ActivityIndicator, View, Pressable, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '@/navigation/types';
import { useLocale } from '@/contexts/LocaleContext';
import { usePaymentStatus } from '@/api/hooks/usePayments';
import { useBookingByPaymentId } from '@/api/hooks/useBookings';
import { useHotelDetail } from '@/api/hooks/useSearch';
import { palette } from '@/theme/palette';
import Text from '@/components/Text';
import Card from '@/components/Card';
import PrimaryButton from '@/components/PrimaryButton';
import { styles } from './SuccessScreen.styles';

export default function SuccessScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<NativeStackScreenProps<RootStackParamList, 'Success'>['route']>();
  const { t } = useTranslation('mobile');
  const { formatDate, formatPrice } = useLocale();

  const { paymentId } = route.params;
  const { data: payment } = usePaymentStatus(paymentId);
  const { data: booking } = useBookingByPaymentId(paymentId);
  const { data: hotel } = useHotelDetail(booking?.hotelId ?? '') as {
    data: { name?: string; city?: string; country?: string } | undefined;
  };

  const nights =
    booking?.checkIn && booking?.checkOut
      ? Math.ceil(
          (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const location =
    hotel?.city && hotel?.country ? `${hotel.city}, ${hotel.country}` : (hotel?.city ?? '');

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.container, { paddingTop: 48 }]}
    >
      {/* Success icon */}
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons name="check-circle" size={40} color={palette.success} />
      </View>

      <Text variant="h2" color={palette.onSurface} style={styles.title}>
        {t('success.title')}
      </Text>
      <Text variant="bodySmall" color={palette.onSurfaceVariant} style={styles.subtitle}>
        {t('success.subtitle')}
      </Text>

      {/* Reservation code */}
      <View style={styles.codeBadge}>
        <Text variant="label" color={palette.primary} style={styles.codeLabel}>
          {t('success.reservationCode')}
        </Text>
        {booking?.code ? (
          <Text variant="subtitle" color={palette.onPrimaryContainer}>
            {booking.code}
          </Text>
        ) : (
          <ActivityIndicator size="small" color={palette.primary} />
        )}
      </View>

      {/* Summary card */}
      <Card style={styles.summaryCardWidth} marginBottom={24}>
        <View style={styles.summaryRow}>
          <Text variant="bodySmall" color={palette.onSurfaceVariant}>
            {t('success.hotel')}
          </Text>
          <Text variant="label" color={palette.onSurface} style={styles.summaryValue}>
            {hotel?.name ?? '...'}
          </Text>
        </View>
        {location ? (
          <View style={styles.summaryRow}>
            <Text variant="bodySmall" color={palette.onSurfaceVariant}>
              {t('success.location')}
            </Text>
            <Text variant="label" color={palette.onSurface} style={styles.summaryValue}>
              {location}
            </Text>
          </View>
        ) : null}
        <View style={styles.summaryRow}>
          <Text variant="bodySmall" color={palette.onSurfaceVariant}>
            {t('success.dates')}
          </Text>
          <Text variant="label" color={palette.onSurface} style={styles.summaryValue}>
            {booking
              ? `${formatDate(new Date(booking.checkIn), 'short')} - ${formatDate(new Date(booking.checkOut), 'short')}`
              : '...'}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text variant="bodySmall" color={palette.onSurfaceVariant}>
            {t('success.guests')}
          </Text>
          <Text variant="label" color={palette.onSurface} style={styles.summaryValue}>
            {booking ? t('success.guestsValue', { count: booking.guests }) : '...'}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text variant="bodySmall" color={palette.onSurfaceVariant}>
            {t('success.nights')}
          </Text>
          <Text variant="label" color={palette.onSurface} style={styles.summaryValue}>
            {nights > 0 ? t('success.nightsValue', { count: nights }) : '...'}
          </Text>
        </View>
        {payment && (
          <View style={styles.summaryRow}>
            <Text variant="bodySmall" color={palette.onSurfaceVariant}>
              {t('success.totalPaid')}
            </Text>
            <Text variant="label" color={palette.primary} style={styles.summaryValue}>
              {formatPrice(payment.amount)}
            </Text>
          </View>
        )}
      </Card>

      {/* Actions */}
      <View style={styles.primaryButtonWrapper}>
        <PrimaryButton
          title={t('success.viewReservations')}
          onPress={() => navigation.navigate('MainTabs', { screen: 'MyReservations' })}
        />
      </View>

      <Pressable onPress={() => navigation.navigate('MainTabs', { screen: 'Search' })}>
        <Text variant="body" color={palette.primary}>
          {t('success.backToHome')}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
