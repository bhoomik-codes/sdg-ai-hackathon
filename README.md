# Commons — Community Resource Exchange

A responsive, installable web prototype that helps a campus connect usable surplus with nearby community needs.

## Start the judge-ready demo

1. Install Node.js 20.19+ or 22.12+.
2. Double-click **`start-demo.bat`**.
3. Open the local address shown in the terminal (usually `http://localhost:5173`).
4. Choose **Pitch mode** for the short presentation, or use the dashboard to run the live flow.

The demo opens with sample campus listings and fictional community partners. Try:

1. Open the textbook match for BrightPath Learning Centre.
2. Offer the 24 books against its request for 18.
3. Open **Surplus listings** and mark the handoff fulfilled.
4. Use **Reset demo** before presenting again.

Demo changes are kept in this browser only. **Reset demo** restores the sample data.

## Build and run

```sh
npm install
npm run dev:demo
npm run build:demo
npm run build:production
npm run deck
```

- `npm run build:demo` creates the sample-data build in `dist-demo/`.
- `npm run build:production` creates a clean, sample-free build in `dist/`.
- `start-production.bat` builds and previews the production version.
- `npm run deck` creates `presentation/Commons-Pitch-Deck.pptx` after the prototype is ready.

## What the prototype does

- Lists surplus items with category, quantity, condition, campus pickup point and availability.
- Lists community needs with organisation, category, quantity, location and urgency.
- Ranks suggestions using transparent rules: category match, available quantity, item condition and known distance.
- Connects an offer to a request and tracks requested and fulfilled states.
- Provides a presenter mode with a short talk track and links into the live match board.
- Includes an installable web manifest and a small offline shell cache for the production build.

## Prototype boundaries

- Partner names, locations, distances and requests are fictional sample records.
- Matching is deterministic and explainable. It does not use an AI model or live map data.
- NGO verification is **not connected**. The demo never sends or stores an NGO registration ID; any real identity review requires an approved verification provider and a human coordinator.
- Demo records live in local browser storage and are not shared between people or devices.
- The production build starts with empty data. A real launch needs an API, persistent shared database, authentication, access controls, partner onboarding and an approved verification process. Configure the backend URL in `.env` when that service exists.
- Food and other time-sensitive donations need coordinator review and a safe handoff process before real-world use.

## Stack

- React 19 and Vite 8
- Tailwind CSS 4 with the Vite plugin
- Tabler icons and locally bundled DM Sans / Manrope variable fonts
- PptxGenJS for the judge pitch deck

All matching, registration status and impact counts shown in this prototype are illustrative. No real impact has been measured yet.
