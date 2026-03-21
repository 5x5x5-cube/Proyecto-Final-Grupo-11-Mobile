import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { palette } from '../theme/palette';

interface BrandProps {
  size?: number;
  variant?: 'nav' | 'hero';
}

export default function Brand({ size = 22, variant = 'nav' }: BrandProps) {
  const color = variant === 'hero' ? palette.onSurface : palette.primary;
  return (
    <Text style={[styles.base, { fontSize: size, color }]}>
      <Text style={styles.light}>Travel</Text>Hub
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: 'Roboto_700Bold',
    letterSpacing: -0.25,
  },
  light: {
    fontFamily: 'Roboto_300Light',
  },
});
