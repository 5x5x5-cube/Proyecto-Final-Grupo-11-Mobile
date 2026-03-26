import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { typography } from '../theme/typography';
import { palette } from '../theme/palette';

type Variant = keyof typeof typography;

interface TextProps extends RNTextProps {
  variant?: Variant;
  color?: string;
}

/**
 * Design system Text component that enforces typography tokens.
 * Avoids raw fontFamily/fontSize/lineHeight scattered across components.
 *
 * Usage: <Text variant="body" color={palette.onSurface}>Hello</Text>
 */
export default function Text({
  variant = 'body',
  color = palette.onSurface,
  style,
  ...props
}: TextProps) {
  return <RNText style={[typography[variant], { color }, style]} {...props} />;
}
