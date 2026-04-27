import React, { useRef, useState } from 'react';
import { FlatList, Pressable, ScrollView, View, ViewToken } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '@/navigation/types';
import { useHotelDetail, useHotelRooms } from '@/api/hooks/useSearch';
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

interface NormalizedRoom {
  id: string;
  roomType: string;
  roomNumber: string;
  capacity: number;
  pricePerNight: number;
  taxRate: number;
  description: string;
  amenities: Array<{ key: string; icon: string; label: string }>;
}

const TAX_RATE = 0.19;

const reviews = [
  { name: 'Maria G.', initials: 'MG', rating: 5, textKey: 'propertyDetail.reviewTexts.review1' },
  { name: 'Carlos M.', initials: 'CM', rating: 4, textKey: 'propertyDetail.reviewTexts.review2' },
  { name: 'Ana L.', initials: 'AL', rating: 5, textKey: 'propertyDetail.reviewTexts.review3' },
];

// Paleta de degradados para los slides de la galería
const GALLERY_GRADIENTS: [string, string][] = [
  ['#006874', '#4A9FAA'],
  ['#003740', '#006874'],
  ['#004D57', '#00838F'],
  ['#005662', '#0097A7'],
  ['#006874', '#26C6DA'],
];

export default function PropertyDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<NativeStackScreenProps<RootStackParamList, 'PropertyDetail'>['route']>();
  const { t } = useTranslation('mobile');
  const { formatPrice } = useLocale();

  // Parámetros de búsqueda recibidos desde ResultsScreen
  const hotelId = route.params.id;
  const checkIn = route.params.checkIn ?? '2026-03-20';
  const checkOut = route.params.checkOut ?? '2026-03-25';
  const guests = route.params.guests ?? 2;

  // Calcula el número de noches entre check-in y check-out
  const nights =
    Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
    ) || 5;

  const { data: hotelData, isLoading: isLoadingHotel } = useHotelDetail(hotelId);
  const { data: roomsData, isLoading: isLoadingRooms } = useHotelRooms(hotelId);
  const hotel = (hotelData as any) ?? null;
  const rooms: NormalizedRoom[] = Array.isArray(roomsData) ? roomsData : [];

  const setCart = useSetCart();
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const galleryRef = useRef<FlatList>(null);

  // Callback para actualizar el índice de slide activo en la galería
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setGalleryIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const isLoading = isLoadingHotel || isLoadingRooms;

  if (isLoading || !hotel) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scroll} bounces={false}>
          <PropertyDetailScreenSkeleton />
        </ScrollView>
      </View>
    );
  }

  // Construye los slides de la galería usando imágenes del hotel o degradados por defecto
  const gallerySlides: { gradient: [string, string] }[] =
    hotel.images?.length > 0
      ? hotel.images
      : GALLERY_GRADIENTS.slice(0, hotel.photoCount ?? GALLERY_GRADIENTS.length).map(g => ({
          gradient: g,
        }));

  const selectedRoom = rooms[selectedRoomIndex] ?? null;

  // Cálculo del desglose de precio según la habitación seleccionada
  const subtotal = selectedRoom ? selectedRoom.pricePerNight * nights : 0;
  const taxes = Math.round(subtotal * TAX_RATE);
  const total = subtotal + taxes;

  // Aggregate unique amenities from all rooms (same pattern as web)
  const hotelAmenities = (() => {
    const map = new Map<string, { key: string; icon: string; label: string }>();
    for (const room of rooms) {
      for (const amenity of room.amenities) {
        if (!map.has(amenity.label)) {
          map.set(amenity.label, amenity);
        }
      }
    }
    return Array.from(map.values());
  })();

  // Determina si el hotel ofrece cancelación gratuita
  const hasFreeCancellation = hotel.freeCancellation === true;

  async function handleReserve() {
    if (!selectedRoom) return;

    const selection = {
      roomId: selectedRoom.id,
      hotelId: typeof hotelId === 'string' ? hotelId : String(hotelId),
      checkIn,
      checkOut,
      guests,
    };

    // Persistencia optimista: navega de inmediato y sincroniza en segundo plano
    await saveCartSelection(selection);
    navigation.navigate('ReservationSummary', {
      hotelId: selection.hotelId,
      roomId: selectedRoom.id,
      checkIn,
      checkOut,
      guests,
    });

    setCart.mutate(selection);
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} bounces={false}>
        {/* ── Galería de imágenes con swipe ─────────────────────────────── */}
        <View style={styles.galleryContainer}>
          <FlatList
            ref={galleryRef}
            data={gallerySlides}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            renderItem={({ item }) => (
              <LinearGradient
                colors={item.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gallerySlide}
              />
            )}
          />

          {/* Botón volver */}
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={18} color={palette.onPrimary} />
          </Pressable>

          {/* Indicador de slide actual */}
          <View style={styles.slideIndicator}>
            <Text variant="caption" color={palette.onPrimary}>
              {t('propertyDetail.slideOf', {
                current: galleryIndex + 1,
                total: gallerySlides.length,
              })}
            </Text>
          </View>

          {/* Puntos de paginación */}
          <View style={styles.dotsRow}>
            {gallerySlides.map((_, i) => (
              <View key={i} style={[styles.dot, i === galleryIndex && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* ── Contenido principal ───────────────────────────────────────── */}
        <View style={styles.content}>
          {/* Tipo de propiedad */}
          <Text variant="captionSmall" color={palette.onSurfaceVariant} style={styles.hotelType}>
            {hotel.type?.toUpperCase()}
          </Text>

          {/* Nombre del hotel */}
          <Text variant="h2" color={palette.onSurface} style={styles.hotelName}>
            {hotel.name}
          </Text>

          {/* Estrellas */}
          {hotel.stars != null && (
            <View style={styles.starsRow}>
              {Array.from({ length: hotel.stars as number }).map((_, i) => (
                <MaterialCommunityIcons key={i} name="star" size={14} color={palette.star} />
              ))}
            </View>
          )}

          {/* Ubicación */}
          <Text variant="bodySmall" color={palette.onSurfaceVariant} style={styles.location}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={13}
              color={palette.onSurfaceVariant}
            />
            {'  '}
            {hotel.location}
          </Text>

          {/* Rating + reseñas */}
          <View style={styles.ratingRow}>
            <View style={styles.ratingBadge}>
              <Text variant="bodySmall" color={palette.onPrimary} style={styles.ratingBadgeText}>
                {hotel.rating}
              </Text>
            </View>
            <Text variant="bodySmall" color={palette.onSurfaceVariant} style={styles.reviewCount}>
              {t('propertyDetail.reviews', { count: hotel.reviewCount })}
            </Text>
          </View>

          {/* Descripción */}
          <Text variant="bodySmall" color={palette.onSurface} style={styles.description}>
            {t('propertyDetail.description')}
          </Text>

          {/* ── Servicios incluidos ──────────────────────────────────── */}
          <Text variant="button" color={palette.onSurface} style={styles.sectionTitle}>
            {t('propertyDetail.includedServices')}
          </Text>
          {hotelAmenities.length > 0 && (
            <View style={styles.amenitiesRow}>
              {hotelAmenities.map(amenity => (
                <AmenityTag key={amenity.key} icon={amenity.icon} label={amenity.label} />
              ))}
            </View>
          )}

          {/* ── Política de cancelación ──────────────────────────────── */}
          {hasFreeCancellation && (
            <View style={styles.cancellationCard}>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={20}
                color={palette.success}
              />
              <View style={styles.cancellationText}>
                <Text variant="button" color={palette.success}>
                  {t('propertyDetail.freeCancellation')}
                </Text>
                <Text variant="caption" color={palette.onSurfaceVariant}>
                  {t('propertyDetail.freeCancellationDetail')}
                </Text>
              </View>
            </View>
          )}

          {/* ── Habitaciones disponibles ─────────────────────────────── */}
          <Text variant="button" color={palette.onSurface} style={styles.sectionTitle}>
            {t('propertyDetail.availableRooms')}
          </Text>

          {rooms.map((room, index) => {
            const isSelected = index === selectedRoomIndex;
            return (
              <Pressable
                key={room.id}
                style={[styles.roomCard, isSelected && styles.roomCardSelected]}
                onPress={() => setSelectedRoomIndex(index)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
              >
                <LinearGradient
                  colors={
                    (hotel.gradient as [string, string]) ??
                    GALLERY_GRADIENTS[index % GALLERY_GRADIENTS.length]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.roomGradient}
                />
                <View style={styles.roomInfo}>
                  <Text variant="body" color={palette.onSurface} style={styles.roomName}>
                    {room.roomType}
                  </Text>
                  <View style={styles.roomMeta}>
                    <MaterialCommunityIcons
                      name="account-outline"
                      size={13}
                      color={palette.onSurfaceVariant}
                    />
                    <Text variant="caption" color={palette.onSurfaceVariant}>
                      {'  '}
                      {t('propertyDetail.capacity', { count: room.capacity })}
                    </Text>
                  </View>
                  <Text variant="body" color={palette.primary} style={styles.roomPrice}>
                    {formatPrice(room.pricePerNight)}
                    <Text variant="caption" color={palette.onSurfaceVariant}>
                      {t('propertyDetail.perNight')}
                    </Text>
                  </Text>
                </View>
                <View style={[styles.selectBtn, isSelected && styles.selectBtnSelected]}>
                  <Text
                    variant="caption"
                    color={isSelected ? palette.onPrimary : palette.primary}
                    style={styles.selectBtnText}
                  >
                    {isSelected ? t('propertyDetail.selected') : t('propertyDetail.selectRoom')}
                  </Text>
                </View>
              </Pressable>
            );
          })}

          {/* ── Desglose de precio dinámico ──────────────────────────── */}
          {selectedRoom && (
            <View style={styles.breakdownCard}>
              <Text variant="button" color={palette.onSurface} style={styles.breakdownTitle}>
                {t('propertyDetail.priceBreakdown')}
              </Text>
              <View style={styles.breakdownRow}>
                <Text variant="bodySmall" color={palette.onSurfaceVariant}>
                  {t('propertyDetail.nightsBreakdown', {
                    count: nights,
                    price: formatPrice(selectedRoom.pricePerNight),
                  })}
                </Text>
                <Text variant="bodySmall" color={palette.onSurface}>
                  {formatPrice(subtotal)}
                </Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text variant="bodySmall" color={palette.onSurfaceVariant}>
                  {t('propertyDetail.taxes')}
                </Text>
                <Text variant="bodySmall" color={palette.onSurface}>
                  {formatPrice(taxes)}
                </Text>
              </View>
              <View style={[styles.breakdownRow, styles.breakdownTotalRow]}>
                <Text variant="button" color={palette.onSurface}>
                  {t('propertyDetail.totalEstimated')}
                </Text>
                <Text variant="button" color={palette.primary}>
                  {formatPrice(total)}
                </Text>
              </View>
            </View>
          )}

          {/* ── Reseñas de huéspedes ─────────────────────────────────── */}
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
                  <Text variant="captionSmall" color={palette.onPrimaryContainer}>
                    {item.initials}
                  </Text>
                </View>
                <Text variant="bodySmall" color={palette.onSurface} style={styles.reviewName}>
                  {item.name}
                </Text>
              </View>
              <View style={styles.starsRowSmall}>
                {Array.from({ length: item.rating }).map((_, i) => (
                  <MaterialCommunityIcons key={i} name="star" size={14} color={palette.star} />
                ))}
              </View>
              <Text variant="caption" color={palette.onSurfaceVariant}>
                {t(item.textKey)}
              </Text>
            </View>
          )}
        />

        <View style={styles.scrollSpacer} />
      </ScrollView>

      {/* ── Barra de acción fija ─────────────────────────────────────── */}
      <ActionBar>
        <View style={styles.actionBarContent}>
          <View>
            <Text variant="h3" color={palette.primary} style={styles.actionPrice}>
              {formatPrice(total)}
            </Text>
            <Text variant="caption" color={palette.onSurfaceVariant}>
              {t('summary.nights', { count: nights })} · {t('propertyDetail.taxes')}
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
