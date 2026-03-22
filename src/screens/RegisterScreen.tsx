import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
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

type FieldDef = {
  key: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  placeholder: string;
};

const fields: FieldDef[] = [
  { key: 'fullName', icon: 'account-outline', placeholder: 'Juan Perez' },
  { key: 'email', icon: 'email-outline', placeholder: 'viajero@email.com' },
  { key: 'phone', icon: 'phone-outline', placeholder: '+57 300 123 4567' },
  { key: 'password', icon: 'lock-outline', placeholder: '••••••••' },
  { key: 'confirmPassword', icon: 'lock-outline', placeholder: '••••••••' },
];

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation('mobile');

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.container,
          { paddingTop: 36 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.languageRow}>
          <LanguagePill />
        </View>

        <View style={styles.brandSection}>
          <Brand size={28} variant="nav" />
          <Text style={styles.subtitle}>{t('register.subtitle')}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('register.title')}</Text>

          {fields.map((field) => (
            <View key={field.key} style={styles.fieldGroup}>
              <Text style={styles.label}>
                {t(`register.${field.key}` as any)}
              </Text>
              <View style={styles.inputRow}>
                <MaterialCommunityIcons
                  name={field.icon}
                  size={18}
                  color={palette.onSurfaceVariant}
                />
                <TextInput
                  style={styles.input}
                  defaultValue={field.placeholder}
                  secureTextEntry={field.key === 'password' || field.key === 'confirmPassword'}
                />
              </View>
            </View>
          ))}

          <Pressable
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.primaryButtonText}>
              {t('register.button')}
            </Text>
          </Pressable>

          <Pressable
            style={styles.linkRow}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.linkText}>
              {t('register.hasAccount')}{' '}
              <Text style={styles.linkBold}>{t('register.login')}</Text>
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
    marginBottom: 20,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 28,
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
    marginBottom: 14,
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
