import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
import InfoGrid from '../components/InfoGrid';
import PriceBreakdown from '../components/PriceBreakdown';
import ReservationSummaryScreenSkeleton from './ReservationSummaryScreen.skeleton';

export default function ReservationSummaryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation('mobile');
  const { formatPrice, formatDate } = useLocale();

  const hotel = mockHotels[0];
  const checkIn = new Date('2026-03-20');
  const checkOut = new Date('2026-03-25');
  const nights = 5;
  const nightsTotal = hotel.pricePerNight * nights;
  const taxes = Math.round(nightsTotal * 0.19);
  const total = nightsTotal + taxes;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <TopBar title={t('summary.title')} onBack={() => navigation.goBack()} />

      {loading ? (
        <ScrollView style={styles.scroll}>
          <ReservationSummaryScreenSkeleton />
        </ScrollView>
      ) : (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Hotel card */}
        <View style={styles.card}>
          <View style={styles.hotelRow}>
            <LinearGradient
              colors={hotel.gradient as unknown as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.hotelGradient}
            />
            <View style={styles.hotelInfo}>
              <Text style={styles.hotelName}>{hotel.name}</Text>
              <Text style={styles.hotelLocation}>{hotel.location}</Text>
              <Text style={styles.hotelRoom}>{t('summary.roomInfo')}</Text>
            </View>
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.card}>
          <InfoGrid
            items={[
              {
                label: t('summary.checkIn'),
                value: formatDate(checkIn, 'shortWithDay'),
                sub: '3:00 PM',
              },
              {
                label: t('summary.checkOut'),
                value: formatDate(checkOut, 'shortWithDay'),
                sub: '12:00 PM',
              },
              {
                label: t('summary.duration'),
                value: t('summary.nights', { count: nights }),
              },
              {
                label: t('summary.guests'),
                value: t('summary.guestsValue', { count: 2 }),
              },
            ]}
          />
        </View>

        {/* Price Breakdown */}
        <View style={styles.card}>
          <Text style={styles.priceTitle}>{t('summary.priceDetail')}</Text>
          <PriceBreakdown
            rows={[
              { label: t('summary.nightsBreakdown', { count: nights, price: formatPrice(hotel.pricePerNight) }), value: formatPrice(nightsTotal) },
              { label: t('summary.taxes', { percent: 19 }), value: formatPrice(taxes) },
            ]}
            totalLabel={t('summary.total')}
            totalValue={formatPrice(total)}
          />
        </View>

        {/* Cancellation policy */}
        <View style={styles.cancellationCard}>
          <View style={styles.cancellationHeader}>
            <MaterialCommunityIcons name="shield-check" size={18} color={palette.success} />
            <Text style={styles.cancellationTitle}>{t('summary.freeCancellation')}</Text>
          </View>
          <Text style={styles.cancellationText}>
            {t('summary.cancellationPolicy')}
          </Text>
        </View>
      </ScrollView>
      )}

      {!loading && (
      <ActionBar>
        <Pressable
          style={styles.continueButton}
          onPress={() => navigation.navigate('Payment')}
        >
          <Text style={styles.continueButtonText}>{t('summary.continueToPayment')}</Text>
        </Pressable>
      </ActionBar>
      )}
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.outlineVariant,
    padding: 16,
    marginBottom: 12,
  },
  hotelRow: {
    flexDirection: 'row',
    gap: 12,
  },
  hotelGradient: {
    width: 64,
    height: 64,
    borderRadius: 10,
  },
  hotelInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  hotelName: {
    fontSize: 15,
    fontFamily: 'Roboto_700Bold',
    fontWeight: 'bold',
    color: palette.onSurface,
    marginBottom: 2,
  },
  hotelLocation: {
    fontSize: 12,
    fontFamily: 'Roboto_400Regular',
    color: palette.onSurfaceVariant,
    marginBottom: 2,
  },
  hotelRoom: {
    fontSize: 12,
    fontFamily: 'Roboto_500Medium',
    color: palette.primary,
  },
  priceTitle: {
    fontSize: 15,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    color: palette.onSurface,
    marginBottom: 12,
  },
  cancellationCard: {
    backgroundColor: palette.successContainer,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cancellationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cancellationTitle: {
    fontSize: 14,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    color: palette.success,
  },
  cancellationText: {
    fontSize: 13,
    fontFamily: 'Roboto_400Regular',
    color: palette.success,
    lineHeight: 19,
  },
  continueButton: {
    backgroundColor: palette.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 15,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    color: '#fff',
  },
});
