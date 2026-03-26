import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/types';
import { useCart } from '../api/hooks/useCart';
import { useLocale } from '../contexts/LocaleContext';
import { getCartSelection, CartSelection } from '../storage/cartStorage';
import { palette } from '../theme/palette';
import TopBar from '../components/TopBar';
import ActionBar from '../components/ActionBar';
import PriceBreakdown from '../components/PriceBreakdown';
import HotelSummaryCard from '../components/checkout/HotelSummaryCard';
import BookingInfoGrid from '../components/checkout/BookingInfoGrid';
import CancellationPolicyCard from '../components/checkout/CancellationPolicyCard';
import HoldCountdown from '../components/checkout/HoldCountdown';
import ReservationSummaryScreenSkeleton from './ReservationSummaryScreen.skeleton';

export default function ReservationSummaryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation('mobile');
  const { formatPrice } = useLocale();

  const [localSelection, setLocalSelection] = useState<CartSelection | null>(null);
  const { data: cart, isLoading, isError } = useCart();

  // Load local selection from AsyncStorage on mount for immediate display
  useEffect(() => {
    getCartSelection().then(setLocalSelection);
  }, []);

  const handleExpired = () => {
    Alert.alert(t('summary.holdExpired'), t('summary.holdExpiredMessage'), [
      { text: 'OK', onPress: () => navigation.navigate('MainTabs') },
    ]);
  };

  // If server sync failed after retries, alert and go back so the user can retry
  useEffect(() => {
    if (isError) {
      Alert.alert(t('summary.syncError'), t('summary.syncErrorMessage'), [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  }, [isError, navigation, t]);

  // Nothing to show yet — wait for at least local data to be read
  if (!localSelection && isLoading) {
    return (
      <View style={styles.container}>
        <TopBar title={t('summary.title')} onBack={() => navigation.goBack()} />
        <ScrollView style={styles.scroll}>
          <ReservationSummaryScreenSkeleton />
        </ScrollView>
      </View>
    );
  }

  // Prefer full server cart; fall back to local selection for basic info
  const hasServerCart = !isLoading && cart != null;

  return (
    <View style={styles.container}>
      <TopBar title={t('summary.title')} onBack={() => navigation.goBack()} />

      {/* HoldCountdown only available once server cart is loaded (holdExpiresAt comes from server) */}
      {hasServerCart && <HoldCountdown expiresAt={cart.holdExpiresAt} onExpired={handleExpired} />}

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <HotelSummaryCard
          hotelName={cart?.hotelName ?? ''}
          location={cart?.location ?? ''}
          roomName={cart?.roomName ?? ''}
        />

        <BookingInfoGrid
          checkIn={cart?.checkIn ?? localSelection?.checkIn ?? ''}
          checkOut={cart?.checkOut ?? localSelection?.checkOut ?? ''}
          nights={cart?.priceBreakdown.nights ?? 0}
          guests={cart?.guests ?? localSelection?.guests ?? 0}
        />

        {/* Price Breakdown — only when we have the full server cart */}
        {hasServerCart && (
          <View style={styles.card}>
            <Text style={styles.priceTitle}>{t('summary.priceDetail')}</Text>
            <PriceBreakdown
              rows={[
                {
                  label: t('summary.nightsBreakdown', {
                    count: cart.priceBreakdown.nights,
                    price: formatPrice(cart.priceBreakdown.pricePerNight),
                  }),
                  value: formatPrice(cart.priceBreakdown.subtotal),
                },
                {
                  label: t('summary.taxes', { percent: 19 }),
                  value: formatPrice(cart.priceBreakdown.vat),
                },
              ]}
              totalLabel={t('summary.total')}
              totalValue={formatPrice(cart.priceBreakdown.total)}
            />
          </View>
        )}

        <CancellationPolicyCard />
      </ScrollView>

      <ActionBar>
        <Pressable style={styles.continueButton} onPress={() => navigation.navigate('Payment')}>
          <Text style={styles.continueButtonText}>{t('summary.continueToPayment')}</Text>
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.outlineVariant,
    padding: 16,
    marginBottom: 12,
  },
  priceTitle: {
    fontSize: 15,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    color: palette.onSurface,
    marginBottom: 12,
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
