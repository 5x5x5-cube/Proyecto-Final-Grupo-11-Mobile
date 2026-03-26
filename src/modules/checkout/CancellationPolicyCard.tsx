import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { palette } from '@/theme/palette';
import { styles } from './CancellationPolicyCard.styles';
import Text from '@/components/Text';
import { fontFamily } from '@/theme/typography';

export default function CancellationPolicyCard() {
  const { t } = useTranslation('mobile');

  return (
    <View style={styles.cancellationCard}>
      <View style={styles.cancellationHeader}>
        <MaterialCommunityIcons name="shield-check" size={18} color={palette.success} />
        <Text variant="body" color={palette.success} style={{ fontFamily: fontFamily.medium }}>
          {t('summary.freeCancellation')}
        </Text>
      </View>
      <Text variant="bodySmall" color={palette.success} style={styles.cancellationText}>
        {t('summary.cancellationPolicy')}
      </Text>
    </View>
  );
}
