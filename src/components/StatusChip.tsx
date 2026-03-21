import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { palette } from '../theme/palette';

type Status = 'confirmed' | 'pending' | 'cancelled' | 'past';

interface StatusChipProps {
  status: Status;
  label?: string;
}

const statusConfig: Record<Status, { bg: string; color: string; icon: string | null }> = {
  confirmed: { bg: palette.successContainer, color: palette.success, icon: 'check-circle' },
  pending: { bg: palette.warningContainer, color: palette.warning, icon: 'clock-outline' },
  cancelled: { bg: palette.errorContainer, color: palette.error, icon: 'close-circle' },
  past: { bg: palette.outlineVariant, color: palette.onSurfaceVariant, icon: null },
};

export default function StatusChip({ status, label }: StatusChipProps) {
  const { t } = useTranslation('common');
  const config = statusConfig[status];
  const displayLabel = label || t(`status.${status}`);

  return (
    <View style={[styles.container, { backgroundColor: config.bg }]}>
      {config.icon && (
        <MaterialCommunityIcons name={config.icon as any} size={14} color={config.color} />
      )}
      <Text style={[styles.text, { color: config.color }]}>{displayLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 100,
  },
  text: {
    fontSize: 12,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
  },
});
