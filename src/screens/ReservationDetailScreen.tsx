import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/types';
import { palette } from '../theme/palette';
import { useLocale } from '../contexts/LocaleContext';
import { mockReservations, pastReservations, cancelledReservations } from '../data/mockReservations';
import TopBar from '../components/TopBar';
import OfflineBanner from '../components/OfflineBanner';
import StatusChip from '../components/StatusChip';
import InfoGrid from '../components/InfoGrid';
import PriceBreakdown from '../components/PriceBreakdown';

const allReservations = [...mockReservations, ...pastReservations, ...cancelledReservations];

export default function ReservationDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<NativeStackScreenProps<RootStackParamList, 'ReservationDetail'>['route']>();
  const { t } = useTranslation('mobile');
  const { formatPrice, formatDate } = useLocale();

  const reservation = allReservations.find((r) => r.id === route.params.id) || allReservations[0];

  const accommodationCop = Math.round(reservation.totalPriceCop * 0.81);
  const taxesCop = reservation.totalPriceCop - accommodationCop;

  return (
    <View style={styles.container}>
      <OfflineBanner />
      <TopBar title={t('reservationDetail.title')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Status row */}
        <View style={styles.statusRow}>
          <StatusChip status={reservation.status} />
          <Text style={styles.code}>{reservation.code}</Text>
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
            <Text style={styles.hotelType}>{reservation.hotelType}</Text>
            <Text style={styles.hotelName}>{reservation.hotelName}</Text>
            <Text style={styles.hotelLocation}>{reservation.location}</Text>
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
                  label: 'Duracion',
                  value: `${reservation.nights} noches`,
                },
                {
                  label: 'Huespedes',
                  value: reservation.guests,
                },
              ]}
            />
          </View>
        </View>

        {/* Room card */}
        <View style={styles.card}>
          <View style={styles.cardInner}>
            <Text style={styles.roomLabel}>Habitacion</Text>
            <Text style={styles.roomValue}>{reservation.room}</Text>
          </View>
        </View>

        {/* Price breakdown */}
        <View style={styles.card}>
          <View style={styles.cardInner}>
            <Text style={styles.priceTitle}>Resumen de pago</Text>
            <PriceBreakdown
              rows={[
                { label: 'Alojamiento', value: formatPrice(accommodationCop) },
                { label: 'Impuestos y tasas', value: formatPrice(taxesCop) },
              ]}
              totalLabel="Total"
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
            <Text style={styles.primaryButtonText}>Mostrar QR</Text>
          </Pressable>
          <Pressable
            style={styles.errorButton}
            onPress={() => navigation.navigate('CancelReservation', { id: reservation.id })}
          >
            <Text style={styles.errorButtonText}>Cancelar reserva</Text>
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
    paddingTop: 16,
    paddingBottom: 24,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  code: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.outline,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.outlineVariant,
    marginBottom: 14,
  },
  cardInner: {
    padding: 16,
  },
  hotelGradient: {
    height: 120,
  },
  hotelInfo: {
    padding: 14,
  },
  hotelType: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: palette.primary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.onSurface,
    marginBottom: 4,
  },
  hotelLocation: {
    fontSize: 13,
    color: palette.onSurfaceVariant,
  },
  roomLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: palette.primary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  roomValue: {
    fontSize: 15,
    fontWeight: '500',
    color: palette.onSurface,
  },
  priceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.onSurface,
    marginBottom: 12,
  },
  buttonsColumn: {
    gap: 10,
    marginTop: 4,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: palette.primary,
    borderRadius: 12,
    paddingVertical: 14,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.onPrimary,
  },
  errorButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: palette.error,
    borderRadius: 12,
    paddingVertical: 14,
  },
  errorButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.error,
  },
});
