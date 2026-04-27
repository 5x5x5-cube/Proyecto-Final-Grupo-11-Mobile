import React from 'react';
import { palette } from '@/theme/palette';
import { fontFamily } from '@/theme/typography';
import Text from './Text';

interface BrandProps {
  size?: number;
  variant?: 'nav' | 'hero';
}

export default function Brand({ size = 22, variant = 'nav' }: BrandProps) {
  const color = variant === 'hero' ? palette.onSurface : palette.primary;
  return (
    <Text style={{ fontFamily: fontFamily.bold, fontSize: size, letterSpacing: -0.25, color }}>
      <Text style={{ fontFamily: fontFamily.light, fontSize: size }}>Travel</Text>Hub
    </Text>
  );
}
