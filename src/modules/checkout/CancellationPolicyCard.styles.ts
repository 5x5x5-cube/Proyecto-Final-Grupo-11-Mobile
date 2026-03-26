import { StyleSheet } from 'react-native';
import { palette } from '@/theme/palette';

export const styles = StyleSheet.create({
  cancellationCard: {
    backgroundColor: palette.successContainer,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cancellationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cancellationText: {
    lineHeight: 19,
  },
});
