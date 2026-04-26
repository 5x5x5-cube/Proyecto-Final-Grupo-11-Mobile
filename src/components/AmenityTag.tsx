import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette } from '@/theme/palette';
import Text from './Text';

const iconMap: Record<string, string> = {
  wifi: 'wifi',
  free_breakfast: 'coffee',
  pool: 'pool',
  ac_unit: 'snowflake',
  spa: 'spa',
  fitness_center: 'dumbbell',
  local_parking: 'parking',
  restaurant: 'silverware-fork-knife',
  local_bar: 'glass-cocktail',
  tv: 'television',
};

interface AmenityTagProps {
  icon: string;
  label: string;
}

export default function AmenityTag({ icon, label }: AmenityTagProps) {
  const iconName = iconMap[icon] || 'help-circle-outline';

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name={iconName as 'wifi'}
        size={14}
        color={palette.onSurfaceVariant}
      />
      <Text variant="captionSmall" color={palette.onSurfaceVariant}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: palette.surfaceContainer,
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
});
