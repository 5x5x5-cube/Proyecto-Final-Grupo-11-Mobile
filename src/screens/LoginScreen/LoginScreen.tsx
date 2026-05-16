import React, { useRef, useState } from 'react';
import { View, TextInput, Pressable, KeyboardAvoidingView, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '@/navigation/types';
import { palette } from '@/theme/palette';
import { useLogin } from '@/api/hooks/useAuth';
import { useAuth } from '@/contexts/AuthContext';
import Brand from '@/components/Brand';
import LanguagePill from '@/components/LanguagePill';
import PrimaryButton from '@/components/PrimaryButton';
import Text from '@/components/Text';
import { styles } from './LoginScreen.styles';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation('mobile');
  const passwordRef = useRef<TextInput>(null);
  const auth = useAuth();

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
      {
        onSuccess: async (data: any) => {
          if (data?.access_token) {
            await auth.login(data.access_token, data.user_id, {
              name: data.name,
              email: data.email,
            });
          }
        },
      }
    );
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior="padding">
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.container, { paddingTop: 48 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.languageRow}>
          <LanguagePill />
        </View>

        <View style={styles.brandSection}>
          <Brand size={28} variant="nav" />
          <Text variant="bodySmall" color={palette.onSurfaceVariant} style={styles.subtitle}>
            {t('login.subtitle')}
          </Text>
        </View>

        <View style={styles.card}>
          <Text variant="h3" color={palette.onSurface} style={styles.cardTitle}>
            {t('login.title')}
          </Text>

          <View style={styles.fieldGroup}>
            <Text variant="label" color={palette.onSurfaceVariant} style={styles.label}>
              {t('login.email')}
            </Text>
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
              <Text variant="captionSmall" color={palette.error} style={styles.errorText}>
                {t('login.invalidEmail')}
              </Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text variant="label" color={palette.onSurfaceVariant} style={styles.label}>
              {t('login.password')}
            </Text>
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

          <View style={styles.buttonWrapper}>
            <PrimaryButton
              title={t('login.button')}
              onPress={handleLogin}
              loading={loading}
              disabled={!isValid}
            />
          </View>

          <Pressable style={styles.linkRow} onPress={() => navigation.navigate('Register')}>
            <Text variant="bodySmall" color={palette.onSurfaceVariant} style={styles.linkText}>
              {t('login.noAccount')}{' '}
              <Text variant="bodySmall" color={palette.primary} style={styles.linkBold}>
                {t('login.register')}
              </Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
