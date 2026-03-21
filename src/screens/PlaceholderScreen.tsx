import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette } from '../theme/palette';

interface PlaceholderScreenProps {
  name: string;
}

export default function PlaceholderScreen({ name }: PlaceholderScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surface,
  },
  text: {
    fontSize: 16,
    color: palette.onSurfaceVariant,
  },
});
