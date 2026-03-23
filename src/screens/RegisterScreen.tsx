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
import Brand from '../components/Brand';
import LanguagePill from '../components/LanguagePill';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type FieldDef = {
  key: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words';
  secure?: boolean;
};

const fields: FieldDef[] = [
  { key: 'fullName', icon: 'account-outline', placeholder: 'Juan Perez', autoCapitalize: 'words' },
  { key: 'email', icon: 'email-outline', placeholder: 'viajero@email.com', keyboardType: 'email-address', autoCapitalize: 'none' },
  { key: 'phone', icon: 'phone-outline', placeholder: '+57 300 123 4567', keyboardType: 'phone-pad' },
  { key: 'password', icon: 'lock-outline', placeholder: '••••••••', secure: true },
  { key: 'confirmPassword', icon: 'lock-outline', placeholder: '••••••••', secure: true },
];

type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

type TouchedFields = {
  [K in keyof FormValues]?: boolean;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getErrorKey(key: keyof FormValues, values: FormValues): string | null {
  switch (key) {
    case 'fullName':
      return values.fullName.trim() === '' ? 'register.nameRequired' : null;
    case 'email':
      return !emailRegex.test(values.email) ? 'register.invalidEmail' : null;
    case 'phone':
      return values.phone.trim() === '' ? 'register.phoneRequired' : null;
    case 'password':
      return values.password.length < 6 ? 'register.passwordMinLength' : null;
    case 'confirmPassword':
      return values.confirmPassword !== values.password ? 'register.passwordMismatch' : null;
    default:
      return null;
  }
}

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation('mobile');
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const [values, setValues] = useState<FormValues>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [touched, setTouched] = useState<TouchedFields>({});
  const [loading, setLoading] = useState(false);

  const focusNext = (index: number) => {
    if (index < fields.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleChangeText = (key: keyof FormValues, text: string) => {
    setValues((prev) => ({ ...prev, [key]: text }));
  };

  const handleBlur = (key: keyof FormValues) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const isFormValid = fields.every(
    (field) => getErrorKey(field.key as keyof FormValues, values) === null
  );

  const handleRegister = () => {
    if (!isFormValid || loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Login');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior="padding"
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

          {fields.map((field, index) => {
            const fieldKey = field.key as keyof FormValues;
            const errorKey = getErrorKey(fieldKey, values);
            const showError = touched[fieldKey] && errorKey !== null;

            return (
              <View key={field.key} style={styles.fieldGroup}>
                <Text style={styles.label}>
                  {t(`register.${field.key}` as any)}
                </Text>
                <View style={[styles.inputRow, showError && styles.inputRowError]}>
                  <MaterialCommunityIcons
                    name={field.icon}
                    size={18}
                    color={showError ? palette.error : palette.onSurfaceVariant}
                  />
                  <TextInput
                    ref={(ref) => { inputRefs.current[index] = ref; }}
                    style={styles.input}
                    placeholder={field.placeholder}
                    placeholderTextColor={palette.onSurfaceVariant}
                    value={values[fieldKey]}
                    onChangeText={(text) => handleChangeText(fieldKey, text)}
                    onBlur={() => handleBlur(fieldKey)}
                    secureTextEntry={field.secure}
                    keyboardType={field.keyboardType ?? 'default'}
                    autoCapitalize={field.autoCapitalize}
                    returnKeyType={index < fields.length - 1 ? 'next' : 'done'}
                    onSubmitEditing={() => focusNext(index)}
                    blurOnSubmit={index === fields.length - 1}
                  />
                </View>
                {showError && errorKey && (
                  <Text style={styles.errorText}>{t(errorKey)}</Text>
                )}
              </View>
            );
          })}

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              !isFormValid && styles.primaryButtonDisabled,
              pressed && isFormValid && { opacity: 0.8 },
            ]}
            onPress={handleRegister}
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {t('register.button')}
              </Text>
            )}
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
    opacity: 0.5,
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
