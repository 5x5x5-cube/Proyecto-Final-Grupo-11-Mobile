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

  // Map backend fields to frontend format
  const mappedReservation = reservation
    ? {
        ...reservation,
        gradient: ['#006874', '#4A9FAA'] as const,
        hotelType: 'Hotel',
        hotelName: reservation.hotelName ?? reservation.code,
        location: reservation.location ?? '',
        nights: reservation.nights ?? 0,
        room: reservation.roomName ?? '',
        totalPriceCop: reservation.totalPrice,
      }
    : null;

  if (isLoading || !mappedReservation) {
    return (
      <View style={styles.container}>
        <OfflineBanner />
        <TopBar title={t('reservationDetail.title')} onBack={() => navigation.goBack()} />
        <ReservationDetailScreenSkeleton />
      </View>
    );
  }

  const pb = mappedReservation.priceBreakdown;
  const accommodationCop = pb ? Number(pb.basePrice) : Math.round(mappedReservation.totalPriceCop * 0.81);
  const taxesCop = pb ? Number(pb.vat) + Number(pb.serviceFee || 0) : mappedReservation.totalPriceCop - accommodationCop;

  return (
    <View style={styles.container}>
      <OfflineBanner />
      <TopBar title={t('reservationDetail.title')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 24 + insets.bottom }]}>
        {/* Status row */}
        <View style={styles.statusRow}>
          <StatusChip status={mappedReservation.status} />
          <Text variant="caption" color={palette.outline} style={styles.code}>
            {mappedReservation.code}
          </Text>
        </View>

        {/* Hotel card */}
        <View style={styles.card}>
          <LinearGradient
            colors={[mappedReservation.gradient[0], mappedReservation.gradient[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hotelGradient}
          />
          <View style={styles.hotelInfo}>
            <Text variant="captionSmall" color={palette.primary} style={styles.hotelType}>
              {mappedReservation.hotelType}
            </Text>
            <Text variant="subtitle" color={palette.onSurface} style={styles.hotelName}>
              {mappedReservation.hotelName}
            </Text>
            <Text variant="bodySmall" color={palette.onSurfaceVariant} style={styles.hotelLocation}>
              {mappedReservation.location}
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
                  value: formatDate(mappedReservation.checkIn, 'medium'),
                  sub: '3:00 PM',
                },
                {
                  label: 'Check-out',
                  value: formatDate(mappedReservation.checkOut, 'medium'),
                  sub: '12:00 PM',
                },
                {
                  label: t('reservationDetail.duration'),
                  value: t('reservationDetail.nights', { count: mappedReservation.nights }),
                },
                {
                  label: t('reservationDetail.guests'),
                  value: mappedReservation.guests,
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
              {mappedReservation.room}
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
                  label: t('reservationDetail.accommodation', { count: mappedReservation.nights }),
                  value: formatPrice(accommodationCop),
                },
                { label: t('reservationDetail.taxes'), value: formatPrice(taxesCop) },
              ]}
              totalLabel={t('reservationDetail.totalPaid')}
              totalValue={formatPrice(mappedReservation.totalPriceCop)}
            />
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.buttonsColumn}>
          {mappedReservation.status === 'confirmed' && (
            <Pressable
              style={styles.primaryButton}
              onPress={() => navigation.navigate('QRCheckIn', { id: mappedReservation.id })}
            >
              <MaterialCommunityIcons name="qrcode" size={20} color={palette.onPrimary} />
              <Text variant="button" color={palette.onPrimary} style={styles.primaryButtonText}>
                {t('reservationDetail.showQR')}
              </Text>
            </Pressable>
          )}
          <Pressable
            style={styles.errorButton}
            onPress={() => navigation.navigate('CancelReservation', { id: mappedReservation.id })}
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
