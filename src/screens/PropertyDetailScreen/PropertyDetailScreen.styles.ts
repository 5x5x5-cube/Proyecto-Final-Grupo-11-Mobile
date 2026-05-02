import { Dimensions, StyleSheet } from 'react-native';
import { palette } from '@/theme/palette';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.surface,
  },
  scroll: {
    flex: 1,
  },

  // ── Galería ────────────────────────────────────────────────────────────────
  galleryContainer: {
    height: 240,
    position: 'relative',
  },
  gallerySlide: {
    width: SCREEN_WIDTH,
    height: 240,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideIndicator: {
    position: 'absolute',
    top: 16,
    right: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  dotsRow: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  dotActive: {
    backgroundColor: palette.onPrimary,
    width: 14,
  },

  // ── Contenido ──────────────────────────────────────────────────────────────
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  hotelType: {
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  hotelName: {
    marginBottom: 6,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 8,
  },
  location: {
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  ratingBadge: {
    backgroundColor: palette.primary,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  ratingBadgeText: {},
  reviewCount: {},
  description: {
    lineHeight: 21,
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 12,
    marginTop: 4,
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },

  // ── Cancelación gratuita ───────────────────────────────────────────────────
  cancellationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: palette.successContainer,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.success,
    padding: 12,
    marginBottom: 20,
  },
  cancellationText: {
    flex: 1,
    gap: 2,
  },

  // ── Tarjeta de habitación ──────────────────────────────────────────────────
  roomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.outlineVariant,
    padding: 12,
    gap: 12,
    marginBottom: 10,
  },
  roomCardSelected: {
    borderColor: palette.primary,
    borderWidth: 2,
    backgroundColor: palette.primaryContainer,
  },
  roomGradient: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  roomInfo: {
    flex: 1,
    gap: 4,
  },
  roomName: {
    fontWeight: '600',
  },
  roomMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomPrice: {
    fontWeight: 'bold',
  },
  selectBtn: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  selectBtnSelected: {
    backgroundColor: palette.primary,
  },
  selectBtnText: {
    fontWeight: '600',
  },

  // ── Desglose de precio ────────────────────────────────────────────────────
  breakdownCard: {
    backgroundColor: palette.surfaceVariant,
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
    marginBottom: 20,
    gap: 8,
  },
  breakdownTitle: {
    marginBottom: 4,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownTotalRow: {
    borderTopWidth: 1,
    borderTopColor: palette.outlineVariant,
    paddingTop: 8,
    marginTop: 4,
  },

  // ── Reseñas ───────────────────────────────────────────────────────────────
  reviewsList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  reviewCard: {
    minWidth: 220,
    backgroundColor: palette.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.outlineVariant,
    padding: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: palette.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewName: {
    fontWeight: '600',
  },
  starsRowSmall: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 6,
  },

  // ── Barra de acción ───────────────────────────────────────────────────────
  actionBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 12,
  },
  actionPriceContainer: {
    flex: 1,
    flexShrink: 1,
  },
  actionPrice: {},
  scrollSpacer: {
    height: 100,
  },
});
