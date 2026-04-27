import { StyleSheet } from 'react-native';
import { palette } from '../../theme/palette';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
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
  headerInfo: {
    flex: 1,
  },
  name: {
    marginBottom: 2,
  },
  sectionTitle: {
    paddingTop: 14,
    paddingBottom: 4,
    paddingHorizontal: 16,
  },
  separator: {
    borderTopWidth: 1,
    borderTopColor: palette.outlineVariant,
  },
  versionText: {
    fontSize: 12,
    color: palette.outline,
    textAlign: 'center',
    marginTop: 16,
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
});
