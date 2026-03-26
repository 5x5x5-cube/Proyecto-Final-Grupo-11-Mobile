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
  hero: {
    height: 200,
    justifyContent: 'flex-end',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  photoBadgeText: {},
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  hotelType: {
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  hotelName: {
    marginBottom: 4,
  },
  location: {
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    marginBottom: 20,
  },
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
  },
  roomName: {
    fontWeight: '600',
    marginBottom: 2,
  },
  roomBeds: {},
  roomPrice: {
    fontWeight: 'bold',
  },
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
  avatarText: {},
  reviewName: {
    fontWeight: '600',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 6,
  },
  reviewText: {
    lineHeight: 18,
  },
  actionBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionPrice: {},
  actionPriceLabel: {},
});
