import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/types';
import { palette } from '../theme/palette';
import Brand from '../components/Brand';
import LanguagePill from '../components/LanguagePill';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation('mobile');
  const passwordRef = useRef<TextInput>(null);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior="padding"
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.container,
          { paddingTop: 48 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.languageRow}>
          <LanguagePill />
        </View>

        <View style={styles.brandSection}>
          <Brand size={28} variant="nav" />
          <Text style={styles.subtitle}>{t('login.subtitle')}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('login.title')}</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{t('login.email')}</Text>
            <View style={styles.inputRow}>
              <MaterialCommunityIcons
                name="email-outline"
                size={18}
                color={palette.onSurfaceVariant}
              />
              <TextInput
                style={styles.input}
                defaultValue="viajero@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{t('login.password')}</Text>
            <View style={styles.inputRow}>
              <MaterialCommunityIcons
                name="lock-outline"
                size={18}
                color={palette.onSurfaceVariant}
              />
              <TextInput
                ref={passwordRef}
                style={styles.input}
                defaultValue="••••••••"
                secureTextEntry
                returnKeyType="done"
              />
            </View>
          </View>

          <Pressable
            style={styles.primaryButton}
            onPress={() => navigation.navigate('MainTabs')}
          >
            <Text style={styles.primaryButtonText}>{t('login.button')}</Text>
          </Pressable>

          <Pressable
            style={styles.linkRow}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.linkText}>
              {t('login.noAccount')}{' '}
              <Text style={styles.linkBold}>{t('login.register')}</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: palette.surface,
  },
  container: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  languageRow: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 13,
    color: palette.onSurfaceVariant,
    marginTop: 6,
    fontFamily: 'Roboto_400Regular',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.outlineVariant,
    padding: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Roboto_700Bold',
    color: palette.onSurface,
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Roboto_700Bold',
    color: palette.onSurfaceVariant,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: palette.outlineVariant,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  input: {
    fontSize: 14,
    color: palette.onSurface,
    fontFamily: 'Roboto_400Regular',
    flex: 1,
    padding: 0,
  },
  primaryButton: {
    backgroundColor: palette.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Roboto_500Medium',
    color: '#fff',
  },
  linkRow: {
    alignItems: 'center',
    marginTop: 16,
  },
  linkText: {
    fontSize: 13,
    color: palette.onSurfaceVariant,
    fontFamily: 'Roboto_400Regular',
  },
  linkBold: {
    color: palette.primary,
    fontWeight: '600',
    fontFamily: 'Roboto_500Medium',
  },
});
