import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/types';
import { palette } from '../theme/palette';
import { useLocale } from '../contexts/LocaleContext';
import { useSearchHotels } from '../api/hooks/useSearch';
import FilterChip from '../components/FilterChip';
import ResultsScreenSkeleton from './ResultsScreen.skeleton';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ResultsScreen() {
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation('mobile');
  const { formatDate, formatPrice } = useLocale();
  const { data: hotelsData, isLoading } = useSearchHotels();
  const hotels = (hotelsData as any[]) ?? [];

  const dateRange = `${formatDate('2026-03-15', 'short')}-${formatDate('2026-03-20', 'short')}`;

  return (
    <View style={styles.screen}>
      {/* Custom top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color={palette.onSurface}
          />
        </Pressable>
        <Text style={styles.topBarText} numberOfLines={1}>
          Cartagena · {dateRange} · 2
        </Text>
      </View>

      {/* Filters */}
      <View style={styles.filtersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          <FilterChip label={t('results.filterPrice')} />
          <FilterChip label={t('results.filterType')} />
          <FilterChip label={t('results.filterRating')} selected />
          <FilterChip label={t('results.filterServices')} />
          <View style={styles.sortIcon}>
            <MaterialCommunityIcons
              name="sort-variant"
              size={20}
              color={palette.onSurfaceVariant}
            />
          </View>
        </ScrollView>
      </View>

      {/* Results count */}
      <Text style={styles.resultsCount}>
        {t('results.count', { count: hotels.length })}
      </Text>

      {/* Hotel list */}
      {isLoading ? <ResultsScreenSkeleton /> : (
      <FlatList
        data={hotels}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate('PropertyDetail', { id: item.id })}
          >
            <LinearGradient
              colors={item.gradient as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardImage}
            >
              <View style={styles.badgeRow}>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>{item.type}</Text>
                </View>
                <View style={styles.photoBadge}>
                  <MaterialCommunityIcons
                    name="camera-outline"
                    size={12}
                    color="#fff"
                  />
                  <Text style={styles.photoBadgeText}>{item.photoCount}</Text>
                </View>
              </View>
            </LinearGradient>

            <View style={styles.cardBody}>
              <Text style={styles.hotelName}>{item.name}</Text>
              <Text style={styles.hotelLocation}>{item.location}</Text>

              <View style={styles.bottomRow}>
                <View style={styles.ratingRow}>
                  <MaterialCommunityIcons
                    name="star"
                    size={14}
                    color={palette.star}
                  />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                  <Text style={styles.reviewText}>
                    ({item.reviewCount} {t('results.reviews')})
                  </Text>
                </View>

                <View style={styles.priceBlock}>
                  <Text style={styles.priceText}>
                    {formatPrice(item.pricePerNight)}
                  </Text>
                  <Text style={styles.perNight}>/{t('results.perNight')}</Text>
                </View>
              </View>
            </View>
          </Pressable>
        )}
      />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.surface,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: palette.outlineVariant,
  },
  backBtn: {
    padding: 2,
  },
  topBarText: {
    fontSize: 14,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    color: palette.onSurface,
    flex: 1,
  },
  filtersWrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: palette.outlineVariant,
  },
  filtersContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sortIcon: {
    padding: 6,
  },
  resultsCount: {
    fontSize: 12,
    color: palette.onSurfaceVariant,
    fontFamily: 'Roboto_400Regular',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    height: 140,
    justifyContent: 'flex-end',
    padding: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  typeBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 11,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    color: '#fff',
  },
  photoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  photoBadgeText: {
    fontSize: 11,
    fontFamily: 'Roboto_400Regular',
    color: '#fff',
  },
  cardBody: {
    padding: 14,
  },
  hotelName: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Roboto_500Medium',
    color: palette.onSurface,
  },
  hotelLocation: {
    fontSize: 12,
    color: palette.onSurfaceVariant,
    fontFamily: 'Roboto_400Regular',
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Roboto_500Medium',
    color: palette.onSurface,
  },
  reviewText: {
    fontSize: 12,
    color: palette.onSurfaceVariant,
    fontFamily: 'Roboto_400Regular',
  },
  priceBlock: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Roboto_700Bold',
    color: palette.primary,
  },
  perNight: {
    fontSize: 11,
    color: palette.onSurfaceVariant,
    fontFamily: 'Roboto_400Regular',
  },
});
