import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette } from '@/theme/palette';
import Text from './Text';

interface TopBarProps {
  title: string;
  onBack: () => void;
}

export default function TopBar({ title, onBack }: TopBarProps) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onBack} style={styles.backButton} testID="topbar-back-button">
        <MaterialCommunityIcons name="arrow-left" size={22} color={palette.onSurface} />
      </Pressable>
      <Text variant="subtitle" color={palette.onSurface}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.surface,
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
});
