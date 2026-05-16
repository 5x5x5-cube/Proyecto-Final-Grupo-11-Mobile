import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette } from '@/theme/palette';
import Text from './Text';

export interface RatingBadgeProps {
  rating: number;
  showStars?: 'none' | 'single' | 'full';
}

function FullStars({ rating }: { rating: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const filled = rating >= i;
    const partial = !filled && rating > i - 1;
    let iconName: 'star' | 'star-half-full' | 'star-outline';
    if (filled) {
      iconName = 'star';
    } else if (partial) {
      iconName = 'star-half-full';
    } else {
      iconName = 'star-outline';
    }
    stars.push(
      <MaterialCommunityIcons
        key={i}
        name={iconName}
        size={14}
        color={filled || partial ? palette.star : palette.outlineVariant}
      />
    );
  }
  return <>{stars}</>;
}

export default function RatingBadge({ rating, showStars = 'none' }: RatingBadgeProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.badge}>
        <Text variant="captionSmall" color={palette.onPrimary} style={styles.badgeText}>
          {rating.toFixed(1)}
        </Text>
      </View>

      {showStars === 'single' && (
        <MaterialCommunityIcons name="star" size={14} color={palette.star} />
      )}

      {showStars === 'full' && <FullStars rating={rating} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badge: {
    backgroundColor: palette.primary,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontWeight: '700',
  },
});
