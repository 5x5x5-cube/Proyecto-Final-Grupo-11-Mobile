import { StyleSheet } from 'react-native';
import { palette } from '@/theme/palette';
import { fontFamily } from '@/theme/typography';

export const styles = StyleSheet.create({
  cancellationCard: {
    backgroundColor: palette.surfaceContainer,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 10,
  },
  cancellationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cancellationTitle: {
    fontFamily: fontFamily.medium,
  },
  cancellationText: {
    lineHeight: 19,
  },
  policyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  policyText: {
    flex: 1,
    lineHeight: 19,
  },
  bold: {
    fontFamily: fontFamily.medium,
  },
});
