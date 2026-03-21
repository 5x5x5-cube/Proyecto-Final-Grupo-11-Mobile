import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette } from '../theme/palette';

interface ProfileMenuRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
}

export default function ProfileMenuRow({ icon, label, value, onPress }: ProfileMenuRowProps) {
  return (
    <Pressable onPress={onPress} style={styles.container} disabled={!onPress}>
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={styles.label}>{label}</Text>
      {value && <Text style={styles.value}>{value}</Text>}
      <MaterialCommunityIcons name="chevron-right" size={20} color={palette.onSurfaceVariant} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  iconWrap: {
    width: 24,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: palette.onSurface,
    flex: 1,
  },
  value: {
    fontSize: 13,
    fontFamily: 'Roboto_400Regular',
    color: palette.onSurfaceVariant,
  },
});
