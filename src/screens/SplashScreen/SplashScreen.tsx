import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import Brand from '@/components/Brand';
import { palette } from '@/theme/palette';
import { styles } from './SplashScreen.styles';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Brand size={32} variant="hero" />
      <ActivityIndicator size="large" color={palette.primary} style={styles.spinner} />
    </View>
  );
}
