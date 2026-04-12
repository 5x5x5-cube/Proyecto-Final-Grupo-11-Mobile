import { StyleSheet } from 'react-native';
import { palette } from '@/theme/palette';

export const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: palette.surface,
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: palette.successContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  codeBadge: {
    backgroundColor: palette.primaryContainer,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 24,
  },
  codeLabel: {
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  codeValue: {},
  summaryCardWidth: {
    width: '100%',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {},
  summaryValue: {
    textAlign: 'right',
    flexShrink: 1,
    marginLeft: 16,
  },
  primaryButtonWrapper: {
    width: '100%',
    marginBottom: 16,
  },
  linkText: {},
});
