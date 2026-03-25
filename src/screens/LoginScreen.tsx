import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/types';
import { palette } from '../theme/palette';
import { useLogin } from '../api/hooks/useAuth';
import Brand from '../components/Brand';
import LanguagePill from '../components/LanguagePill';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation('mobile');
  const passwordRef = useRef<TextInput>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const login = useLogin();
  const loading = login.isPending;

  const isValid = email.trim().length > 0 && password.trim().length > 0;

  function handleEmailChange(value: string) {
    setEmail(value);
    if (emailError && EMAIL_REGEX.test(value.trim())) {
      setEmailError(false);
    }
  }

  function handleEmailBlur() {
    if (email.trim().length > 0 && !EMAIL_REGEX.test(email.trim())) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  }

  function handleLogin() {
    if (!isValid) return;

    if (!EMAIL_REGEX.test(email.trim())) {
      setEmailError(true);
      return;
    }

    login.mutate(
      { email: email.trim(), password },
      { onSuccess: () => navigation.navigate('MainTabs') },
    );
  }

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
            <View style={[styles.inputRow, emailError && styles.inputRowError]}>
              <MaterialCommunityIcons
                name="email-outline"
                size={18}
                color={emailError ? palette.error : palette.onSurfaceVariant}
              />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={handleEmailChange}
                onBlur={handleEmailBlur}
                placeholder={t('login.emailPlaceholder')}
                placeholderTextColor={palette.onSurfaceVariant}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>
            {emailError && (
              <Text style={styles.errorText}>{t('login.invalidEmail')}</Text>
            )}
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
                value={password}
                onChangeText={setPassword}
                placeholder={t('login.passwordPlaceholder')}
                placeholderTextColor={palette.onSurfaceVariant}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              !isValid && styles.primaryButtonDisabled,
              pressed && isValid && { opacity: 0.8 },
            ]}
            onPress={handleLogin}
            disabled={!isValid || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>{t('login.button')}</Text>
            )}
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
  inputRowError: {
    borderColor: palette.error,
  },
  input: {
    fontSize: 14,
    color: palette.onSurface,
    fontFamily: 'Roboto_400Regular',
    flex: 1,
    padding: 0,
  },
  errorText: {
    fontSize: 11,
    color: palette.error,
    fontFamily: 'Roboto_400Regular',
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: palette.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonDisabled: {
    backgroundColor: palette.onSurfaceVariant,
    opacity: 0.4,
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
