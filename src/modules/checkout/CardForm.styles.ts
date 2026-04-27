import { StyleSheet } from 'react-native';
import { palette } from '@/theme/palette';

export const styles = StyleSheet.create({
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
});
