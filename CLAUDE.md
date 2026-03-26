# TravelHub Mobile Prototype

## Design System Rules

- **Use the `Text` component** from `src/components/Text.tsx` instead of raw `<Text>` from React Native. It enforces typography tokens (`variant` prop) and palette colors (`color` prop). Example: `<Text variant="body" color={palette.onSurface}>Hello</Text>`
- **Use `typography` tokens** from `src/theme/typography.ts` — never hardcode `fontFamily`, `fontSize`, or `lineHeight` in StyleSheet. Available variants: `h1`, `h2`, `h3`, `subtitle`, `body`, `bodySmall`, `caption`, `captionSmall`, `label`, `button`
- **Use `palette` tokens** from `src/theme/palette.ts` — never hardcode colors (no `'#fff'`, `'#000'`, `'rgba(...)'`). Use `palette.surface`, `palette.onSurface`, etc.
- **Prefer creating reusable components** in `src/components/` — avoid duplicating UI patterns across screens
- **Reuse existing components** before writing new ones: `TopBar`, `ActionBar`, `Text`, `Card`, `PrimaryButton`, `Divider`, `PickerModal`, `DatePickerModal`, `GuestPickerModal`, `StatusChip`, `InfoGrid`, `PriceBreakdown`, `Skeleton`, `AmenityTag`, `FilterChip`

## Project Structure

```
src/
├── api/                    # HTTP client, mock handlers
│   └── hooks/              # React Query hooks (useCart, useBookings, etc.)
├── components/             # Shared/reusable design system components
│   ├── Text.tsx
│   ├── Card.tsx
│   ├── PrimaryButton.tsx
│   └── ...
├── contexts/               # React contexts (LocaleContext, etc.)
├── data/                   # Static mock data
├── i18n/                   # i18n config + locale files
│   └── locales/{es,en}/
├── modules/                # Feature-scoped components (NOT shared)
│   └── checkout/           # Components coupled to checkout flow
│       ├── HotelSummaryCard.tsx
│       ├── BookingInfoGrid.tsx
│       ├── CancellationPolicyCard.tsx
│       └── HoldCountdown.tsx
├── navigation/             # AppNavigator, MainTabs, types
├── screens/                # One folder per screen
│   └── ScreenName/
│       ├── ScreenName.tsx
│       ├── ScreenName.styles.ts
│       ├── ScreenName.test.tsx
│       ├── ScreenName.skeleton.tsx  (if applicable)
│       └── index.ts                 (re-export)
├── storage/                # AsyncStorage utilities
├── theme/                  # palette.ts, typography.ts
└── types/                  # Shared TypeScript types
```

### Where components go

- **`src/components/`** — Shared, reusable components used across multiple screens (Text, Card, TopBar, etc.). These are the design system.
- **`src/modules/{feature}/`** — Components scoped to a specific feature/flow. If a component is only used by checkout screens, it goes in `src/modules/checkout/`, NOT in `src/components/`. This mirrors the web client pattern.
- **`src/screens/{ScreenName}/`** — Each screen in its own folder with styles, test, skeleton, and index.ts re-export.

## Styles

- **Always extract styles to a separate `.styles.ts` file** — no `StyleSheet.create` in the same file as the component. This applies to screens and components alike.
- The only exception: very small components (<30 lines total) where the style is a single entry.
- `StyleSheet.create` for all styles — no inline `style={{}}` objects with computed values (dynamic colors via array syntax `[styles.base, { color }]` is acceptable).

## Testing

- **Co-locate tests** — test files live next to their source: `Component.test.tsx` next to `Component.tsx`. No `__tests__/` directories.
- Every component and screen should have at least a basic render test.
- Use `jest.useFakeTimers()` for time-dependent tests (countdowns, etc.).
- Mock navigation, i18n, and external modules (expo-linear-gradient, @expo/vector-icons) in tests.

## i18n Rule

**Never use hardcoded user-facing text in screens or components.** All visible strings must use `t()` from `react-i18next` with keys defined in both `src/i18n/locales/es/mobile.json` and `src/i18n/locales/en/mobile.json`. This includes:

- Labels, titles, placeholders, button text
- Error messages and validation text
- Modal titles
- Any string shown to the user

When adding new text, add the key to both ES and EN locale files first, then reference it via `t('namespace.key')`.

**API error messages must NOT be displayed directly to users** — map error codes/status to i18n keys instead.

## Import Aliases

- Use `@/` alias for all imports from `src/` — avoid relative paths like `../../` whenever possible
- Example: `import Text from '@/components/Text'`, `import { palette } from '@/theme/palette'`
- Configured in `tsconfig.json` (paths), `babel.config.js` (module-resolver), and `jest.config.js` (moduleNameMapper)
- Use `import type` for type-only imports

## Key Conventions

- Use `useSafeAreaInsets()` only for bottom padding on stack screens with scrollable content. Top safe area is handled by root `SafeAreaView` in `App.tsx`.

## Loading States (Skeletons)

- Use the `Skeleton` component from `src/components/Skeleton.tsx` (animated pulse, no extra deps).
- Skeleton files use the `.skeleton.tsx` suffix and live next to their screen in the screen folder.
- Skeleton layouts must match the real content layout to avoid layout shifts.
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
