import React, { useState } from 'react';
import { View, Pressable, FlatList, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '@/navigation/types';
import { palette } from '@/theme/palette';
import { useLocale } from '@/contexts/LocaleContext';
import { useSearchHotels } from '@/api/hooks/useSearch';
import FilterChip from '@/components/FilterChip';
import PickerModal from '@/components/PickerModal';
import Text from '@/components/Text';
import ResultsScreenSkeleton from './ResultsScreen.skeleton';
import { styles } from './ResultsScreen.styles';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ResultsScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProp<RootStackParamList, 'Results'>>();
  const { destination, checkIn, checkOut, guests } = route.params;
  const { t } = useTranslation('mobile');
  const { formatDate, formatPrice } = useLocale();

  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sortPickerVisible, setSortPickerVisible] = useState(false);
  const [ratingPickerVisible, setRatingPickerVisible] = useState(false);
  const [pricePickerVisible, setPricePickerVisible] = useState(false);
  const [typePickerVisible, setTypePickerVisible] = useState(false);

  const { data: hotelsData, isLoading } = useSearchHotels(
    destination
      ? {
          destination,
          checkIn,
          checkOut,
          guests: guests ?? undefined,
          ...(minRating ? { minRating } : {}),
        }
      : undefined
  );

  const dateRange =
    checkIn && checkOut ? `${formatDate(checkIn, 'short')}-${formatDate(checkOut, 'short')}` : '';

  const hotels = (hotelsData as any[]) ?? [];
  let displayList = [...hotels];
  if (minPrice != null) displayList = displayList.filter(h => h.pricePerNight >= minPrice);
  if (maxPrice != null) displayList = displayList.filter(h => h.pricePerNight <= maxPrice);
  if (selectedType) displayList = displayList.filter(h => h.type === selectedType);
  if (sortBy === 'priceLowToHigh') displayList.sort((a, b) => a.pricePerNight - b.pricePerNight);
  else if (sortBy === 'priceHighToLow')
    displayList.sort((a, b) => b.pricePerNight - a.pricePerNight);
  else if (sortBy === 'rating') displayList.sort((a, b) => b.rating - a.rating);

  const sortOptions: { key: string; label: string }[] = [
    { key: 'recommended', label: t('results.sortRecommended') },
    { key: 'priceLowToHigh', label: t('results.sortPriceLow') },
    { key: 'priceHighToLow', label: t('results.sortPriceHigh') },
    { key: 'rating', label: t('results.sortRating') },
  ];

  const ratingOptions: { key: string; label: string }[] = [
    { key: 'none', label: t('results.filterRating') },
    { key: '4', label: '4+' },
    { key: '3', label: '3+' },
  ];

  const priceOptions: { key: string; label: string }[] = [
    { key: 'none', label: t('results.filterPrice') },
    { key: '0-200000', label: `< ${formatPrice(200000)}` },
    { key: '200000-500000', label: `${formatPrice(200000)} - ${formatPrice(500000)}` },
    { key: '500000-99999999', label: `> ${formatPrice(500000)}` },
  ];

  const typeOptions: { key: string; label: string }[] = [
    { key: 'none', label: t('results.filterType') },
    { key: 'Hotel', label: 'Hotel' },
    { key: 'Hostal', label: 'Hostal' },
    { key: 'Resort', label: 'Resort' },
  ];

  const minRatingKey = minRating ? String(minRating) : 'none';
  const priceKey = minPrice != null && maxPrice != null ? `${minPrice}-${maxPrice}` : 'none';
  const typeKey = selectedType ?? 'none';

  return (
    <View style={styles.screen}>
      {/* Custom top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={palette.onSurface} />
        </Pressable>
        <Text variant="label" color={palette.onSurface} numberOfLines={1} style={styles.topBarText}>
          {destination ?? ''}
          {dateRange ? ` · ${dateRange}` : ''}
          {guests ? ` · ${guests}` : ''}
        </Text>
      </View>

      {/* Filters */}
      <View style={styles.filtersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          <FilterChip
            label={
              minPrice != null
                ? (priceOptions.find(o => o.key === priceKey)?.label ?? t('results.filterPrice'))
                : t('results.filterPrice')
            }
            selected={minPrice != null}
            onPress={() => setPricePickerVisible(true)}
          />
          <FilterChip
            label={selectedType ?? t('results.filterType')}
            selected={selectedType != null}
            onPress={() => setTypePickerVisible(true)}
          />
          <FilterChip
            label={minRating ? `${minRating}+` : t('results.filterRating')}
            selected={minRating !== null}
            onPress={() => setRatingPickerVisible(true)}
          />
          <FilterChip label={t('results.filterServices')} onPress={() => {}} />
          <Pressable style={styles.sortIcon} onPress={() => setSortPickerVisible(true)}>
            <MaterialCommunityIcons
              name="sort-variant"
              size={20}
              color={palette.onSurfaceVariant}
            />
          </Pressable>
        </ScrollView>
      </View>

      {/* Results count */}
      <Text variant="caption" color={palette.onSurfaceVariant} style={styles.resultsCount}>
        {t('results.propertiesFound', { count: displayList.length })}
      </Text>

      {/* Hotel list */}
      {isLoading ? (
        <ResultsScreenSkeleton />
      ) : (
        <FlatList
          data={displayList}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                navigation.navigate('PropertyDetail', {
                  id: String(item.id),
                  checkIn,
                  checkOut,
                  guests,
                })
              }
            >
              <LinearGradient
                colors={item.gradient as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardImage}
              >
                <View style={styles.badgeRow}>
                  <View style={styles.typeBadge}>
                    <Text variant="captionSmall" color={palette.onPrimary}>
                      {item.type}
                    </Text>
                  </View>
                  <View style={styles.photoBadge}>
                    <MaterialCommunityIcons
                      name="camera-outline"
                      size={12}
                      color={palette.onPrimary}
                    />
                    <Text variant="captionSmall" color={palette.onPrimary}>
                      {item.photoCount}
                    </Text>
                  </View>
                </View>
              </LinearGradient>

              <View style={styles.cardBody}>
                <Text variant="button" color={palette.onSurface}>
                  {item.name}
                </Text>
                <Text
                  variant="caption"
                  color={palette.onSurfaceVariant}
                  style={styles.hotelLocation}
                >
                  {item.location}
                </Text>

                <View style={styles.bottomRow}>
                  <View style={styles.ratingRow}>
                    <MaterialCommunityIcons name="star" size={14} color={palette.star} />
                    <Text variant="label" color={palette.onSurface}>
                      {item.rating}
                    </Text>
                    <Text variant="caption" color={palette.onSurfaceVariant}>
                      ({t('results.reviewCount', { count: item.reviewCount })})
                    </Text>
                  </View>

                  <View style={styles.priceBlock}>
                    <Text variant="subtitle" color={palette.primary}>
                      {formatPrice(item.pricePerNight)}
                    </Text>
                    <Text variant="captionSmall" color={palette.onSurfaceVariant}>
                      {t('results.perNight')}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          )}
        />
      )}

      {/* Sort picker */}
      <PickerModal
        visible={sortPickerVisible}
        onClose={() => setSortPickerVisible(false)}
        options={sortOptions}
        selected={sortBy}
        onSelect={value => setSortBy(value)}
        title={t('results.sortRecommended')}
      />

      {/* Rating filter picker */}
      <PickerModal
        visible={ratingPickerVisible}
        onClose={() => setRatingPickerVisible(false)}
        options={ratingOptions}
        selected={minRatingKey}
        onSelect={value => setMinRating(value === 'none' ? null : Number(value))}
        title={t('results.filterRating')}
      />

      {/* Price filter picker */}
      <PickerModal
        visible={pricePickerVisible}
        onClose={() => setPricePickerVisible(false)}
        options={priceOptions}
        selected={priceKey}
        onSelect={value => {
          if (value === 'none') {
            setMinPrice(null);
            setMaxPrice(null);
          } else {
            const [lo, hi] = value.split('-').map(Number);
            setMinPrice(lo);
            setMaxPrice(hi);
          }
        }}
        title={t('results.filterPrice')}
      />

      {/* Type filter picker */}
      <PickerModal
        visible={typePickerVisible}
        onClose={() => setTypePickerVisible(false)}
        options={typeOptions}
        selected={typeKey}
        onSelect={value => setSelectedType(value === 'none' ? null : value)}
        title={t('results.filterType')}
      />
    </View>
  );
}
