import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette } from '../theme/palette';

interface TopBarProps {
  title: string;
  onBack: () => void;
}

export default function TopBar({ title, onBack }: TopBarProps) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onBack} style={styles.backButton}>
        <MaterialCommunityIcons name="arrow-left" size={22} color={palette.onSurface} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: palette.outlineVariant,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 2,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
    fontWeight: '600',
    color: palette.onSurface,
  },
});
