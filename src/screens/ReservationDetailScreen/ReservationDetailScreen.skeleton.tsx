import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from '../../components/Skeleton';
import { palette } from '../../theme/palette';

export default function ReservationDetailScreenSkeleton() {
  return (
    <View style={styles.content}>
      {/* Status + Code */}
      <View style={styles.statusRow}>
        <Skeleton width={70} height={22} borderRadius={6} />
        <Skeleton width={100} height={14} />
      </View>

      {/* Hotel Card */}
      <View style={styles.card}>
        <Skeleton width="100%" height={120} borderRadius={0} />
        <View style={styles.hotelInfo}>
          <Skeleton width={60} height={12} />
          <Skeleton width="70%" height={18} style={styles.mt4} />
          <Skeleton width="50%" height={12} style={styles.mt4} />
        </View>
      </View>

      {/* Info Grid */}
      <View style={styles.gridCard}>
        <View style={styles.grid}>
          {[0, 1, 2, 3].map(i => (
            <View key={i} style={styles.gridCell}>
              <Skeleton width={60} height={12} />
              <Skeleton width={80} height={14} style={styles.mt4} />
            </View>
          ))}
        </View>
      </View>

      {/* Room */}
      <View style={styles.gridCard}>
        <Skeleton width={50} height={12} />
        <Skeleton width={120} height={16} style={styles.mt4} />
      </View>

      {/* Price Breakdown */}
      <View style={styles.gridCard}>
        <Skeleton width={140} height={16} />
        <View style={styles.priceRow}>
          <Skeleton width={120} height={14} />
          <Skeleton width={80} height={14} />
        </View>
        <View style={styles.priceRow}>
          <Skeleton width={80} height={14} />
          <Skeleton width={60} height={14} />
        </View>
        <View style={[styles.totalRow]}>
          <Skeleton width={80} height={16} />
          <Skeleton width={100} height={16} />
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <Skeleton width="100%" height={48} borderRadius={12} />
        <Skeleton width="100%" height={48} borderRadius={12} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.outlineVariant,
    marginBottom: 14,
  },
  hotelInfo: {
    padding: 14,
  },
  mt4: { marginTop: 4 },
  gridCard: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.outlineVariant,
    padding: 16,
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridCell: {
    width: '50%',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: palette.outlineVariant,
  },
  buttons: {
    gap: 10,
    marginTop: 4,
  },
});
