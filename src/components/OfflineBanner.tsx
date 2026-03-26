import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { palette } from '@/theme/palette';
import Text from './Text';

export default function OfflineBanner() {
  const { t } = useTranslation('common');

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="wifi-off" size={16} color={palette.warning} />
      <Text variant="label" color={palette.warning}>
        {t('offline.banner')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.warningContainer,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
