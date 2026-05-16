import { StyleSheet } from 'react-native';
import { palette } from '@/theme/palette';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24, // base padding; insets.bottom added dynamically
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  code: {
    fontWeight: '600',
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.outlineVariant,
    marginBottom: 14,
  },
  cardInner: {
    padding: 16,
  },
  hotelGradient: {
    height: 120,
  },
  hotelInfo: {
    padding: 14,
  },
  hotelType: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  hotelName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  hotelLocation: {},
  ratingRow: {
    marginTop: 8,
  },
  roomLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  roomValue: {
    fontWeight: '500',
  },
  priceTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  nextStepsTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  nextStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  nextStepText: {
    flex: 1,
    gap: 2,
  },
  buttonsColumn: {
    gap: 10,
    marginTop: 4,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: palette.primary,
    borderRadius: 12,
    paddingVertical: 14,
  },
  primaryButtonText: {
    fontWeight: '600',
  },
  errorButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: palette.error,
    borderRadius: 12,
    paddingVertical: 14,
  },
  errorButtonText: {
    fontWeight: '600',
  },
  paymentCardTitle: {
    fontWeight: '600',
    marginBottom: 14,
  },
  paymentCardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  paymentStatusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentCardDetails: {
    flex: 1,
    gap: 2,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  paymentCardRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  paymentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 100,
  },
  paymentBadgeText: {
    fontWeight: '600',
    fontSize: 11,
  },
});
