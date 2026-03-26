import { StyleSheet } from 'react-native';
import { palette } from '@/theme/palette';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.surface,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 90,
  },
  methodLabel: {
    marginBottom: 12,
  },
  methodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  methodCard: {
    width: '48%',
    backgroundColor: palette.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.outlineVariant,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  methodCardSelected: {
    borderColor: palette.primary,
    borderWidth: 2,
    backgroundColor: palette.primaryContainer,
  },
  methodText: {},
  methodTextSelected: {
    color: palette.primary,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  fieldInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: palette.onSurface,
    padding: 0,
  },
  fieldRowSplit: {
    flexDirection: 'row',
    gap: 0,
    paddingVertical: 8,
  },
  fieldHalf: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fieldHalfDivider: {
    width: 1,
    backgroundColor: palette.outlineVariant,
    marginHorizontal: 8,
  },
  summaryTitle: {
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {},
  summaryValue: {},
  summaryDividerSpacing: {
    marginVertical: 8,
  },
  summaryTotalLabel: {},
  summaryTotalValue: {},
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  securityText: {},
});
