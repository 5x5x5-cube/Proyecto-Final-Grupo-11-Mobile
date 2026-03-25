import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/types';
import { mockHotels } from '../data/mockHotels';
import { useLocale } from '../contexts/LocaleContext';
import { palette } from '../theme/palette';
import AmenityTag from '../components/AmenityTag';
import ActionBar from '../components/ActionBar';

const rooms = [
  { name: 'Superior', beds: '1 cama king', price: 480000 },
  { name: 'Doble', beds: '2 camas dobles', price: 520000 },
  { name: 'Suite Junior', beds: '1 cama king + sala', price: 720000 },
];

const reviews = [
  {
    name: 'Maria G.',
    initials: 'MG',
    rating: 5,
    text: 'Excelente hotel, ubicacion privilegiada y servicio impecable. Totalmente recomendado.',
  },
  {
    name: 'Carlos M.',
    initials: 'CM',
    rating: 4,
    text: 'Muy buena experiencia. Las habitaciones son amplias y limpias. El desayuno podria mejorar.',
  },
  {
    name: 'Ana L.',
    initials: 'AL',
    rating: 5,
    text: 'Hermoso lugar, el personal muy atento y la piscina es espectacular. Volveria sin duda.',
  },
];

export default function PropertyDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<NativeStackScreenProps<RootStackParamList, 'PropertyDetail'>['route']>();
  const { t } = useTranslation('mobile');
  const { formatPrice } = useLocale();

  const hotel = mockHotels.find((h) => h.id === route.params.id) || mockHotels[0];

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
          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { top: insets.top + 8 }]}
          >
            <MaterialCommunityIcons name="arrow-left" size={18} color="#fff" />
          </Pressable>
          <View style={styles.photoBadge}>
            <MaterialCommunityIcons name="camera" size={14} color="#fff" />
            <Text style={styles.photoBadgeText}>+{hotel.photoCount} fotos</Text>
          </View>
        </LinearGradient>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.hotelType}>{hotel.type.toUpperCase()}</Text>
          <Text style={styles.hotelName}>{hotel.name}</Text>
          <Text style={styles.location}>{hotel.location}</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingBadgeText}>{hotel.rating}</Text>
            </View>
            <MaterialCommunityIcons name="star" size={16} color={palette.star} />
            <Text style={styles.reviewCount}>{hotel.reviewCount} resenas</Text>
          </View>

          {/* Description */}
          <Text style={styles.description}>
            Disfruta de una experiencia unica en {hotel.name}. Ubicado en {hotel.location}, este {hotel.type.toLowerCase()} ofrece comodidad, estilo y una ubicacion privilegiada para explorar la ciudad.
          </Text>

          {/* Amenities */}
          <Text style={styles.sectionTitle}>Servicios incluidos</Text>
          <View style={styles.amenitiesRow}>
            {hotel.amenities.map((amenity, index) => (
              <AmenityTag key={index} icon={amenity.icon} label={amenity.label} />
            ))}
          </View>

          {/* Rooms */}
          <Text style={styles.sectionTitle}>Habitaciones disponibles</Text>
          {rooms.map((room, index) => (
            <View key={index} style={styles.roomCard}>
              <LinearGradient
                colors={hotel.gradient as unknown as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.roomGradient}
              />
              <View style={styles.roomInfo}>
                <Text style={styles.roomName}>{room.name}</Text>
                <Text style={styles.roomBeds}>{room.beds}</Text>
              </View>
              <Text style={styles.roomPrice}>{formatPrice(room.price)}</Text>
            </View>
          ))}

          {/* Reviews */}
          <Text style={styles.sectionTitle}>Resenas de huespedes</Text>
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
                  <Text style={styles.avatarText}>{item.initials}</Text>
                </View>
                <Text style={styles.reviewName}>{item.name}</Text>
              </View>
              <View style={styles.starsRow}>
                {Array.from({ length: item.rating }).map((_, i) => (
                  <MaterialCommunityIcons key={i} name="star" size={14} color={palette.star} />
                ))}
              </View>
              <Text style={styles.reviewText}>{item.text}</Text>
            </View>
          )}
        />

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Action Bar */}
      <ActionBar>
        <View style={styles.actionBarContent}>
          <View>
            <Text style={styles.actionPrice}>{formatPrice(hotel.pricePerNight)}</Text>
            <Text style={styles.actionPriceLabel}>/noche</Text>
          </View>
          <Pressable
            style={styles.reserveButton}
            onPress={() => navigation.navigate('ReservationSummary')}
          >
            <Text style={styles.reserveButtonText}>Reservar ahora</Text>
          </Pressable>
        </View>
      </ActionBar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.surface,
  },
  scroll: {
    flex: 1,
  },
  hero: {
    height: 200,
    justifyContent: 'flex-end',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  photoBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'Roboto_400Regular',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  hotelType: {
    fontSize: 11,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    color: palette.onSurfaceVariant,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  hotelName: {
    fontSize: 20,
    fontFamily: 'Roboto_700Bold',
    fontWeight: 'bold',
    color: palette.onSurface,
    marginBottom: 4,
  },
  location: {
    fontSize: 13,
    fontFamily: 'Roboto_400Regular',
    color: palette.onSurfaceVariant,
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  ratingBadge: {
    backgroundColor: palette.primary,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  ratingBadgeText: {
    fontSize: 13,
    fontFamily: 'Roboto_700Bold',
    fontWeight: 'bold',
    color: '#fff',
  },
  reviewCount: {
    fontSize: 13,
    fontFamily: 'Roboto_400Regular',
    color: palette.onSurfaceVariant,
  },
  description: {
    fontSize: 13,
    fontFamily: 'Roboto_400Regular',
    color: palette.onSurface,
    lineHeight: 21,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    color: palette.onSurface,
    marginBottom: 12,
    marginTop: 4,
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  roomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.outlineVariant,
    padding: 12,
    gap: 12,
    marginBottom: 10,
  },
  roomGradient: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 14,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    color: palette.onSurface,
    marginBottom: 2,
  },
  roomBeds: {
    fontSize: 12,
    fontFamily: 'Roboto_400Regular',
    color: palette.onSurfaceVariant,
  },
  roomPrice: {
    fontSize: 14,
    fontFamily: 'Roboto_700Bold',
    fontWeight: 'bold',
    color: palette.primary,
  },
  reviewsList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  reviewCard: {
    minWidth: 220,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.outlineVariant,
    padding: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: palette.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 11,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    color: palette.onPrimaryContainer,
  },
  reviewName: {
    fontSize: 13,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    color: palette.onSurface,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 6,
  },
  reviewText: {
    fontSize: 12,
    fontFamily: 'Roboto_400Regular',
    color: palette.onSurfaceVariant,
    lineHeight: 18,
  },
  actionBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionPrice: {
    fontSize: 18,
    fontFamily: 'Roboto_700Bold',
    fontWeight: 'bold',
    color: palette.primary,
  },
  actionPriceLabel: {
    fontSize: 12,
    fontFamily: 'Roboto_400Regular',
    color: palette.onSurfaceVariant,
  },
  reserveButton: {
    backgroundColor: palette.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  reserveButtonText: {
    fontSize: 14,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    color: '#fff',
  },
});
