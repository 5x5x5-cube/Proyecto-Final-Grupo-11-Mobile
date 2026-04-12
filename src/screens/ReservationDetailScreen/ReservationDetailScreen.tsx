import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '@/navigation/types';
import { palette } from '@/theme/palette';
import { useLocale } from '@/contexts/LocaleContext';
import { useBookingDetail } from '@/api/hooks/useBookings';
import TopBar from '@/components/TopBar';
import OfflineBanner from '@/components/OfflineBanner';
import StatusChip from '@/components/StatusChip';
import InfoGrid from '@/components/InfoGrid';
import PriceBreakdown from '@/components/PriceBreakdown';
import Text from '@/components/Text';
import ReservationDetailScreenSkeleton from './ReservationDetailScreen.skeleton';
import { styles } from './ReservationDetailScreen.styles';

export default function ReservationDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route =
    useRoute<NativeStackScreenProps<RootStackParamList, 'ReservationDetail'>['route']>();
  const { t } = useTranslation('mobile');
  const { formatPrice, formatDate } = useLocale();

  const { data: reservationData, isLoading } = useBookingDetail(route.params.id ?? 1);
  const reservation = reservationData as any;

  if (isLoading || !reservation) {
    return (
      <View style={styles.container}>
        <OfflineBanner />
        <TopBar title={t('reservationDetail.title')} onBack={() => navigation.goBack()} />
        <ReservationDetailScreenSkeleton />
      </View>
    );
  }

  const accommodationCop = Math.round(reservation.totalPriceCop * 0.81);
  const taxesCop = reservation.totalPriceCop - accommodationCop;

  return (
    <View style={styles.container}>
      <OfflineBanner />
      <TopBar title={t('reservationDetail.title')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 24 + insets.bottom }]}>
        {/* Status row */}
        <View style={styles.statusRow}>
          <StatusChip status={reservation.status} />
          <Text variant="caption" color={palette.outline} style={styles.code}>
            {reservation.code}
          </Text>
        </View>

        {/* Hotel card */}
        <View style={styles.card}>
          <LinearGradient
            colors={[reservation.gradient[0], reservation.gradient[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hotelGradient}
          />
          <View style={styles.hotelInfo}>
            <Text variant="captionSmall" color={palette.primary} style={styles.hotelType}>
              {reservation.hotelType}
            </Text>
            <Text variant="subtitle" color={palette.onSurface} style={styles.hotelName}>
              {reservation.hotelName}
            </Text>
            <Text variant="bodySmall" color={palette.onSurfaceVariant} style={styles.hotelLocation}>
              {reservation.location}
            </Text>
          </View>
        </View>

        {/* Info grid */}
        <View style={styles.card}>
          <View style={styles.cardInner}>
            <InfoGrid
              items={[
                {
                  label: 'Check-in',
                  value: formatDate(reservation.checkIn, 'medium'),
                  sub: '3:00 PM',
                },
                {
                  label: 'Check-out',
                  value: formatDate(reservation.checkOut, 'medium'),
                  sub: '12:00 PM',
                },
                {
                  label: t('reservationDetail.duration'),
                  value: t('reservationDetail.nights', { count: reservation.nights }),
                },
                {
                  label: t('reservationDetail.guests'),
                  value: reservation.guests,
                },
              ]}
            />
          </View>
        </View>

        {/* Room card */}
        <View style={styles.card}>
          <View style={styles.cardInner}>
            <Text variant="captionSmall" color={palette.primary} style={styles.roomLabel}>
              {t('reservationDetail.room')}
            </Text>
            <Text variant="button" color={palette.onSurface} style={styles.roomValue}>
              {reservation.room}
            </Text>
          </View>
        </View>

        {/* Price breakdown */}
        <View style={styles.card}>
          <View style={styles.cardInner}>
            <Text variant="body" color={palette.onSurface} style={styles.priceTitle}>
              {t('reservationDetail.paymentSummary')}
            </Text>
            <PriceBreakdown
              rows={[
                {
                  label: t('reservationDetail.accommodation', { count: reservation.nights }),
                  value: formatPrice(accommodationCop),
                },
                { label: t('reservationDetail.taxes'), value: formatPrice(taxesCop) },
              ]}
              totalLabel={t('reservationDetail.totalPaid')}
              totalValue={formatPrice(reservation.totalPriceCop)}
            />
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.buttonsColumn}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => navigation.navigate('QRCheckIn', { id: reservation.id })}
          >
            <MaterialCommunityIcons name="qrcode" size={20} color={palette.onPrimary} />
            <Text variant="button" color={palette.onPrimary} style={styles.primaryButtonText}>
              {t('reservationDetail.showQR')}
            </Text>
          </Pressable>
          <Pressable
            style={styles.errorButton}
            onPress={() => navigation.navigate('CancelReservation', { id: reservation.id })}
          >
            <Text variant="button" color={palette.error} style={styles.errorButtonText}>
              {t('reservationDetail.cancelReservation')}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
