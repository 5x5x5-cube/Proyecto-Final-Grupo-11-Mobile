import React, { useRef, useState } from 'react';
import { View, TextInput, Pressable, KeyboardAvoidingView, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '@/navigation/types';
import { palette } from '@/theme/palette';
import { useRegister } from '@/api/hooks/useAuth';
import Brand from '@/components/Brand';
import LanguagePill from '@/components/LanguagePill';
import PrimaryButton from '@/components/PrimaryButton';
import Text from '@/components/Text';
import { styles } from './RegisterScreen.styles';

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
  {
    key: 'email',
    icon: 'email-outline',
    placeholder: 'viajero@email.com',
    keyboardType: 'email-address',
    autoCapitalize: 'none',
  },
  {
    key: 'phone',
    icon: 'phone-outline',
    placeholder: '+57 300 123 4567',
    keyboardType: 'phone-pad',
  },
  {
    key: 'password',
    icon: 'lock-outline',
    placeholder: '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022',
    secure: true,
  },
  {
    key: 'confirmPassword',
    icon: 'lock-outline',
    placeholder: '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022',
    secure: true,
  },
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
  const register = useRegister();
  const loading = register.isPending;

  const focusNext = (index: number) => {
    if (index < fields.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleChangeText = (key: keyof FormValues, text: string) => {
    setValues(prev => ({ ...prev, [key]: text }));
  };

  const handleBlur = (key: keyof FormValues) => {
    setTouched(prev => ({ ...prev, [key]: true }));
  };

  const isFormValid = fields.every(
    field => getErrorKey(field.key as keyof FormValues, values) === null
  );

  const handleRegister = () => {
    if (!isFormValid || loading) return;
    register.mutate(
      {
        name: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.phone,
      },
      { onSuccess: () => navigation.navigate('Login') }
    );
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior="padding">
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.container, { paddingTop: 36 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.languageRow}>
          <LanguagePill />
        </View>

        <View style={styles.brandSection}>
          <Brand size={28} variant="nav" />
          <Text variant="bodySmall" color={palette.onSurfaceVariant} style={styles.subtitle}>
            {t('register.subtitle')}
          </Text>
        </View>

        <View style={styles.card}>
          <Text variant="h3" color={palette.onSurface} style={styles.cardTitle}>
            {t('register.title')}
          </Text>

          {fields.map((field, index) => {
            const fieldKey = field.key as keyof FormValues;
            const errorKey = getErrorKey(fieldKey, values);
            const showError = touched[fieldKey] && errorKey !== null;

            return (
              <View key={field.key} style={styles.fieldGroup}>
                <Text variant="label" color={palette.onSurfaceVariant} style={styles.label}>
                  {t(`register.${field.key}` as any)}
                </Text>
                <View style={[styles.inputRow, showError && styles.inputRowError]}>
                  <MaterialCommunityIcons
                    name={field.icon}
                    size={18}
                    color={showError ? palette.error : palette.onSurfaceVariant}
                  />
                  <TextInput
                    ref={ref => {
                      inputRefs.current[index] = ref;
                    }}
                    style={styles.input}
                    placeholder={field.placeholder}
                    placeholderTextColor={palette.onSurfaceVariant}
                    value={values[fieldKey]}
                    onChangeText={text => handleChangeText(fieldKey, text)}
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
                  <Text variant="captionSmall" color={palette.error} style={styles.errorText}>
                    {t(errorKey)}
                  </Text>
                )}
              </View>
            );
          })}

          <View style={styles.buttonWrapper}>
            <PrimaryButton
              title={t('register.button')}
              onPress={handleRegister}
              loading={loading}
              disabled={!isFormValid}
            />
          </View>

          <Pressable style={styles.linkRow} onPress={() => navigation.navigate('Login')}>
            <Text variant="bodySmall" color={palette.onSurfaceVariant} style={styles.linkText}>
              {t('register.hasAccount')}{' '}
              <Text variant="bodySmall" color={palette.primary} style={styles.linkBold}>
                {t('register.login')}
              </Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
