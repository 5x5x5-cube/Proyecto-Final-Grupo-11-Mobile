import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { palette } from '../../theme/palette';

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
          <Text style={styles.hotelName}>{hotelName}</Text>
          <Text style={styles.hotelLocation}>{location}</Text>
          <Text style={styles.hotelRoom}>{roomName}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  hotelGradient: {
    width: 64,
    height: 64,
    borderRadius: 10,
  },
  hotelInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  hotelName: {
    fontSize: 15,
    fontFamily: 'Roboto_700Bold',
    fontWeight: 'bold',
    color: palette.onSurface,
    marginBottom: 2,
  },
  hotelLocation: {
    fontSize: 12,
    fontFamily: 'Roboto_400Regular',
    color: palette.onSurfaceVariant,
    marginBottom: 2,
  },
  hotelRoom: {
    fontSize: 12,
    fontFamily: 'Roboto_500Medium',
    color: palette.primary,
  },
});
