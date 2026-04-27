import React from 'react';
import { View, ScrollView } from 'react-native';
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

function getQRErrorKey(detail?: string): string {
  if (detail?.includes('within 3 days')) return 'qrCheckIn.errorDateRange';
  if (detail?.includes('confirmed')) return 'qrCheckIn.errorNotConfirmed';
  return 'qrCheckIn.errorGeneric';
}

export default function QRCheckInScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<NativeStackScreenProps<RootStackParamList, 'QRCheckIn'>['route']>();
  const { t } = useTranslation('mobile');
  const { formatDate } = useLocale();

  const bookingId = route.params.id ?? 1;
  const { data: reservationData } = useBookingDetail(bookingId);
  const { data: qrData, error: qrError, isLoading: qrLoading } = useBookingQR(bookingId);
  const reservation = (reservationData as any) ?? {};
  const qrCode = qrData?.qrCode ?? '';
  const isFromCache = qrData?.isFromCache ?? false;
  const hasError = !!qrError && !qrCode;

  return (
    <View style={styles.container}>
      <TopBar title={t('qrCheckIn.title')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 24 + insets.bottom }]}>
        {hasError ? (
          <View style={styles.errorCard}>
            <MaterialCommunityIcons
              name="qrcode-remove"
              size={64}
              color={palette.outline}
            />
            <Text variant="body" color={palette.onSurface} style={styles.errorTitle}>
              {t('qrCheckIn.errorTitle')}
            </Text>
            <Text variant="bodySmall" color={palette.onSurfaceVariant} style={styles.errorMessage}>
              {t(getQRErrorKey((qrError as any)?.detail))}
            </Text>
          </View>
        ) : (
          <>
            {/* QR Code card */}
            <View style={styles.qrCard}>
              {qrLoading ? (
                <View style={styles.qrPlaceholder}>
                  <MaterialCommunityIcons name="qrcode" size={64} color={palette.outlineVariant} />
                </View>
              ) : (
                <QRCode value={qrCode || ' '} size={240} />
              )}
            </View>

            {/* Reservation code badge */}
            <View style={styles.codeBadge}>
              <Text variant="subtitle" color={palette.onPrimaryContainer} style={styles.codeText}>
                {reservation.code}
              </Text>
            </View>
          </>
        )}

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
          {reservation.room ? `${reservation.room} · ` : ''}{t('qrCheckIn.guests', { count: reservation.guests })}
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
        {!hasError && (
          <View style={styles.instructionCard}>
            <Text variant="bodySmall" color={palette.onSurfaceVariant} style={styles.instructionText}>
              {t('qrCheckIn.instruction')}
            </Text>
          </View>
        )}

      </ScrollView>
    </View>
  );
}
