import React, { useState } from 'react';
import { View, FlatList, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '@/navigation/types';
import { palette } from '@/theme/palette';
import { useLocale } from '@/contexts/LocaleContext';
import { useBookings, usePastBookings, useCancelledBookings } from '@/api/hooks/useBookings';
import OfflineBanner from '@/components/OfflineBanner';
import StatusChip from '@/components/StatusChip';
import Text from '@/components/Text';
import MyReservationsScreenSkeleton from './MyReservationsScreen.skeleton';
import { styles } from './MyReservationsScreen.styles';

type Tab = 'active' | 'past' | 'cancelled';

type Reservation = {
  id: number;
  hotelType: string;
  hotelName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: string;
  room: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'past';
  code: string;
  totalPrice: string;
  totalPriceCop: number;
  gradient: readonly [string, string];
};

export default function MyReservationsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation('mobile');
  const { formatPrice, formatDate } = useLocale();
  const [tab, setTab] = useState<Tab>('active');
  const { data: activeData, isLoading: loadingActive } = useBookings();
  const { data: pastData, isLoading: loadingPast } = usePastBookings();
  const { data: cancelledData, isLoading: loadingCancelled } = useCancelledBookings();

  // Backend returns { data: [...], total, page, limit }, extract data array
  const activeReservations = (activeData as any)?.data ?? [];
  const pastReservations = (pastData as any)?.data ?? [];
  const cancelledReservations = (cancelledData as any)?.data ?? [];
  const isLoading = loadingActive || loadingPast || loadingCancelled;

  // Map backend fields to frontend format
  const mapReservation = (b: any): Reservation => ({
    id: b.id,
    hotelType: 'Hotel',
    hotelName: `Hotel ${b.hotelId}`, // Backend doesn't return hotel name, use ID
    location: 'Unknown', // Backend doesn't return location
    checkIn: b.checkIn,
    checkOut: b.checkOut,
    nights: 0, // Calculate if needed
    guests: b.guests,
    room: `Room ${b.roomId}`, // Backend doesn't return room name
    status: b.status,
    code: b.code,
    totalPrice: `${b.totalPrice} ${b.currency}`,
    totalPriceCop: b.totalPrice,
    gradient: ['#006874', '#4A9FAA'] as const, // Default gradient
  });

  const activeReservationsMapped = activeReservations.map(mapReservation);
  const pastReservationsMapped = pastReservations.map(mapReservation);
  const cancelledReservationsMapped = cancelledReservations.map(mapReservation);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'active', label: t('myReservations.active'), count: activeReservationsMapped.length },
    { key: 'past', label: t('myReservations.past'), count: pastReservationsMapped.length },
    { key: 'cancelled', label: t('myReservations.cancelled'), count: cancelledReservationsMapped.length },
  ];

  const dataMap: Record<Tab, Reservation[]> = {
    active: activeReservationsMapped,
    past: pastReservationsMapped,
    cancelled: cancelledReservationsMapped,
  };

  const renderCard = ({ item }: { item: Reservation }) => (
    <Pressable
      style={styles.card}
      onPress={() => navigation.navigate('ReservationDetail', { id: item.id })}
    >
      <LinearGradient
        colors={[item.gradient[0], item.gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      />
      <View style={styles.cardBody}>
        <View style={styles.cardHeaderRow}>
          <Text variant="body" color={palette.onSurface} style={styles.hotelName} numberOfLines={1}>
            {item.hotelName}
          </Text>
          <StatusChip status={item.status} />
        </View>
        <Text
          variant="caption"
          color={palette.onSurfaceVariant}
          style={styles.location}
          numberOfLines={1}
        >
          {item.location}
        </Text>
        <View style={styles.cardFooterRow}>
          <Text variant="caption" color={palette.onSurfaceVariant} style={styles.dates}>
            {formatDate(item.checkIn, 'mediumWithDay')} —{' '}
            {formatDate(item.checkOut, 'mediumWithDay')}
          </Text>
          <Text variant="bodySmall" color={palette.primary} style={styles.price}>
            {formatPrice(item.totalPriceCop)}
          </Text>
        </View>
        <Text variant="captionSmall" color={palette.outline} style={styles.code}>
          {item.code}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <OfflineBanner />
      <Text variant="h2" color={palette.onSurface} style={styles.title}>
        {t('myReservations.title')}
      </Text>
      <View style={styles.tabBar}>
        {tabs.map(t => (
          <Pressable
            key={t.key}
            style={[styles.tab, tab === t.key && styles.tabActive]}
            onPress={() => setTab(t.key)}
          >
            <Text
              variant="body"
              color={tab === t.key ? palette.primary : palette.onSurfaceVariant}
              style={[styles.tabText, tab === t.key && styles.tabTextActive]}
            >
              {t.label} ({t.count})
            </Text>
          </Pressable>
        ))}
      </View>
      {isLoading ? (
        <MyReservationsScreenSkeleton />
      ) : (
        <FlatList
          data={dataMap[tab]}
          keyExtractor={item => String(item.id)}
          renderItem={renderCard}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}
