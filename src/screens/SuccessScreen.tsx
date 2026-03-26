import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/types';
import { useLocale } from '../contexts/LocaleContext';
import { palette } from '../theme/palette';

export default function SuccessScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<NativeStackScreenProps<RootStackParamList, 'Success'>['route']>();
  const { t } = useTranslation('mobile');
  const { formatDate } = useLocale();

  const bookingCode = route.params?.bookingCode ?? 'TH-2026-48291';
  const hotelName = route.params?.hotelName ?? 'Hotel Santa Clara Sofitel';
  const checkIn = route.params?.checkIn ?? '2026-03-20';
  const checkOut = route.params?.checkOut ?? '2026-03-25';

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.container, { paddingTop: 48 }]}
    >
      {/* Success icon */}
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons name="check-circle" size={40} color={palette.success} />
      </View>

      <Text style={styles.title}>{t('success.title')}</Text>
      <Text style={styles.subtitle}>{t('success.subtitle')}</Text>

      {/* Reservation code */}
      <View style={styles.codeBadge}>
        <Text style={styles.codeLabel}>{t('success.reservationCode')}</Text>
        <Text style={styles.codeValue}>{bookingCode}</Text>
      </View>

      {/* Summary card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('success.hotel')}</Text>
          <Text style={styles.summaryValue}>{hotelName}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('success.dates')}</Text>
          <Text style={styles.summaryValue}>
            {formatDate(new Date(checkIn), 'short')} - {formatDate(new Date(checkOut), 'short')}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('success.room')}</Text>
          <Text style={styles.summaryValue}>{t('success.roomValue')}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('success.guests')}</Text>
          <Text style={styles.summaryValue}>{t('success.guestsValue', { count: 2 })}</Text>
        </View>
      </View>

      {/* Actions */}
      <Pressable
        style={styles.primaryButton}
        onPress={() => navigation.navigate('MainTabs', { screen: 'MyReservations' })}
      >
        <Text style={styles.primaryButtonText}>{t('success.viewReservations')}</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('MainTabs', { screen: 'Search' })}>
        <Text style={styles.linkText}>{t('success.backToHome')}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: palette.surface,
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: palette.successContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Roboto_700Bold',
    fontWeight: 'bold',
    color: palette.onSurface,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Roboto_400Regular',
    color: palette.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 24,
  },
  codeBadge: {
    backgroundColor: palette.primaryContainer,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 24,
  },
  codeLabel: {
    fontSize: 11,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    color: palette.primary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  codeValue: {
    fontSize: 18,
    fontFamily: 'Roboto_700Bold',
    fontWeight: 'bold',
    color: palette.onPrimaryContainer,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.outlineVariant,
    padding: 16,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: 'Roboto_400Regular',
    color: palette.onSurfaceVariant,
  },
  summaryValue: {
    fontSize: 13,
    fontFamily: 'Roboto_500Medium',
    color: palette.onSurface,
    textAlign: 'right',
    flexShrink: 1,
    marginLeft: 16,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: palette.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    fontSize: 15,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    color: '#fff',
  },
  linkText: {
    fontSize: 14,
    fontFamily: 'Roboto_500Medium',
    color: palette.primary,
  },
});
