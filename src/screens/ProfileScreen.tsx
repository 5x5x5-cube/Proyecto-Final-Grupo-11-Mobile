import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/types';
import { palette } from '../theme/palette';
import { useLocale, currencyNames, languageNames } from '../contexts/LocaleContext';
import type { Language, Currency } from '../contexts/LocaleContext';
import ProfileMenuRow from '../components/ProfileMenuRow';
import PickerModal from '../components/PickerModal';

const languageOptions: { key: Language; label: string }[] = [
  { key: 'ES', label: 'ES \u2014 Espa\u00f1ol' },
  { key: 'EN', label: 'EN \u2014 English' },
];

const currencyOptions: { key: Currency; label: string }[] = [
  { key: 'COP', label: 'COP \u2014 Peso colombiano' },
  { key: 'USD', label: 'USD \u2014 D\u00f3lar estadounidense' },
  { key: 'MXN', label: 'MXN \u2014 Peso mexicano' },
  { key: 'ARS', label: 'ARS \u2014 Peso argentino' },
  { key: 'CLP', label: 'CLP \u2014 Peso chileno' },
  { key: 'PEN', label: 'PEN \u2014 Sol peruano' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation('mobile');
  const { language, currency, setLanguage, setCurrency } = useLocale();

  const [langModalVisible, setLangModalVisible] = useState(false);
  const [currModalVisible, setCurrModalVisible] = useState(false);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top + 20 }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>CM</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>Carlos Martinez</Text>
          <Text style={styles.email}>carlos.martinez@email.com</Text>
        </View>
      </View>

      {/* Personal info card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Informacion personal</Text>
        <ProfileMenuRow
          icon={<MaterialCommunityIcons name="account-outline" size={20} color={palette.onSurfaceVariant} />}
          label="Nombre"
          value="Carlos Martinez"
        />
        <View style={styles.separator} />
        <ProfileMenuRow
          icon={<MaterialCommunityIcons name="email-outline" size={20} color={palette.onSurfaceVariant} />}
          label="Email"
          value="carlos.martinez@email.com"
        />
        <View style={styles.separator} />
        <ProfileMenuRow
          icon={<MaterialCommunityIcons name="phone-outline" size={20} color={palette.onSurfaceVariant} />}
          label="Telefono"
          value="+57 300 123 4567"
        />
      </View>

      {/* Preferences card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Preferencias</Text>
        <ProfileMenuRow
          icon={<MaterialCommunityIcons name="web" size={20} color={palette.onSurfaceVariant} />}
          label="Idioma"
          value={`${language} \u2014 ${languageNames[language]}`}
          onPress={() => setLangModalVisible(true)}
        />
        <View style={styles.separator} />
        <ProfileMenuRow
          icon={<MaterialCommunityIcons name="currency-usd" size={20} color={palette.onSurfaceVariant} />}
          label="Moneda"
          value={`${currency} \u2014 ${currencyNames[currency]}`}
          onPress={() => setCurrModalVisible(true)}
        />
        <View style={styles.separator} />
        <ProfileMenuRow
          icon={<MaterialCommunityIcons name="bell-outline" size={20} color={palette.onSurfaceVariant} />}
          label="Notificaciones"
        />
      </View>

      {/* Logout button */}
      <Pressable style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
        <MaterialCommunityIcons name="logout" size={20} color={palette.error} />
        <Text style={styles.logoutText}>Cerrar sesion</Text>
      </Pressable>

      {/* Modals */}
      <PickerModal
        visible={langModalVisible}
        onClose={() => setLangModalVisible(false)}
        options={languageOptions}
        selected={language}
        onSelect={setLanguage}
        title="Idioma"
      />
      <PickerModal
        visible={currModalVisible}
        onClose={() => setCurrModalVisible(false)}
        options={currencyOptions}
        selected={currency}
        onSelect={setCurrency}
        title="Moneda"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: palette.onSurface,
    marginBottom: 2,
  },
  email: {
    fontSize: 13,
    color: palette.onSurfaceVariant,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.outlineVariant,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.onSurface,
    paddingTop: 14,
    paddingBottom: 4,
  },
  separator: {
    borderTopWidth: 1,
    borderTopColor: palette.outlineVariant,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: palette.error,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 6,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.error,
  },
});
