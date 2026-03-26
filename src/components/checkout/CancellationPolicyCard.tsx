import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { palette } from '../../theme/palette';

export default function CancellationPolicyCard() {
  const { t } = useTranslation('mobile');

  return (
    <View style={styles.cancellationCard}>
      <View style={styles.cancellationHeader}>
        <MaterialCommunityIcons name="shield-check" size={18} color={palette.success} />
        <Text style={styles.cancellationTitle}>{t('summary.freeCancellation')}</Text>
      </View>
      <Text style={styles.cancellationText}>{t('summary.cancellationPolicy')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cancellationCard: {
    backgroundColor: palette.successContainer,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cancellationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cancellationTitle: {
    fontSize: 14,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    color: palette.success,
  },
  cancellationText: {
    fontSize: 13,
    fontFamily: 'Roboto_400Regular',
    color: palette.success,
    lineHeight: 19,
  },
});
