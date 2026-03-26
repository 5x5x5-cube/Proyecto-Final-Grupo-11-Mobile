import React from 'react';
import { View } from 'react-native';
import Text from '@/components/Text';
import { palette } from '@/theme/palette';
import { styles } from './PlaceholderScreen.styles';

interface PlaceholderScreenProps {
  name: string;
}

export default function PlaceholderScreen({ name }: PlaceholderScreenProps) {
  return (
    <View style={styles.container}>
      <Text variant="subtitle" color={palette.onSurfaceVariant}>
        {name}
      </Text>
    </View>
  );
}
