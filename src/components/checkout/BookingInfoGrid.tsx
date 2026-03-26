import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocale } from '../../contexts/LocaleContext';
import { palette } from '../../theme/palette';
import InfoGrid from '../InfoGrid';

interface BookingInfoGridProps {
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
}

export default function BookingInfoGrid({
  checkIn,
  checkOut,
  nights,
  guests,
}: BookingInfoGridProps) {
  const { t } = useTranslation('mobile');
  const { formatDate } = useLocale();

  return (
    <View style={styles.card}>
      <InfoGrid
        items={[
          {
            label: t('summary.checkIn'),
            value: formatDate(checkIn, 'shortWithDay'),
            sub: '3:00 PM',
          },
          {
            label: t('summary.checkOut'),
            value: formatDate(checkOut, 'shortWithDay'),
            sub: '12:00 PM',
          },
          {
            label: t('summary.duration'),
            value: t('summary.nights', { count: nights }),
          },
          {
            label: t('summary.guests'),
            value: t('summary.guestsValue', { count: guests }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.outlineVariant,
    padding: 16,
    marginBottom: 12,
  },
});
