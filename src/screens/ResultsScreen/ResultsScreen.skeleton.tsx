import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from '@/components/Skeleton';
import { palette } from '@/theme/palette';

export default function ResultsScreenSkeleton() {
  return (
    <View style={styles.container}>
      {[0, 1, 2].map(i => (
        <View key={i} style={styles.card}>
          <Skeleton width="100%" height={140} borderRadius={0} style={styles.image} />
          <View style={styles.body}>
            <Skeleton width="65%" height={16} borderRadius={4} />
            <Skeleton width="45%" height={12} borderRadius={4} style={styles.mt4} />
            <View style={styles.row}>
              <Skeleton width={80} height={14} borderRadius={4} />
              <Skeleton width={90} height={16} borderRadius={4} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 14,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  body: {
    padding: 14,
  },
  mt4: {
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
