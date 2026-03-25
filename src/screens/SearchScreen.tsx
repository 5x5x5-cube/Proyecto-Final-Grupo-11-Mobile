import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/types';
import { palette } from '../theme/palette';
import { useLocale } from '../contexts/LocaleContext';
import { mockDestinations } from '../data/mockDestinations';
import Brand from '../components/Brand';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function SearchScreen() {
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation('mobile');
  const { formatDate } = useLocale();

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
          <View style={styles.field}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={18}
              color={palette.onSurfaceVariant}
            />
            <Text style={styles.fieldText}>Cartagena, Colombia</Text>
          </View>

          <View style={styles.dateRow}>
            <View style={[styles.field, styles.dateField]}>
              <MaterialCommunityIcons
                name="calendar-outline"
                size={18}
                color={palette.onSurfaceVariant}
              />
              <Text style={styles.fieldText}>
                {formatDate('2026-03-15', 'short')}
              </Text>
            </View>
            <View style={[styles.field, styles.dateField]}>
              <MaterialCommunityIcons
                name="calendar-outline"
                size={18}
                color={palette.onSurfaceVariant}
              />
              <Text style={styles.fieldText}>
                {formatDate('2026-03-20', 'short')}
              </Text>
            </View>
          </View>

          <View style={styles.field}>
            <MaterialCommunityIcons
              name="account-outline"
              size={18}
              color={palette.onSurfaceVariant}
            />
            <Text style={styles.fieldText}>
              {t('search.guests', { count: 2 })}
            </Text>
          </View>

          <Pressable
            style={styles.searchButton}
            onPress={() => navigation.navigate('Results')}
          >
            <MaterialCommunityIcons
              name="magnify"
              size={18}
              color={palette.onPrimaryContainer}
            />
            <Text style={styles.searchButtonText}>
              {t('search.searchButton')}
            </Text>
          </Pressable>
        </View>
      </LinearGradient>

      <View style={styles.destinationsSection}>
        <Text style={styles.sectionTitle}>{t('search.popularDestinations')}</Text>
        <FlatList
          data={mockDestinations}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.destinationsList}
          renderItem={({ item }) => (
            <LinearGradient
              colors={[...item.gradient]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.destCard}
            >
              <Text style={styles.destName}>{item.name}</Text>
              <Text style={styles.destCountry}>{item.country}</Text>
              <Text style={styles.destCount}>
                {t('search.hotels', { count: item.hotelCount })}
              </Text>
            </LinearGradient>
          )}
        />
      </View>
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
