import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { palette } from '@/theme/palette';
import Text from './Text';

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export default function FilterChip({ label, selected = false, onPress }: FilterChipProps) {
  return (
    <Pressable onPress={onPress} style={[styles.container, selected && styles.selected]}>
      <Text
        variant={selected ? 'label' : 'bodySmall'}
        color={selected ? palette.onPrimaryContainer : palette.onSurfaceVariant}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: palette.outlineVariant,
  },
  selected: {
    borderColor: palette.primaryContainer,
    backgroundColor: palette.primaryContainer,
  },
});
