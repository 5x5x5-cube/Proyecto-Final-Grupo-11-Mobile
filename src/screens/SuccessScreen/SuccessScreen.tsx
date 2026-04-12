import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '@/navigation/types';
import { useLocale } from '@/contexts/LocaleContext';
import { palette } from '@/theme/palette';
import Text from '@/components/Text';
import Card from '@/components/Card';
import PrimaryButton from '@/components/PrimaryButton';
import { styles } from './SuccessScreen.styles';

export default function SuccessScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<NativeStackScreenProps<RootStackParamList, 'Success'>['route']>();
  const { t } = useTranslation('mobile');
  const { formatDate } = useLocale();

  const { bookingCode, hotelName, checkIn, checkOut } = route.params;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.container, { paddingTop: 48 }]}
    >
      {/* Success icon */}
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons name="check-circle" size={40} color={palette.success} />
      </View>

      <Text variant="h2" color={palette.onSurface} style={styles.title}>
        {t('success.title')}
      </Text>
      <Text variant="bodySmall" color={palette.onSurfaceVariant} style={styles.subtitle}>
        {t('success.subtitle')}
      </Text>

      {/* Reservation code */}
      <View style={styles.codeBadge}>
        <Text variant="label" color={palette.primary} style={styles.codeLabel}>
          {t('success.reservationCode')}
        </Text>
        <Text variant="subtitle" color={palette.onPrimaryContainer}>
          {bookingCode}
        </Text>
      </View>

      {/* Summary card */}
      <Card style={styles.summaryCardWidth} marginBottom={24}>
        <View style={styles.summaryRow}>
          <Text variant="bodySmall" color={palette.onSurfaceVariant}>
            {t('success.hotel')}
          </Text>
          <Text variant="label" color={palette.onSurface} style={styles.summaryValue}>
            {hotelName}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text variant="bodySmall" color={palette.onSurfaceVariant}>
            {t('success.dates')}
          </Text>
          <Text variant="label" color={palette.onSurface} style={styles.summaryValue}>
            {formatDate(new Date(checkIn), 'short')} - {formatDate(new Date(checkOut), 'short')}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text variant="bodySmall" color={palette.onSurfaceVariant}>
            {t('success.room')}
          </Text>
          <Text variant="label" color={palette.onSurface} style={styles.summaryValue}>
            {t('success.roomValue')}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text variant="bodySmall" color={palette.onSurfaceVariant}>
            {t('success.guests')}
          </Text>
          <Text variant="label" color={palette.onSurface} style={styles.summaryValue}>
            {t('success.guestsValue', { count: 2 })}
          </Text>
        </View>
      </Card>

      {/* Actions */}
      <View style={styles.primaryButtonWrapper}>
        <PrimaryButton
          title={t('success.viewReservations')}
          onPress={() => navigation.navigate('MainTabs', { screen: 'MyReservations' })}
        />
      </View>

      <Pressable onPress={() => navigation.navigate('MainTabs', { screen: 'Search' })}>
        <Text variant="body" color={palette.primary}>
          {t('success.backToHome')}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
