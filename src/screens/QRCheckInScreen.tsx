import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-native-qrcode-svg';
import { RootStackParamList } from '../navigation/types';
import { palette } from '../theme/palette';
import { useLocale } from '../contexts/LocaleContext';
import { mockReservations, pastReservations, cancelledReservations } from '../data/mockReservations';
import TopBar from '../components/TopBar';

const allReservations = [...mockReservations, ...pastReservations, ...cancelledReservations];

export default function QRCheckInScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<NativeStackScreenProps<RootStackParamList, 'QRCheckIn'>['route']>();
  const { t } = useTranslation('mobile');
  const { formatDate } = useLocale();

  const reservation = allReservations.find((r) => r.id === route.params.id) || allReservations[0];

  return (
    <View style={styles.container}>
      <TopBar title={t('qrCheckIn.title')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* QR Code card */}
        <View style={styles.qrCard}>
          <QRCode value={reservation.code} size={240} />
        </View>

        {/* Reservation code badge */}
        <View style={styles.codeBadge}>
          <Text style={styles.codeText}>{reservation.code}</Text>
        </View>

        {/* Hotel name */}
        <Text style={styles.hotelName}>{reservation.hotelName}</Text>

        {/* Dates */}
        <Text style={styles.dates}>
          {formatDate(reservation.checkIn, 'mediumWithDay')} — {formatDate(reservation.checkOut, 'mediumWithDay')}
        </Text>

        {/* Room + guests */}
        <Text style={styles.roomGuests}>
          {reservation.room} · {reservation.guests}
        </Text>

        {/* Instruction card */}
        <View style={styles.instructionCard}>
          <Text style={styles.instructionText}>
            Presenta este codigo QR en la recepcion del hotel para realizar tu check-in de forma rapida.
          </Text>
        </View>

        {/* Download button */}
        <Pressable style={styles.downloadButton}>
          <MaterialCommunityIcons name="download" size={20} color={palette.primary} />
          <Text style={styles.downloadText}>Descargar QR</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: 'center',
  },
  qrCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.outlineVariant,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  codeBadge: {
    backgroundColor: palette.primaryContainer,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 16,
  },
  codeText: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.onPrimaryContainer,
    letterSpacing: 1,
  },
  hotelName: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.onSurface,
    textAlign: 'center',
    marginBottom: 6,
  },
  dates: {
    fontSize: 13,
    color: palette.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 4,
  },
  roomGuests: {
    fontSize: 12,
    color: palette.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 20,
  },
  instructionCard: {
    backgroundColor: palette.surfaceContainer,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    alignSelf: 'stretch',
  },
  instructionText: {
    fontSize: 13,
    color: palette.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 19,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: palette.primary,
    borderRadius: 12,
    paddingVertical: 13,
    alignSelf: 'stretch',
  },
  downloadText: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.primary,
  },
});
