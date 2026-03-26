import { StyleSheet } from 'react-native';
import { palette } from '../../theme/palette';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.outlineVariant,
    padding: 16,
    marginBottom: 12,
  },
  hotelRow: {
    flexDirection: 'row',
    gap: 12,
  },
  hotelGradient: {
    width: 64,
    height: 64,
    borderRadius: 10,
  },
  hotelInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  hotelName: {
    marginBottom: 2,
  },
  hotelLocation: {
    marginBottom: 2,
  },
  hotelRoom: {},
});
