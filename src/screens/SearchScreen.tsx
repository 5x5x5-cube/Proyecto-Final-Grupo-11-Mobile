import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/types';
import { palette } from '../theme/palette';
import { useLocale } from '../contexts/LocaleContext';
import { useDestinations } from '../api/hooks/useSearch';
import Brand from '../components/Brand';
import PickerModal from '../components/PickerModal';
import DatePickerModal from '../components/DatePickerModal';
import GuestPickerModal from '../components/GuestPickerModal';

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
  const destinations = destinationsData ?? [];

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
        <Text style={styles.heroTitle}>{t('search.heroLine1')}</Text>
        <Text style={styles.heroTitle}>{t('search.heroLine2')}</Text>
        <Text style={styles.heroSubtitle}>{t('search.heroSubtitle')}</Text>

        <View style={styles.form}>
          <Pressable style={styles.field} onPress={() => setDestModal(true)}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={18}
              color={palette.onSurfaceVariant}
            />
            <Text style={styles.fieldText}>
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
              <Text style={styles.fieldText}>{formatDate(checkIn, 'short')}</Text>
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
              <Text style={styles.fieldText}>{formatDate(checkOut, 'short')}</Text>
            </Pressable>
          </View>

          <Pressable style={styles.field} onPress={() => setGuestModal(true)}>
            <MaterialCommunityIcons
              name="account-outline"
              size={18}
              color={palette.onSurfaceVariant}
            />
            <Text style={styles.fieldText}>{t('search.guests', { count: guests })}</Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={18}
              color={palette.onSurfaceVariant}
            />
          </Pressable>

          <Pressable style={styles.searchButton} onPress={() => navigation.navigate('Results')}>
            <MaterialCommunityIcons name="magnify" size={18} color={palette.onPrimaryContainer} />
            <Text style={styles.searchButtonText}>{t('search.searchButton')}</Text>
          </Pressable>
        </View>
      </LinearGradient>

      <View style={styles.destinationsSection}>
        <Text style={styles.sectionTitle}>{t('search.popularDestinations')}</Text>
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
                <Text style={styles.destName}>{item.name}</Text>
                <Text style={styles.destCountry}>{item.country}</Text>
                <Text style={styles.destCount}>
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.surface,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  brandRow: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  hero: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'Roboto_700Bold',
    color: '#fff',
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Roboto_400Regular',
    marginTop: 6,
    marginBottom: 20,
  },
  form: {
    gap: 10,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  fieldText: {
    fontSize: 14,
    color: palette.onSurface,
    fontFamily: 'Roboto_400Regular',
    flex: 1,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dateField: {
    flex: 1,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: palette.primaryContainer,
    borderRadius: 12,
    paddingVertical: 14,
  },
  searchButtonText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Roboto_500Medium',
    color: palette.onPrimaryContainer,
  },
  destinationsSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Roboto_700Bold',
    color: palette.onSurface,
    marginBottom: 14,
    paddingHorizontal: 20,
  },
  destinationsList: {
    gap: 10,
    paddingHorizontal: 20,
  },
  destCard: {
    minWidth: 130,
    height: 100,
    borderRadius: 14,
    padding: 14,
    justifyContent: 'flex-end',
  },
  destCardSelected: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  destName: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Roboto_700Bold',
    color: '#fff',
  },
  destCountry: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontFamily: 'Roboto_400Regular',
  },
  destCount: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Roboto_400Regular',
    marginTop: 2,
  },
});
