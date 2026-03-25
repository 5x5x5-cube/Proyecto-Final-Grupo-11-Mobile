# TravelHub Mobile Prototype

React Native mobile app prototype for the TravelHub hotel booking platform, built with Expo SDK 55.

## Tech Stack

- **Framework**: React Native 0.83 + Expo SDK 55
- **Navigation**: React Navigation 7 (native-stack + bottom-tabs)
- **State Management**: React Query (TanStack Query v5)
- **i18n**: react-i18next with ES/EN locale support
- **Fonts**: Roboto via @expo-google-fonts

## Getting Started

```bash
# Install dependencies
npm install

# Start Expo dev server
npm start

# Run on specific platform
npm run ios
npm run android
npm run web
```

## Project Structure

```
src/
├── api/                # HTTP client, React Query hooks, mock handlers
│   ├── hooks/          # useAuth, useBookings, usePayments, useSearch
│   ├── httpClient.ts
│   ├── mockHandlers.ts
│   └── queryClient.ts
├── components/         # Reusable UI components
│   ├── Skeleton.tsx    # Animated skeleton placeholder
│   ├── DatePickerModal.tsx
│   ├── GuestPickerModal.tsx
│   └── ...
├── contexts/           # LocaleContext (language + currency)
├── data/               # Mock data (hotels, reservations, destinations)
├── i18n/               # i18next config + locale JSON files
│   └── locales/
│       ├── en/         # English translations
│       └── es/         # Spanish translations
├── navigation/         # App navigator, main tabs, route types
├── screens/            # All app screens
│   ├── SearchScreen.tsx
│   ├── ResultsScreen.tsx
│   ├── ResultsScreen.skeleton.tsx
│   ├── PropertyDetailScreen.tsx
│   ├── PropertyDetailScreen.skeleton.tsx
│   ├── ReservationSummaryScreen.tsx
│   ├── PaymentScreen.tsx
│   ├── SuccessScreen.tsx
│   ├── MyReservationsScreen.tsx
│   ├── ReservationDetailScreen.tsx
│   ├── CancelReservationScreen.tsx
│   ├── QRCheckInScreen.tsx
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   └── ProfileScreen.tsx
└── theme/              # Color palette tokens
```

## Screens

| Screen | Description |
|--------|-------------|
| Search | Hero gradient, destination picker, date & guest selectors |
| Results | Hotel cards with ratings, prices, and filter chips |
| Property Detail | Rooms, reviews, amenities, and booking action bar |
| Reservation Summary | Booking overview before payment |
| Payment | Card input with validation (number grouping, MM/YY, CVV) |
| Success | Confirmation with reservation details |
| My Reservations | Active/past reservations list |
| Reservation Detail | Full booking info with QR check-in and cancel options |
| Cancel Reservation | Cancellation flow with confirmation |
| QR Check-In | QR code display for hotel check-in |
| Login / Register | Auth forms with validation and loading states |
| Profile | User info, language/currency selectors |

## Key Features

- **Internationalization**: Full ES/EN support with dynamic language switching
- **Skeleton Loading**: Animated pulse skeletons matching real layouts (`.skeleton.tsx` files)
- **Form Validation**: Inline errors with touched-state tracking, field navigation (next/done)
- **React Query**: All data fetching via custom hooks with mock API handlers
- **Safe Area Handling**: Centralized via root SafeAreaView, bottom padding on scroll screens
