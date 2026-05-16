import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useLocale } from '@/contexts/LocaleContext';
import { palette } from '@/theme/palette';
import { styles } from './CancellationPolicyCard.styles';
import Text from '@/components/Text';

interface Props {
  checkIn?: string;
}

function addDays(dateStr: string, days: number): Date {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d;
}

export default function CancellationPolicyCard({ checkIn }: Props) {
  const { t } = useTranslation('mobile');
  const { formatDate } = useLocale();

  if (!checkIn) {
    return (
      <View style={styles.cancellationCard}>
        <View style={styles.cancellationHeader}>
          <MaterialCommunityIcons name="shield-check" size={18} color={palette.success} />
          <Text variant="body" color={palette.success} style={styles.cancellationTitle}>
            {t('summary.freeCancellation')}
          </Text>
        </View>
        <Text variant="bodySmall" color={palette.success} style={styles.cancellationText}>
          {t('summary.cancellationPolicy')}
        </Text>
      </View>
    );
  }

  const freeCancelUntil = formatDate(addDays(checkIn, -3), 'medium');
  const halfChargeStart = formatDate(addDays(checkIn, -3), 'short');
  const halfChargeEnd = formatDate(addDays(checkIn, -1), 'short');
  const noRefundFrom = formatDate(new Date(checkIn + 'T00:00:00'), 'medium');

  return (
    <View style={styles.cancellationCard}>
      <View style={styles.policyRow}>
        <MaterialCommunityIcons name="check-circle" size={18} color={palette.success} />
        <Text variant="bodySmall" color={palette.onSurface} style={styles.policyText}>
          {t('summary.freeCancellationUntil')}{' '}
          <Text variant="bodySmall" style={styles.bold}>
            {freeCancelUntil}
          </Text>
        </Text>
      </View>
      <View style={styles.policyRow}>
        <MaterialCommunityIcons name="information" size={18} color={palette.star} />
        <Text variant="bodySmall" color={palette.onSurfaceVariant} style={styles.policyText}>
          {t('summary.halfChargeLabel', { percent: 50 })}{' '}
          <Text variant="bodySmall" style={styles.bold}>
            {halfChargeStart}–{halfChargeEnd}
          </Text>
        </Text>
      </View>
      <View style={styles.policyRow}>
        <MaterialCommunityIcons name="close-circle" size={18} color={palette.error} />
        <Text variant="bodySmall" color={palette.onSurfaceVariant} style={styles.policyText}>
          {t('summary.noRefundFrom')}{' '}
          <Text variant="bodySmall" style={styles.bold}>
            {noRefundFrom}
          </Text>
        </Text>
      </View>
    </View>
  );
}
