import { StyleSheet } from 'react-native';
import { palette } from '@/theme/palette';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: palette.errorContainer,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 14,
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
  },
  codeText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    marginBottom: 8,
  },
  policyText: {
    lineHeight: 19,
  },
  refundRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dividerSpacing: {
    marginVertical: 8,
  },
  totalValue: {
    color: palette.success,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodCard: {
    marginBottom: 2,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  outlinedButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: palette.outline,
    borderRadius: 12,
    paddingVertical: 14,
  },
  errorFilledButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.error,
    borderRadius: 12,
    paddingVertical: 14,
  },
});
