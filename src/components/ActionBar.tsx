import React from 'react';
import { View, StyleSheet } from 'react-native';
import { palette } from '@/theme/palette';

interface ActionBarProps {
  children: React.ReactNode;
}

export default function ActionBar({ children }: ActionBarProps) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.surface,
    borderTopWidth: 1,
    borderTopColor: palette.outlineVariant,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
