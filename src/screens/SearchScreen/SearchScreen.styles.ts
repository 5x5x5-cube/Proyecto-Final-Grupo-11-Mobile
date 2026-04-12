import { StyleSheet } from 'react-native';
import { palette } from '@/theme/palette';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.surface,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  brandRow: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  hero: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  heroTitle: {},
  heroSubtitle: {
    marginTop: 6,
    marginBottom: 20,
  },
  form: {
    gap: 10,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: palette.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  fieldText: {
    flex: 1,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dateField: {
    flex: 1,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: palette.primaryContainer,
    borderRadius: 12,
    paddingVertical: 14,
  },
  searchButtonText: {},
  destinationsSection: {
    marginTop: 24,
  },
  sectionTitle: {
    marginBottom: 14,
    paddingHorizontal: 20,
  },
  destinationsList: {
    gap: 10,
    paddingHorizontal: 20,
  },
  destCard: {
    minWidth: 130,
    height: 100,
    borderRadius: 14,
    padding: 14,
    justifyContent: 'flex-end',
  },
  destCardSelected: {
    borderWidth: 2,
    borderColor: palette.onPrimary,
  },
  destCount: {
    marginTop: 2,
  },
});
