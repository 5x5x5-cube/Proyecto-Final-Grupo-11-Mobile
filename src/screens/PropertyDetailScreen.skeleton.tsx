import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from '../components/Skeleton';
import { palette } from '../theme/palette';

export default function PropertyDetailScreenSkeleton() {
  return (
    <View>
      {/* Hero */}
      <Skeleton width="100%" height={200} borderRadius={0} />

      <View style={styles.content}>
        {/* Type + Name + Location + Rating */}
        <Skeleton width={60} height={12} />
        <Skeleton width="80%" height={22} style={styles.mt6} />
        <Skeleton width="55%" height={14} style={styles.mt4} />
        <Skeleton width={120} height={24} borderRadius={6} style={styles.mt8} />

        {/* Description */}
        <View style={styles.mt16}>
          <Skeleton width="100%" height={14} />
          <Skeleton width="100%" height={14} style={styles.mt4} />
          <Skeleton width="70%" height={14} style={styles.mt4} />
        </View>

        {/* Amenities title + pills */}
        <Skeleton width={140} height={16} style={styles.mt20} />
        <View style={styles.pillsRow}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} width={70} height={28} borderRadius={8} />
          ))}
        </View>

        {/* Rooms title + cards */}
        <Skeleton width={150} height={16} style={styles.mt20} />
        {[0, 1, 2].map((i) => (
          <View key={i} style={styles.roomCard}>
            <Skeleton width={56} height={56} borderRadius={8} />
            <View style={styles.roomInfo}>
              <Skeleton width="60%" height={14} />
              <Skeleton width="40%" height={12} style={styles.mt2} />
            </View>
            <Skeleton width={70} height={16} />
          </View>
        ))}

        {/* Reviews title + cards */}
        <Skeleton width={140} height={16} style={styles.mt20} />
        <View style={styles.reviewsRow}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} width={220} height={100} borderRadius={12} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 90,
  },
  mt2: { marginTop: 2 },
  mt4: { marginTop: 4 },
  mt6: { marginTop: 6 },
  mt8: { marginTop: 8 },
  mt16: { marginTop: 16 },
  mt20: { marginTop: 20 },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    marginBottom: 4,
  },
  roomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.outlineVariant,
    padding: 12,
    marginTop: 10,
  },
  roomInfo: {
    flex: 1,
  },
  reviewsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
});
