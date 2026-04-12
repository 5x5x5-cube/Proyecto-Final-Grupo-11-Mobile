import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { palette } from '@/theme/palette';

interface DividerProps {
  style?: StyleProp<ViewStyle>;
}

export default function Divider({ style }: DividerProps) {
  return <View style={[styles.divider, style]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: palette.outlineVariant,
  },
});
