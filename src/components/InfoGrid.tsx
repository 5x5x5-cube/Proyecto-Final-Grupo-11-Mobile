import React from 'react';
import { View } from 'react-native';
import { palette } from '@/theme/palette';
import Text from './Text';
import { styles } from './InfoGrid.styles';

interface InfoGridItem {
  label: string;
  value: string;
  sub?: string;
}

interface InfoGridProps {
  items: InfoGridItem[];
}

export default function InfoGrid({ items }: InfoGridProps) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index} style={styles.item}>
          <Text variant="label" color={palette.primary} style={styles.label}>
            {item.label}
          </Text>
          <Text variant="button" color={palette.onSurface}>
            {item.value}
          </Text>
          {item.sub && (
            <Text variant="caption" color={palette.onSurfaceVariant} style={styles.sub}>
              {item.sub}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}
