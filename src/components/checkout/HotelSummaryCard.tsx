import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './HotelSummaryCard.styles';
import Text from '../Text';
import { palette } from '../../theme/palette';
import { fontFamily } from '../../theme/typography';

interface HotelSummaryCardProps {
  hotelName: string;
  location: string;
  roomName: string;
  gradient?: readonly [string, string];
}

export default function HotelSummaryCard({
  hotelName,
  location,
  roomName,
  gradient = ['#006874', '#4A9FAA'],
}: HotelSummaryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.hotelRow}>
        <LinearGradient
          colors={gradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hotelGradient}
        />
        <View style={styles.hotelInfo}>
          <Text
            variant="button"
            color={palette.onSurface}
            style={[{ fontFamily: fontFamily.bold }, styles.hotelName]}
          >
            {hotelName}
          </Text>
          <Text variant="caption" color={palette.onSurfaceVariant} style={styles.hotelLocation}>
            {location}
          </Text>
          <Text variant="label" color={palette.primary} style={styles.hotelRoom}>
            {roomName}
          </Text>
        </View>
      </View>
    </View>
  );
}
