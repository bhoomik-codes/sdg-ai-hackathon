# Commons — Community Resource Exchange

A responsive, installable web prototype that helps a campus connect usable surplus with nearby community needs.

## Start the judge-ready demo

1. Install Node.js 20.19+ or 22.12+.
2. Double-click **`start-demo.bat`**.
3. Open the local address shown in the terminal (usually `http://localhost:5173`).
4. Choose **Pitch mode** for the short presentation, or use the dashboard to run the live flow.

The demo opens with sample campus listings and fictional community partners. Try:

1. On Northbridge University, open **Match board** and offer the 24 biology textbooks to Westview University Learning Commons.
2. Open the workspace switcher and choose **Westview University · Recipient campus**. This demo login has no password.
3. Open **Incoming offers** and accept the offer.
4. Switch back to Northbridge University, open **Surplus listings**, and mark the accepted handoff fulfilled.
5. Use **Reset demo** before presenting again.

Without shared sync configured, demo changes stay in this browser. **Reset demo** restores the sample data; with Supabase enabled, it resets the shared demo for all visitors.

## Enable cross-device demo sync

The live handoff appears on another phone only when the shared Supabase demo backend is configured. Without these steps, each browser keeps its own local copy.

1. In Supabase, open **SQL Editor** and run [`supabase/schema.sql`](supabase/schema.sql). It creates the shared demo table, public demo-only access policies, and the Realtime publication entry.
2. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. If the project only has a legacy key, use `VITE_SUPABASE_ANON_KEY` instead.
3. For GitHub Pages, add repository **Variables** named `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (or `VITE_SUPABASE_ANON_KEY`) under **Settings → Secrets and variables → Actions**. Then run the **Deploy to GitHub Pages** workflow again.
4. Open Commons on both devices, switch one to Northbridge and the other to Westview, then send and accept an offer. The header status dot indicates whether the shared connection is active.

The publishable/anon key is intended for browser use. The schema exposes only fictional judge-demo records and allows any visitor to update or reset them, so this setup is for the public prototype—not production data. Never use a database password or `service_role`/secret key in the site.

## Open the live judge demo

After the GitHub Pages deployment completes, open [Commons on GitHub Pages](https://bhoomik-codes.github.io/sdg-ai-hackathon/). It publishes the demo build with sample listings, community needs, and the Northbridge/Westview campus switcher so judges can try the full flow on a phone or laptop. On supported phones, use the browser menu to add Commons to the home screen. Demo activity stays in that browser and is not shared with other visitors.

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
- Includes a second-campus demo login so one university can send surplus and another can accept it.
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

## Two-member pitch

The seven-slide deck includes speaker notes for Bhoomik Sevta and Chitransh Dhakar, with an opening, conversational problem setup, live match, first-year campus-cluster pilot, proposed brokerage/affiliate revenue model and shared closing. The printable run-of-show is in [`presentation/Two-Presenter-Script.md`](presentation/Two-Presenter-Script.md). In-app Pitch mode follows the same story and ends by opening the live Match board.
