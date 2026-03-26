import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useLocale } from '@/contexts/LocaleContext';
import type { Language } from '@/contexts/LocaleContext';
import { palette } from '@/theme/palette';
import Text from './Text';

const languages: Language[] = ['ES', 'EN'];

export default function LanguagePill() {
  const { language, setLanguage } = useLocale();

  return (
    <View style={styles.container}>
      {languages.map(lang => {
        const isActive = lang === language;
        return (
          <Pressable
            key={lang}
            onPress={() => setLanguage(lang)}
            style={[styles.pill, isActive && styles.pillActive]}
          >
            <Text variant="label" color={isActive ? palette.onPrimary : palette.onSurfaceVariant}>
              {lang}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: palette.outlineVariant,
    overflow: 'hidden',
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillActive: {
    backgroundColor: palette.primary,
  },
});
