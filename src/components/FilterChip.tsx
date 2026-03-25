import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { palette } from '../theme/palette';

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export default function FilterChip({ label, selected = false, onPress }: FilterChipProps) {
  return (
    <Pressable onPress={onPress} style={[styles.container, selected && styles.selected]}>
      <Text style={[styles.text, selected && styles.textSelected]}>{label}</Text>
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
  text: {
    fontSize: 13,
    fontFamily: 'Roboto_400Regular',
    color: palette.onSurfaceVariant,
  },
  textSelected: {
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    color: palette.onPrimaryContainer,
  },
});
