import React, { useState } from 'react';
import { View, Pressable, ScrollView, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '@/navigation/types';
import { palette } from '@/theme/palette';
import { useLocale } from '@/contexts/LocaleContext';
import { useDestinations } from '@/api/hooks/useSearch';
import Brand from '@/components/Brand';
import PickerModal from '@/components/PickerModal';
import DatePickerModal from '@/components/DatePickerModal';
import GuestPickerModal from '@/components/GuestPickerModal';
import Text from '@/components/Text';
import { styles } from './SearchScreen.styles';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const checkInOptions = [
  { key: 'ci1', label: '15 Mar 2026', date: '2026-03-15' },
  { key: 'ci2', label: '20 Mar 2026', date: '2026-03-20' },
  { key: 'ci3', label: '1 Abr 2026', date: '2026-04-01' },
  { key: 'ci4', label: '10 Abr 2026', date: '2026-04-10' },
  { key: 'ci5', label: '1 May 2026', date: '2026-05-01' },
];

const checkOutOptions = [
  { key: 'co1', label: '20 Mar 2026', date: '2026-03-20' },
  { key: 'co2', label: '25 Mar 2026', date: '2026-03-25' },
  { key: 'co3', label: '5 Abr 2026', date: '2026-04-05' },
  { key: 'co4', label: '15 Abr 2026', date: '2026-04-15' },
  { key: 'co5', label: '7 May 2026', date: '2026-05-07' },
];

export default function SearchScreen() {
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation('mobile');
  const { formatDate } = useLocale();
  const { data: destinationsData } = useDestinations();
  const destinations = Array.isArray(destinationsData) ? destinationsData : [];

  const [destination, setDestination] = useState('Cartagena');
  const [checkIn, setCheckIn] = useState('2026-03-15');
  const [checkOut, setCheckOut] = useState('2026-03-20');
  const [guests, setGuests] = useState(2);

  const [destModal, setDestModal] = useState(false);
  const [checkInModal, setCheckInModal] = useState(false);
  const [checkOutModal, setCheckOutModal] = useState(false);
  const [guestModal, setGuestModal] = useState(false);

  const destinationOptions = destinations.map(d => ({
    key: d.name,
    label: `${d.name}, ${d.country}`,
  }));

  const selectedCountry = destinations.find(d => d.name === destination)?.country ?? '';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <View style={styles.brandRow}>
        <Brand size={22} variant="nav" />
      </View>

      <LinearGradient
        colors={[palette.primary, palette.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text variant="h1" color={palette.onPrimary} style={styles.heroTitle}>
          {t('search.heroLine1')}
        </Text>
        <Text variant="h1" color={palette.onPrimary} style={styles.heroTitle}>
          {t('search.heroLine2')}
        </Text>
        <Text variant="bodySmall" color="rgba(255,255,255,0.8)" style={styles.heroSubtitle}>
          {t('search.heroSubtitle')}
        </Text>

        <View style={styles.form}>
          <Pressable style={styles.field} onPress={() => setDestModal(true)}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={18}
              color={palette.onSurfaceVariant}
            />
            <Text variant="body" color={palette.onSurface} style={styles.fieldText}>
              {destination}, {selectedCountry}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={18}
              color={palette.onSurfaceVariant}
            />
          </Pressable>

          <View style={styles.dateRow}>
            <Pressable
              style={[styles.field, styles.dateField]}
              onPress={() => setCheckInModal(true)}
            >
              <MaterialCommunityIcons
                name="calendar-outline"
                size={18}
                color={palette.onSurfaceVariant}
              />
              <Text variant="body" color={palette.onSurface} style={styles.fieldText}>
                {formatDate(checkIn, 'short')}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.field, styles.dateField]}
              onPress={() => setCheckOutModal(true)}
            >
              <MaterialCommunityIcons
                name="calendar-outline"
                size={18}
                color={palette.onSurfaceVariant}
              />
              <Text variant="body" color={palette.onSurface} style={styles.fieldText}>
                {formatDate(checkOut, 'short')}
              </Text>
            </Pressable>
          </View>

          <Pressable style={styles.field} onPress={() => setGuestModal(true)}>
            <MaterialCommunityIcons
              name="account-outline"
              size={18}
              color={palette.onSurfaceVariant}
            />
            <Text variant="body" color={palette.onSurface} style={styles.fieldText}>
              {t('search.guests', { count: guests })}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={18}
              color={palette.onSurfaceVariant}
            />
          </Pressable>

          <Pressable style={styles.searchButton} onPress={() => navigation.navigate('Results')}>
            <MaterialCommunityIcons name="magnify" size={18} color={palette.onPrimaryContainer} />
            <Text variant="button" color={palette.onPrimaryContainer}>
              {t('search.searchButton')}
            </Text>
          </Pressable>
        </View>
      </LinearGradient>

      <View style={styles.destinationsSection}>
        <Text variant="h3" color={palette.onSurface} style={styles.sectionTitle}>
          {t('search.popularDestinations')}
        </Text>
        <FlatList
          data={destinations}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.name}
          contentContainerStyle={styles.destinationsList}
          renderItem={({ item }) => (
            <Pressable onPress={() => setDestination(item.name)}>
              <LinearGradient
                colors={[...item.gradient]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.destCard, item.name === destination && styles.destCardSelected]}
              >
                <Text variant="button" color={palette.onPrimary}>
                  {item.name}
                </Text>
                <Text variant="caption" color="rgba(255,255,255,0.85)">
                  {item.country}
                </Text>
                <Text variant="captionSmall" color="rgba(255,255,255,0.7)" style={styles.destCount}>
                  {t('search.hotels', { count: item.hotelCount })}
                </Text>
              </LinearGradient>
            </Pressable>
          )}
        />
      </View>

      {/* Modals */}
      <PickerModal
        visible={destModal}
        onClose={() => setDestModal(false)}
        options={destinationOptions}
        selected={destination}
        onSelect={setDestination}
        title={t('search.heroSubtitle')}
      />
      <DatePickerModal
        visible={checkInModal}
        onClose={() => setCheckInModal(false)}
        options={checkInOptions}
        selected={checkIn}
        onSelect={setCheckIn}
        title={t('search.checkIn')}
      />
      <DatePickerModal
        visible={checkOutModal}
        onClose={() => setCheckOutModal(false)}
        options={checkOutOptions}
        selected={checkOut}
        onSelect={setCheckOut}
        title={t('search.checkOut')}
      />
      <GuestPickerModal
        visible={guestModal}
        onClose={() => setGuestModal(false)}
        value={guests}
        onChange={setGuests}
        title={t('search.guests', { count: guests })}
        doneLabel="OK"
      />
    </ScrollView>
  );
}
