import React, { useEffect, useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '@/navigation/types';
import { useCart } from '@/api/hooks/useCart';
import { useLocale } from '@/contexts/LocaleContext';
import { getCartSelection, CartSelection } from '@/storage/cartStorage';
import { palette } from '@/theme/palette';
import Text from '@/components/Text';
import TopBar from '@/components/TopBar';
import ActionBar from '@/components/ActionBar';
import PriceBreakdown from '@/components/PriceBreakdown';
import Card from '@/components/Card';
import PrimaryButton from '@/components/PrimaryButton';
import HotelSummaryCard from '@/modules/checkout/HotelSummaryCard';
import BookingInfoGrid from '@/modules/checkout/BookingInfoGrid';
import CancellationPolicyCard from '@/modules/checkout/CancellationPolicyCard';
import HoldCountdown from '@/modules/checkout/HoldCountdown';
import ReservationSummaryScreenSkeleton from './ReservationSummaryScreen.skeleton';
import { styles } from './ReservationSummaryScreen.styles';

export default function ReservationSummaryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation('mobile');
  const { formatFixedPrice } = useLocale();

  const [localSelection, setLocalSelection] = useState<CartSelection | null>(null);
  const { data: cart, isLoading, isError } = useCart();

  // Load local selection from AsyncStorage on mount for immediate display
  useEffect(() => {
    getCartSelection().then(setLocalSelection);
  }, []);

  const handleExpired = () => {
    Alert.alert(t('summary.holdExpired'), t('summary.holdExpiredMessage'), [
      { text: t('common.ok'), onPress: () => navigation.navigate('MainTabs') },
    ]);
  };

  // If server sync failed after retries, alert and go back so the user can retry
  useEffect(() => {
    if (isError) {
      Alert.alert(t('summary.syncError'), t('summary.syncErrorMessage'), [
        { text: t('common.ok'), onPress: () => navigation.goBack() },
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
      {hasServerCart && cart.holdExpiresAt && (
        <HoldCountdown expiresAt={cart.holdExpiresAt} onExpired={handleExpired} />
      )}

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {hasServerCart && (
          <HotelSummaryCard
            hotelName={cart.hotelName}
            location={cart.location ?? ''}
            roomName={cart.roomName}
          />
        )}

        <BookingInfoGrid
          checkIn={cart?.checkIn ?? localSelection?.checkIn ?? ''}
          checkOut={cart?.checkOut ?? localSelection?.checkOut ?? ''}
          nights={cart?.pricing?.nights ?? cart?.priceBreakdown?.nights ?? 0}
          guests={cart?.guests ?? localSelection?.guests ?? 0}
        />

        {/* Price Breakdown — only when we have the full server cart */}
        {hasServerCart && (
          <Card>
            <Text variant="button" color={palette.onSurface} style={styles.priceTitle}>
              {t('summary.priceDetail')}
            </Text>
            <PriceBreakdown
              rows={[
                {
                  label: t('summary.nightsBreakdown', {
                    count: cart.pricing.nights,
                    price: formatFixedPrice(cart.pricing.pricePerNight, cart.pricing.currency),
                  }),
                  value: formatFixedPrice(cart.pricing.subtotal, cart.pricing.currency),
                },
                {
                  label: t('summary.taxes', { percent: 19 }),
                  value: formatFixedPrice(cart.pricing.taxes, cart.pricing.currency),
                },
              ]}
              totalLabel={t('summary.total')}
              totalValue={formatFixedPrice(cart.pricing.total, cart.pricing.currency)}
            />
          </Card>
        )}

        <CancellationPolicyCard />
      </ScrollView>

      <ActionBar>
        <PrimaryButton
          title={t('summary.continueToPayment')}
          onPress={() => navigation.navigate('Payment')}
        />
      </ActionBar>
    </View>
  );
}
