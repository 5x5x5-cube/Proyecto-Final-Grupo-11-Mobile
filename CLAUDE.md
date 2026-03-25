# TravelHub Mobile Prototype

## i18n Rule

**Never use hardcoded user-facing text in screens or components.** All visible strings must use `t()` from `react-i18next` with keys defined in both `src/i18n/locales/es/mobile.json` and `src/i18n/locales/en/mobile.json`. This includes:
- Labels, titles, placeholders, button text
- Error messages and validation text
- Modal titles
- Any string shown to the user

When adding new text, add the key to both ES and EN locale files first, then reference it via `t('namespace.key')`.

## Project Structure

- Screens: `src/screens/`
- Navigation: `src/navigation/` (AppNavigator, MainTabs, types)
- Reusable components: `src/components/`
- i18n locales: `src/i18n/locales/{es,en}/mobile.json` (screen text) and `common.json` (shared text)
- Mock data: `src/data/`
- Theme: `src/theme/palette.ts`
- Context: `src/contexts/LocaleContext.tsx`

## Key Conventions

- Use `useSafeAreaInsets()` only for bottom padding on stack screens with scrollable content. Top safe area is handled by root `SafeAreaView` in `App.tsx`.
- Reuse existing components: `TopBar`, `ActionBar`, `PickerModal`, `DatePickerModal`, `GuestPickerModal`, `StatusChip`, `InfoGrid`, `PriceBreakdown`.
- Use `palette` tokens from `src/theme/palette.ts` — never hardcode colors.

## Loading States (Skeletons)

- Use the `Skeleton` component from `src/components/Skeleton.tsx` (animated pulse, no extra deps).
- Skeleton files use the `.skeleton.tsx` suffix and live next to their screen (e.g., `ResultsScreen.skeleton.tsx` next to `ResultsScreen.tsx`).
- Skeleton layouts must match the real content layout to avoid layout shifts.
- Loading state pattern: `useState(true)` + `useEffect` with `setTimeout` to simulate API delay.
- Always-visible elements (TopBar, tabs, OfflineBanner) render immediately; only data-dependent content shows skeletons.
- Hide ActionBar while loading on screens that have one (PropertyDetail, ReservationSummary).
