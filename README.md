# RUMA Mobile (React Native / Expo)

Cross-platform (iOS + Android) client for RUMA, built against the
[RUMA-BACKEND](https://github.com/Rental-and-Utility-Management-App/RUMA-BACKEND) Go/Gin API.
Styled with the RUMA design system tokens (see `../tokens/`, ported to hex in `src/theme/tokens.ts`
since React Native has no `oklch()`/CSS variables).

## Setup

```
cd mobile-app-rn
npm install
npx expo start
```

Point the app at your backend: set `EXPO_PUBLIC_API_BASE_URL` (e.g. in a `.env` file read by
`app.config`, or export it before `expo start`) to your deployed/local RUMA-BACKEND URL
+ `/api`, e.g. `http://192.168.1.20:8080/api`. Defaults to `http://localhost:8080/api`
(only works in a simulator on the same machine as the server).

## Structure

- `src/theme/tokens.ts` — colors/type/spacing ported from the design system
- `src/api/` — typed Axios client + one module per backend resource (auth, rooms, invoices, contracts, payments, reports), matching `internal/routes/routes.go` 1:1
- `src/context/AuthContext.tsx` — JWT auth, persisted with AsyncStorage, auto-logout on 401
- `src/navigation/` — role-aware tabs: Manager gets Units; both roles get Dashboard/Billing/Contracts/Profile
- `src/components/` — Button, Card, Badge, Input, loading/empty/error states
- `src/screens/` — Login, Dashboard, Units, Unit detail, Billing, Invoice detail, Contracts, Profile

## Roles

- **Manager**: dashboard summary (`/reports/summary`), full unit list + checkout action, all invoices/contracts.
- **Tenant**: dashboard shows their own room + current bill, invoices/contracts auto-filtered server-side.

## Not yet wired (left for iteration)

Create/edit flows for rooms, contracts, invoices and payments (manager-only writes) — this pass
covers the read/browse screens matching the existing HTML mobile kit plus login and profile.
Wire these in as the same list/detail pattern once you decide on the exact forms.
