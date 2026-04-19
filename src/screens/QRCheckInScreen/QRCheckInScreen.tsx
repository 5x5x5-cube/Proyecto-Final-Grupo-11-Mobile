import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-native-qrcode-svg';
import { RootStackParamList } from '../../navigation/types';
import { palette } from '../../theme/palette';
import { useLocale } from '../../contexts/LocaleContext';
import { useBookingDetail, useBookingQR } from '../../api/hooks/useBookings';
import TopBar from '../../components/TopBar';
import Text from '../../components/Text';
import { styles } from './QRCheckInScreen.styles';

export default function QRCheckInScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<NativeStackScreenProps<RootStackParamList, 'QRCheckIn'>['route']>();
  const { t } = useTranslation('mobile');
  const { formatDate } = useLocale();

  const bookingId = route.params.id ?? 1;
  const { data: reservationData } = useBookingDetail(bookingId);
  const { data: qrData } = useBookingQR(bookingId);
  const reservation = (reservationData as any) ?? {};
  const qrCode = qrData?.qrCode ?? reservation.code ?? '';
  const isFromCache = qrData?.isFromCache ?? false;

  return (
    <View style={styles.container}>
      <TopBar title={t('qrCheckIn.title')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 24 + insets.bottom }]}>
        {/* QR Code card */}
        <View style={styles.qrCard}>
          <QRCode value={qrCode || 'TH-2026-48291'} size={240} />
        </View>

        {/* Reservation code badge */}
        <View style={styles.codeBadge}>
          <Text variant="subtitle" color={palette.onPrimaryContainer} style={styles.codeText}>
            {reservation.code}
          </Text>
        </View>

        {/* Hotel name */}
        <Text variant="button" color={palette.onSurface} style={styles.hotelName}>
          {reservation.hotelName}
        </Text>

        {/* Dates */}
        <Text variant="bodySmall" color={palette.onSurfaceVariant} style={styles.dates}>
          {formatDate(reservation.checkIn, 'mediumWithDay')} —{' '}
          {formatDate(reservation.checkOut, 'mediumWithDay')}
        </Text>

        {/* Room + guests */}
        <Text variant="caption" color={palette.onSurfaceVariant} style={styles.roomGuests}>
          {reservation.room} · {reservation.guests}
        </Text>

        {/* Offline indicator */}
        {isFromCache && (
          <View style={styles.offlineBadge}>
            <MaterialCommunityIcons
              name="cloud-off-outline"
              size={16}
              color={palette.onSurfaceVariant}
            />
            <Text variant="caption" color={palette.onSurfaceVariant}>
              {t('qrCheckIn.offlineMode')}
            </Text>
          </View>
        )}

        {/* Instruction card */}
        <View style={styles.instructionCard}>
          <Text variant="bodySmall" color={palette.onSurfaceVariant} style={styles.instructionText}>
            {t('qrCheckIn.instruction')}
          </Text>
        </View>

        {/* Download button */}
        <Pressable style={styles.downloadButton}>
          <MaterialCommunityIcons name="download" size={20} color={palette.primary} />
          <Text variant="button" color={palette.primary}>
            {t('qrCheckIn.downloadQR')}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
