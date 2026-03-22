import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/types';
import { mockHotels } from '../data/mockHotels';
import { useLocale } from '../contexts/LocaleContext';
import { palette } from '../theme/palette';

export default function SuccessScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation('mobile');
  const { formatPrice, formatDate } = useLocale();

  const hotel = mockHotels[0];
  const nights = 5;
  const nightsTotal = hotel.pricePerNight * nights;
  const taxes = Math.round(nightsTotal * 0.19);
  const total = nightsTotal + taxes;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.container,
        { paddingTop: 48 + insets.top },
      ]}
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
        <Text style={styles.codeValue}>TH-2026-48291</Text>
      </View>

      {/* Summary card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('success.hotel')}</Text>
          <Text style={styles.summaryValue}>{hotel.name}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('success.dates')}</Text>
          <Text style={styles.summaryValue}>
            {formatDate(new Date('2026-03-20'), 'short')} - {formatDate(new Date('2026-03-25'), 'short')}
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
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>{t('success.total')}</Text>
          <Text style={styles.totalValue}>{formatPrice(total)}</Text>
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
  divider: {
    height: 1,
    backgroundColor: palette.outlineVariant,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: 'Roboto_700Bold',
    fontWeight: 'bold',
    color: palette.onSurface,
  },
  totalValue: {
    fontSize: 14,
    fontFamily: 'Roboto_700Bold',
    fontWeight: 'bold',
    color: palette.onSurface,
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
