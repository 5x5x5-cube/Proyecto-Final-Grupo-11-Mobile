import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { palette } from '../theme/palette';
import { useLocale } from '../contexts/LocaleContext';
import { mockReservations, pastReservations, cancelledReservations } from '../data/mockReservations';
import OfflineBanner from '../components/OfflineBanner';
import StatusChip from '../components/StatusChip';

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
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('active');

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'active', label: t('myReservations.active'), count: mockReservations.length },
    { key: 'past', label: t('myReservations.past'), count: pastReservations.length },
    { key: 'cancelled', label: t('myReservations.cancelled'), count: cancelledReservations.length },
  ];

  const dataMap: Record<Tab, Reservation[]> = {
    active: mockReservations as Reservation[],
    past: pastReservations as Reservation[],
    cancelled: cancelledReservations as Reservation[],
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
          <Text style={styles.hotelName} numberOfLines={1}>
            {item.hotelName}
          </Text>
          <StatusChip status={item.status} />
        </View>
        <Text style={styles.location} numberOfLines={1}>
          {item.location}
        </Text>
        <View style={styles.cardFooterRow}>
          <Text style={styles.dates}>
            {formatDate(item.checkIn, 'mediumWithDay')} — {formatDate(item.checkOut, 'mediumWithDay')}
          </Text>
          <Text style={styles.price}>{formatPrice(item.totalPriceCop)}</Text>
        </View>
        <Text style={styles.code}>{item.code}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <OfflineBanner />
      <Text style={styles.title}>{t('myReservations.title')}</Text>
      <View style={styles.tabBar}>
        {tabs.map((t) => (
          <Pressable
            key={t.key}
            style={[styles.tab, tab === t.key && styles.tabActive]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>
              {t.label} ({t.count})
            </Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={dataMap[tab]}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderCard}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.onSurface,
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 12,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: palette.outlineVariant,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -2,
  },
  tabActive: {
    borderBottomColor: palette.primary,
  },
  tabText: {
    fontSize: 14,
    color: palette.onSurfaceVariant,
    textAlign: 'center',
  },
  tabTextActive: {
    color: palette.primary,
    fontWeight: '600',
  },
  list: {
    padding: 16,
    gap: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.outlineVariant,
  },
  cardGradient: {
    height: 100,
  },
  cardBody: {
    padding: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  hotelName: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.onSurface,
    flex: 1,
    marginRight: 8,
  },
  location: {
    fontSize: 12,
    color: palette.onSurfaceVariant,
    marginBottom: 8,
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dates: {
    fontSize: 12,
    color: palette.onSurfaceVariant,
    flex: 1,
    marginRight: 8,
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.primary,
  },
  code: {
    fontSize: 11,
    color: palette.outline,
  },
});
