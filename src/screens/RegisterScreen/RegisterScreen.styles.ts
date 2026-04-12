import { StyleSheet } from 'react-native';
import { palette } from '@/theme/palette';

export const styles = StyleSheet.create({
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
    marginTop: 6,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.outlineVariant,
    padding: 24,
  },
  cardTitle: {
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
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
    marginTop: 4,
  },
  buttonWrapper: {
    marginTop: 8,
  },
  linkRow: {
    alignItems: 'center',
    marginTop: 16,
  },
  linkText: {},
  linkBold: {},
});
