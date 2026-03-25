import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from '../components/Skeleton';
import { palette } from '../theme/palette';

export default function MyReservationsScreenSkeleton() {
  return (
    <View style={styles.container}>
      {[0, 1, 2].map(i => (
        <View key={i} style={styles.card}>
          <Skeleton width="100%" height={100} borderRadius={0} style={styles.gradient} />
          <View style={styles.body}>
            <View style={styles.headerRow}>
              <Skeleton width="60%" height={16} />
              <Skeleton width={70} height={22} borderRadius={6} />
            </View>
            <Skeleton width="50%" height={12} style={styles.mt8} />
            <View style={styles.footerRow}>
              <Skeleton width="55%" height={12} />
              <Skeleton width={80} height={14} />
            </View>
            <Skeleton width={100} height={11} style={styles.mt6} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.outlineVariant,
  },
  gradient: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  body: {
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  mt6: { marginTop: 6 },
  mt8: { marginTop: 8 },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
