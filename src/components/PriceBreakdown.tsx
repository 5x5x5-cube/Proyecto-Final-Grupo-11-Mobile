import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette } from '../theme/palette';

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
          <Text style={styles.rowLabel}>{row.label}</Text>
          <Text style={styles.rowValue}>{row.value}</Text>
        </View>
      ))}
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.totalLabel}>{totalLabel}</Text>
        <Text style={styles.totalValue}>{totalValue}</Text>
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
  rowLabel: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: palette.onSurfaceVariant,
  },
  rowValue: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: palette.onSurface,
  },
  divider: {
    height: 1,
    backgroundColor: palette.outlineVariant,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 15,
    fontFamily: 'Roboto_700Bold',
    color: palette.onSurface,
  },
  totalValue: {
    fontSize: 15,
    fontFamily: 'Roboto_700Bold',
    color: palette.onSurface,
  },
});
