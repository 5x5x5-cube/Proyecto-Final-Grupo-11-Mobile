import { StyleSheet } from 'react-native';
import { palette } from '../../theme/palette';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: 'center',
  },
  qrCard: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.outlineVariant,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  codeBadge: {
    backgroundColor: palette.primaryContainer,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 16,
  },
  codeText: {
    letterSpacing: 1,
  },
  hotelName: {
    textAlign: 'center',
    marginBottom: 6,
  },
  dates: {
    textAlign: 'center',
    marginBottom: 4,
  },
  roomGuests: {
    textAlign: 'center',
    marginBottom: 20,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: palette.surfaceContainerHigh,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 16,
  },
  instructionCard: {
    backgroundColor: palette.surfaceContainer,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    alignSelf: 'stretch',
  },
  instructionText: {
    textAlign: 'center',
    lineHeight: 19,
  },
  errorCard: {
    alignItems: 'center',
    backgroundColor: palette.surfaceContainer,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 32,
    marginBottom: 20,
    alignSelf: 'stretch',
    gap: 12,
  },
  errorTitle: {
    textAlign: 'center',
  },
  errorMessage: {
    textAlign: 'center',
    lineHeight: 19,
  },
  qrPlaceholder: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
