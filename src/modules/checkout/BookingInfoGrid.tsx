import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocale } from '@/contexts/LocaleContext';
import InfoGrid from '@/components/InfoGrid';
import { styles } from './BookingInfoGrid.styles';

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
            sub: t('summary.checkInTime'),
          },
          {
            label: t('summary.checkOut'),
            value: formatDate(checkOut, 'shortWithDay'),
            sub: t('summary.checkOutTime'),
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
