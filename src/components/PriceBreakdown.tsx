import React from 'react';
import { View, StyleSheet } from 'react-native';
import { palette } from '@/theme/palette';
import Text from './Text';

interface PriceRow {
  label: string;
  value: string;
}

interface PriceBreakdownProps {
  rows: PriceRow[];
  totalLabel: string;
  totalValue: string;
}

export default function PriceBreakdown({ rows, totalLabel, totalValue }: PriceBreakdownProps) {
  return (
    <View>
      {rows.map((row, index) => (
        <View key={index} style={styles.row}>
          <Text variant="body" color={palette.onSurfaceVariant}>
            {row.label}
          </Text>
          <Text variant="body" color={palette.onSurface}>
            {row.value}
          </Text>
        </View>
      ))}
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text variant="button" color={palette.onSurface}>
          {totalLabel}
        </Text>
        <Text variant="button" color={palette.onSurface}>
          {totalValue}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: palette.outlineVariant,
    marginVertical: 12,
  },
});
