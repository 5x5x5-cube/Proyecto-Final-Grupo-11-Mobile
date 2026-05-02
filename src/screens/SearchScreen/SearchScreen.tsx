import React, { useState, useMemo } from 'react';
import { View, Pressable, ScrollView, FlatList, Alert } from 'react-native';
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

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function toIso(date: Date): string {
  return date.toISOString().split('T')[0];
}

const FALLBACK_GRADIENT: readonly [string, string] = ['#006874', '#4A9FAA'];

function parseGradient(gradient: unknown): readonly [string, string] {
  if (Array.isArray(gradient) && gradient.length >= 2) {
    return [gradient[0], gradient[1]];
  }
  if (typeof gradient === 'string') {
    const hexMatches = gradient.match(/#[0-9a-fA-F]{3,8}/g);
    if (hexMatches && hexMatches.length >= 2) {
      return [hexMatches[0], hexMatches[1]];
    }
  }
  return FALLBACK_GRADIENT;
}

export default function SearchScreen() {
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation('mobile');
  const { formatDate } = useLocale();
  const { data: destinationsData } = useDestinations();
  const destinations = Array.isArray(destinationsData) ? destinationsData : [];

  const [destination, setDestination] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);

  const [destModal, setDestModal] = useState(false);
  const [checkInModal, setCheckInModal] = useState(false);
  const [checkOutModal, setCheckOutModal] = useState(false);
  const [guestModal, setGuestModal] = useState(false);

  const destinationOptions = destinations.map(d => ({
    key: d.name,
    label: `${d.name}, ${d.country}`,
  }));

  const selectedDest = destinations.find(d => d.name === destination);
  const selectedCountry = selectedDest?.country ?? '';

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const checkInOptions = useMemo(
    () => [
      { key: 'ci0', label: t('search.today'), date: toIso(today) },
      { key: 'ci1', label: t('search.tomorrow'), date: toIso(addDays(today, 1)) },
      { key: 'ci2', label: t('search.inDays', { count: 3 }), date: toIso(addDays(today, 3)) },
      { key: 'ci3', label: t('search.inWeek'), date: toIso(addDays(today, 7)) },
      { key: 'ci4', label: t('search.inWeeks', { count: 2 }), date: toIso(addDays(today, 14)) },
    ],
    [today, t]
  );

  const checkOutOptions = useMemo(() => {
    const base = checkIn ? new Date(checkIn) : today;
    return [
      { key: 'co0', label: t('search.plusDay'), date: toIso(addDays(base, 1)) },
      { key: 'co1', label: t('search.plusDays', { count: 2 }), date: toIso(addDays(base, 2)) },
      { key: 'co2', label: t('search.plusDays', { count: 3 }), date: toIso(addDays(base, 3)) },
      { key: 'co3', label: t('search.plusWeek'), date: toIso(addDays(base, 7)) },
      { key: 'co4', label: t('search.plusWeeks', { count: 2 }), date: toIso(addDays(base, 14)) },
    ];
  }, [checkIn, today, t]);

  const handleCheckIn = (dateIso: string) => {
    setCheckIn(dateIso);
    if (checkOut && checkOut <= dateIso) {
      setCheckOut(null);
    }
  };

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
            <Text
              variant="body"
              color={destination ? palette.onSurface : palette.onSurfaceVariant}
              style={styles.fieldText}
            >
              {destination ? `${destination}, ${selectedCountry}` : t('search.heroSubtitle')}
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
              <Text
                variant="body"
                color={checkIn ? palette.onSurface : palette.onSurfaceVariant}
                style={styles.fieldText}
              >
                {checkIn ? formatDate(checkIn, 'short') : t('search.selectDate')}
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
              <Text
                variant="body"
                color={checkOut ? palette.onSurface : palette.onSurfaceVariant}
                style={styles.fieldText}
              >
                {checkOut ? formatDate(checkOut, 'short') : t('search.selectDate')}
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

          <Pressable
            style={styles.searchButton}
            onPress={() => {
              if (!destination) {
                Alert.alert(t('search.errorDestination'));
                return;
              }
              if (!checkIn) {
                Alert.alert(t('search.errorCheckIn'));
                return;
              }
              if (!checkOut) {
                Alert.alert(t('search.errorCheckOut'));
                return;
              }
              navigation.navigate('Results', {
                destination: destination ?? '',
                checkIn: checkIn ?? '',
                checkOut: checkOut ?? '',
                guests,
              });
            }}
          >
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
                colors={[...parseGradient(item.gradient)]}
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
        selected={destination ?? ''}
        onSelect={setDestination}
        title={t('search.heroSubtitle')}
      />
      <DatePickerModal
        visible={checkInModal}
        onClose={() => setCheckInModal(false)}
        options={checkInOptions}
        selected={checkIn ?? ''}
        onSelect={handleCheckIn}
        title={t('search.checkIn')}
      />
      <DatePickerModal
        visible={checkOutModal}
        onClose={() => setCheckOutModal(false)}
        options={checkOutOptions}
        selected={checkOut ?? ''}
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
