import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from '../components/Skeleton';
import { palette } from '../theme/palette';

export default function ReservationSummaryScreenSkeleton() {
  return (
    <View style={styles.content}>
      {/* Hotel Card */}
      <View style={styles.card}>
        <View style={styles.hotelRow}>
          <Skeleton width={64} height={64} borderRadius={10} />
          <View style={styles.hotelInfo}>
            <Skeleton width="70%" height={16} />
            <Skeleton width="50%" height={12} style={styles.mt2} />
            <Skeleton width="60%" height={12} style={styles.mt2} />
          </View>
        </View>
      </View>

      {/* Info Grid */}
      <View style={styles.card}>
        <View style={styles.grid}>
          {[0, 1, 2, 3].map(i => (
            <View key={i} style={styles.gridCell}>
              <Skeleton width={60} height={12} />
              <Skeleton width={80} height={14} style={styles.mt4} />
            </View>
          ))}
        </View>
      </View>

      {/* Price Breakdown */}
      <View style={styles.card}>
        <Skeleton width={120} height={16} />
        <View style={styles.priceRow}>
          <Skeleton width={120} height={14} />
          <Skeleton width={80} height={14} />
        </View>
        <View style={styles.priceRow}>
          <Skeleton width={80} height={14} />
          <Skeleton width={60} height={14} />
        </View>
        <View style={styles.totalRow}>
          <Skeleton width={60} height={16} />
          <Skeleton width={100} height={16} />
        </View>
      </View>

      {/* Cancellation Policy */}
      <Skeleton width="100%" height={70} borderRadius={12} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 90,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.outlineVariant,
    padding: 16,
    marginBottom: 12,
  },
  hotelRow: {
    flexDirection: 'row',
    gap: 12,
  },
  hotelInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  mt2: { marginTop: 2 },
  mt4: { marginTop: 4 },
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
});
