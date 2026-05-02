import { StyleSheet } from 'react-native';
import { palette } from '@/theme/palette';

export const styles = StyleSheet.create({
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  pickerText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
  },
  fieldInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: palette.onSurface,
    padding: 0,
  },
  errorText: {
    marginTop: 4,
    marginLeft: 32,
  },
});
