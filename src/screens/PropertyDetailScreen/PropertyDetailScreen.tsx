import React, { useState } from 'react';
import { View, ScrollView, Pressable, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '@/navigation/types';
import { useHotelDetail } from '@/api/hooks/useSearch';
import { useSetCart } from '@/api/hooks/useCart';
import { useLocale } from '@/contexts/LocaleContext';
import { saveCartSelection } from '@/storage/cartStorage';
import { palette } from '@/theme/palette';
import Text from '@/components/Text';
import AmenityTag from '@/components/AmenityTag';
import ActionBar from '@/components/ActionBar';
import PrimaryButton from '@/components/PrimaryButton';
import PropertyDetailScreenSkeleton from './PropertyDetailScreen.skeleton';
import { styles } from './PropertyDetailScreen.styles';

const rooms = [
  {
    id: 'b1000000-0000-0000-0000-000000000001',
    nameKey: 'propertyDetail.rooms.superior',
    bedsKey: 'propertyDetail.rooms.bedKing',
    price: 480000,
  },
  {
    id: 'b1000000-0000-0000-0000-000000000002',
    nameKey: 'propertyDetail.rooms.double',
    bedsKey: 'propertyDetail.rooms.bedDouble',
    price: 520000,
  },
  {
    id: 'b1000000-0000-0000-0000-000000000003',
    nameKey: 'propertyDetail.rooms.juniorSuite',
    bedsKey: 'propertyDetail.rooms.bedKingSuite',
    price: 720000,
  },
];

const reviews = [
  {
    name: 'Maria G.',
    initials: 'MG',
    rating: 5,
    textKey: 'propertyDetail.reviewTexts.review1',
  },
  {
    name: 'Carlos M.',
    initials: 'CM',
    rating: 4,
    textKey: 'propertyDetail.reviewTexts.review2',
  },
  {
    name: 'Ana L.',
    initials: 'AL',
    rating: 5,
    textKey: 'propertyDetail.reviewTexts.review3',
  },
];

export default function PropertyDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<NativeStackScreenProps<RootStackParamList, 'PropertyDetail'>['route']>();
  const { t } = useTranslation('mobile');
  const { formatPrice } = useLocale();

  const { data: hotelData, isLoading } = useHotelDetail(route.params.id ?? 1);
  const hotel = (hotelData as any) ?? null;
  const setCart = useSetCart();
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);

  if (isLoading || !hotel) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scroll} bounces={false}>
          <PropertyDetailScreenSkeleton />
        </ScrollView>
      </View>
    );
  }

  const selectedRoom = rooms[selectedRoomIndex];
  // TODO: resolve hotel UUID from route.params.id via API once search service returns UUIDs
  const hotelId = 'a1000000-0000-0000-0000-000000000001';

  async function handleReserve() {
    const selection = {
      roomId: selectedRoom.id,
      hotelId,
      checkIn: '2026-03-20',
      checkOut: '2026-03-25',
      guests: 2,
    };

    // Optimistic: save locally and navigate immediately without waiting for the server
    await saveCartSelection(selection);
    navigation.navigate('ReservationSummary', {
      hotelId,
      roomId: selectedRoom.id,
      checkIn: '2026-03-20',
      checkOut: '2026-03-25',
      guests: 2,
    });

    // Background sync — result is handled in ReservationSummaryScreen
    setCart.mutate(selection);
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} bounces={false}>
        {/* Hero */}
        <LinearGradient
          colors={hotel.gradient as unknown as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Pressable onPress={() => navigation.goBack()} style={[styles.backButton, { top: 8 }]}>
            <MaterialCommunityIcons name="arrow-left" size={18} color={palette.onPrimary} />
          </Pressable>
          <View style={styles.photoBadge}>
            <MaterialCommunityIcons name="camera" size={14} color={palette.onPrimary} />
            <Text variant="caption" color={palette.onPrimary} style={styles.photoBadgeText}>
              {t('propertyDetail.photos', { count: hotel.photoCount })}
            </Text>
          </View>
        </LinearGradient>

        {/* Content */}
        <View style={styles.content}>
          <Text variant="captionSmall" color={palette.onSurfaceVariant} style={styles.hotelType}>
            {hotel.type.toUpperCase()}
          </Text>
          <Text variant="h2" color={palette.onSurface} style={styles.hotelName}>
            {hotel.name}
          </Text>
          <Text variant="bodySmall" color={palette.onSurfaceVariant} style={styles.location}>
            {hotel.location}
          </Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <View style={styles.ratingBadge}>
              <Text variant="bodySmall" color={palette.onPrimary} style={styles.ratingBadgeText}>
                {hotel.rating}
              </Text>
            </View>
            <MaterialCommunityIcons name="star" size={16} color={palette.star} />
            <Text variant="bodySmall" color={palette.onSurfaceVariant} style={styles.reviewCount}>
              {t('propertyDetail.reviews', { count: hotel.reviewCount })}
            </Text>
          </View>

          {/* Description */}
          <Text variant="bodySmall" color={palette.onSurface} style={styles.description}>
            {t('propertyDetail.description')}
          </Text>

          {/* Amenities */}
          <Text variant="button" color={palette.onSurface} style={styles.sectionTitle}>
            {t('propertyDetail.includedServices')}
          </Text>
          <View style={styles.amenitiesRow}>
            {hotel.amenities.map((amenity: any, index: number) => (
              <AmenityTag key={index} icon={amenity.icon} label={amenity.label} />
            ))}
          </View>

          {/* Rooms */}
          <Text variant="button" color={palette.onSurface} style={styles.sectionTitle}>
            {t('propertyDetail.availableRooms')}
          </Text>
          {rooms.map((room, index) => {
            const isSelected = index === selectedRoomIndex;
            return (
              <Pressable
                key={index}
                style={[styles.roomCard, isSelected && styles.roomCardSelected]}
                onPress={() => setSelectedRoomIndex(index)}
              >
                <LinearGradient
                  colors={hotel.gradient as unknown as [string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.roomGradient}
                />
                <View style={styles.roomInfo}>
                  <Text variant="body" color={palette.onSurface} style={styles.roomName}>
                    {t(room.nameKey)}
                  </Text>
                  <Text variant="caption" color={palette.onSurfaceVariant} style={styles.roomBeds}>
                    {t(room.bedsKey)}
                  </Text>
                </View>
                <Text variant="body" color={palette.primary} style={styles.roomPrice}>
                  {formatPrice(room.price)}
                </Text>
              </Pressable>
            );
          })}

          {/* Reviews */}
          <Text variant="button" color={palette.onSurface} style={styles.sectionTitle}>
            {t('propertyDetail.guestReviews')}
          </Text>
        </View>

        <FlatList
          horizontal
          data={reviews}
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.reviewsList}
          renderItem={({ item }) => (
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.avatar}>
                  <Text
                    variant="captionSmall"
                    color={palette.onPrimaryContainer}
                    style={styles.avatarText}
                  >
                    {item.initials}
                  </Text>
                </View>
                <Text variant="bodySmall" color={palette.onSurface} style={styles.reviewName}>
                  {item.name}
                </Text>
              </View>
              <View style={styles.starsRow}>
                {Array.from({ length: item.rating }).map((_, i) => (
                  <MaterialCommunityIcons key={i} name="star" size={14} color={palette.star} />
                ))}
              </View>
              <Text variant="caption" color={palette.onSurfaceVariant} style={styles.reviewText}>
                {t(item.textKey)}
              </Text>
            </View>
          )}
        />

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Action Bar */}
      <ActionBar>
        <View style={styles.actionBarContent}>
          <View>
            <Text variant="h3" color={palette.primary} style={styles.actionPrice}>
              {formatPrice(selectedRoom.price)}
            </Text>
            <Text
              variant="caption"
              color={palette.onSurfaceVariant}
              style={styles.actionPriceLabel}
            >
              {t('propertyDetail.perNight')}
            </Text>
          </View>
          <PrimaryButton
            title={t('propertyDetail.bookNow')}
            onPress={handleReserve}
            fullWidth={false}
          />
        </View>
      </ActionBar>
    </View>
  );
}
