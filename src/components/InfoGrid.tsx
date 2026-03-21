import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette } from '../theme/palette';

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
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.value}>{item.value}</Text>
          {item.sub && <Text style={styles.sub}>{item.sub}</Text>}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  item: {
    width: '46%',
  },
  label: {
    fontSize: 11,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    textTransform: 'uppercase',
    color: palette.primary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    fontFamily: 'Roboto_500Medium',
    color: palette.onSurface,
  },
  sub: {
    fontSize: 12,
    fontFamily: 'Roboto_400Regular',
    color: palette.onSurfaceVariant,
    marginTop: 2,
  },
});
