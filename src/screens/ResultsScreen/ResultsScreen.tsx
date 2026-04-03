import React from 'react';
import { View, Pressable, FlatList, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '@/navigation/types';
import { palette } from '@/theme/palette';
import { useLocale } from '@/contexts/LocaleContext';
import { useSearchHotels } from '@/api/hooks/useSearch';
import FilterChip from '@/components/FilterChip';
import Text from '@/components/Text';
import ResultsScreenSkeleton from './ResultsScreen.skeleton';
import { styles } from './ResultsScreen.styles';

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
          <MaterialCommunityIcons name="arrow-left" size={22} color={palette.onSurface} />
        </Pressable>
        <Text variant="label" color={palette.onSurface} numberOfLines={1} style={styles.topBarText}>
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
      <Text variant="caption" color={palette.onSurfaceVariant} style={styles.resultsCount}>
        {t('results.count', { count: hotels.length })}
      </Text>

      {/* Hotel list */}
      {isLoading ? (
        <ResultsScreenSkeleton />
      ) : (
        <FlatList
          data={hotels}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => navigation.navigate('PropertyDetail', { id: String(item.id) })}
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
                      ({item.reviewCount} {t('results.reviews')})
                    </Text>
                  </View>

                  <View style={styles.priceBlock}>
                    <Text variant="subtitle" color={palette.primary}>
                      {formatPrice(item.pricePerNight)}
                    </Text>
                    <Text variant="captionSmall" color={palette.onSurfaceVariant}>
                      /{t('results.perNight')}
                    </Text>
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
