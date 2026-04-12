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
  priceTitle: {
    marginBottom: 12,
  },
});
