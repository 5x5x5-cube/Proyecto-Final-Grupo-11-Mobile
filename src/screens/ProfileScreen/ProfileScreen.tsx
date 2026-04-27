import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Constants from 'expo-constants';
import { palette } from '../../theme/palette';
import { useAuth } from '../../contexts/AuthContext';
import {
  useLocale,
  currencyNames,
  languageNames,
  LANGUAGES,
  CURRENCIES,
} from '../../contexts/LocaleContext';
import ProfileMenuRow from '../../components/ProfileMenuRow';
import PickerModal from '../../components/PickerModal';
import Text from '../../components/Text';
import Card from '../../components/Card';
import { styles } from './ProfileScreen.styles';

const languageOptions = LANGUAGES.map(k => ({ key: k, label: `${k} \u2014 ${languageNames[k]}` }));
const currencyOptions = CURRENCIES.map(k => ({ key: k, label: `${k} \u2014 ${currencyNames[k]}` }));

const appVersion = Constants.expoConfig?.version ?? '0.0.0';

export default function ProfileScreen() {
  const { t } = useTranslation('mobile');
  const { language, currency, setLanguage, setCurrency } = useLocale();
  const { user, logout } = useAuth();
  const userName = user?.name ?? '';
  const userEmail = user?.email ?? '';
  const userInitials = user?.initials ?? '';

  const [langModalVisible, setLangModalVisible] = useState(false);
  const [currModalVisible, setCurrModalVisible] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text variant="h2" color={palette.onPrimary}>
            {userInitials}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text variant="subtitle" color={palette.onSurface} style={styles.name}>
            {userName}
          </Text>
          <Text variant="bodySmall" color={palette.onSurfaceVariant}>
            {userEmail}
          </Text>
        </View>
      </View>

      {/* Personal info card */}
      <Card marginBottom={14} padding={0}>
        <Text variant="bodySmall" color={palette.onSurface} style={styles.sectionTitle}>
          {t('profile.personalInfo')}
        </Text>
        <ProfileMenuRow
          icon={
            <MaterialCommunityIcons
              name="account-outline"
              size={20}
              color={palette.onSurfaceVariant}
            />
          }
          label={t('profile.name')}
          value={userName}
        />
        <View style={styles.separator} />
        <ProfileMenuRow
          icon={
            <MaterialCommunityIcons
              name="email-outline"
              size={20}
              color={palette.onSurfaceVariant}
            />
          }
          label={t('profile.email')}
          value={userEmail}
        />
        <View style={styles.separator} />
        <ProfileMenuRow
          icon={
            <MaterialCommunityIcons
              name="phone-outline"
              size={20}
              color={palette.onSurfaceVariant}
            />
          }
          label={t('profile.phone')}
          value={user?.phone ?? ''}
        />
      </Card>

      {/* Preferences card */}
      <Card marginBottom={14} padding={0}>
        <Text variant="bodySmall" color={palette.onSurface} style={styles.sectionTitle}>
          {t('profile.preferences')}
        </Text>
        <ProfileMenuRow
          icon={<MaterialCommunityIcons name="web" size={20} color={palette.onSurfaceVariant} />}
          label={t('profile.language')}
          value={`${language} \u2014 ${languageNames[language]}`}
          onPress={() => setLangModalVisible(true)}
        />
        <View style={styles.separator} />
        <ProfileMenuRow
          icon={
            <MaterialCommunityIcons
              name="currency-usd"
              size={20}
              color={palette.onSurfaceVariant}
            />
          }
          label={t('profile.currency')}
          value={`${currency} \u2014 ${currencyNames[currency]}`}
          onPress={() => setCurrModalVisible(true)}
        />
        <View style={styles.separator} />
        <ProfileMenuRow
          icon={
            <MaterialCommunityIcons
              name="bell-outline"
              size={20}
              color={palette.onSurfaceVariant}
            />
          }
          label={t('profile.notifications')}
        />
      </Card>

      {/* Logout button */}
      <Pressable style={styles.logoutButton} onPress={() => logout()}>
        <MaterialCommunityIcons name="logout" size={20} color={palette.error} />
        <Text variant="button" color={palette.error}>
          {t('profile.logout')}
        </Text>
      </Pressable>

      {/* App version */}
      <Text variant="bodySmall" color={palette.onSurfaceVariant} style={styles.versionText}>
        v{appVersion}
      </Text>

      {/* Modals */}
      <PickerModal
        visible={langModalVisible}
        onClose={() => setLangModalVisible(false)}
        options={languageOptions}
        selected={language}
        onSelect={setLanguage}
        title={t('profile.language')}
      />
      <PickerModal
        visible={currModalVisible}
        onClose={() => setCurrModalVisible(false)}
        options={currencyOptions}
        selected={currency}
        onSelect={setCurrency}
        title={t('profile.currency')}
      />
    </ScrollView>
  );
}
