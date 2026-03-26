# TravelHub Mobile Prototype

## Design System Rules

- **Use the `Text` component** from `src/components/Text.tsx` instead of raw `<Text>` from React Native. It enforces typography tokens (`variant` prop) and palette colors (`color` prop). Example: `<Text variant="body" color={palette.onSurface}>Hello</Text>`
- **Use `typography` tokens** from `src/theme/typography.ts` — never hardcode `fontFamily`, `fontSize`, or `lineHeight` in StyleSheet. Available variants: `h1`, `h2`, `h3`, `subtitle`, `body`, `bodySmall`, `caption`, `captionSmall`, `label`, `button`
- **Use `palette` tokens** from `src/theme/palette.ts` — never hardcode colors (no `'#fff'`, `'#000'`, `'rgba(...)'`). Use `palette.surface`, `palette.onSurface`, etc.
- **Prefer creating reusable components** in `src/components/` — avoid duplicating UI patterns across screens
- **Extract styles to separate files** — screens should have a co-located `.styles.ts` file (e.g., `PropertyDetailScreen.styles.ts`) instead of defining `StyleSheet.create` inline at the bottom. Small components (<50 lines) may keep styles co-located
- **Reuse existing components** before writing new ones: `TopBar`, `ActionBar`, `Text`, `PickerModal`, `DatePickerModal`, `GuestPickerModal`, `StatusChip`, `InfoGrid`, `PriceBreakdown`, `Skeleton`, `AmenityTag`, `FilterChip`

## i18n Rule

**Never use hardcoded user-facing text in screens or components.** All visible strings must use `t()` from `react-i18next` with keys defined in both `src/i18n/locales/es/mobile.json` and `src/i18n/locales/en/mobile.json`. This includes:

- Labels, titles, placeholders, button text
- Error messages and validation text
- Modal titles
- Any string shown to the user

When adding new text, add the key to both ES and EN locale files first, then reference it via `t('namespace.key')`.

**API error messages must NOT be displayed directly to users** — map error codes/status to i18n keys instead.

## Project Structure

- Screens: `src/screens/`
- Screen styles: `src/screens/*.styles.ts` (co-located with screen file)
- Navigation: `src/navigation/` (AppNavigator, MainTabs, types)
- Reusable components: `src/components/`
- Checkout components: `src/components/checkout/`
- Types: `src/types/`
- API hooks: `src/api/hooks/`
- API client: `src/api/httpClient.ts`
- Mock handlers: `src/api/mockHandlers.ts`
- Local storage: `src/storage/`
- i18n locales: `src/i18n/locales/{es,en}/mobile.json` (screen text) and `common.json` (shared text)
- Mock data: `src/data/`
- Theme: `src/theme/palette.ts`, `src/theme/typography.ts`
- Context: `src/contexts/LocaleContext.tsx`

## Key Conventions

- Use `useSafeAreaInsets()` only for bottom padding on stack screens with scrollable content. Top safe area is handled by root `SafeAreaView` in `App.tsx`.
- `StyleSheet.create` for all styles — no inline `style={{}}` objects with computed values (dynamic colors via array syntax `[styles.base, { color }]` is acceptable).
- Use `import type` for type-only imports.

## Loading States (Skeletons)

- Use the `Skeleton` component from `src/components/Skeleton.tsx` (animated pulse, no extra deps).
- Skeleton files use the `.skeleton.tsx` suffix and live next to their screen (e.g., `ResultsScreen.skeleton.tsx` next to `ResultsScreen.tsx`).
- Skeleton layouts must match the real content layout to avoid layout shifts.
- Loading state pattern: `useState(true)` + `useEffect` with `setTimeout` to simulate API delay.
- Always-visible elements (TopBar, tabs, OfflineBanner) render immediately; only data-dependent content shows skeletons.
- Hide ActionBar while loading on screens that have one (PropertyDetail, ReservationSummary).

## Pull Requests

- All PRs must follow the template in `.github/PULL_REQUEST_TEMPLATE.md`
- Every PR must include:
  - **Ticket**: link to the related ticket/issue
  - **Descripción**: brief description of the changes
  - **Cambios realizados**: bullet list of specific changes made
- Write PR descriptions in Spanish
- Use conventional commit format for PR titles in English: `type(scope): description`
