import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { palette } from '@/theme/palette';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  marginBottom?: number;
}

export default function Card({ children, style, padding = 16, marginBottom = 12 }: CardProps) {
  return <View style={[styles.card, { padding, marginBottom }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.outlineVariant,
  },
});
