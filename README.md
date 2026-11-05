# MountainIceMikes Tours and Travel

Build the complete web platform and tour operations system for MountainIceMikes Tours & Travel (mountainicemikes.com), built under Migradia Limited.

Architecture & Handoff Readiness:
- Monorepo-friendly architecture prepared for Cloudflare Pages, D1 (SQLite), R2 (object storage), KV (cache/rates), and Replit backend development.
- Abstracted API service layer with clean TypeScript interfaces (inquiries, trips, crew assignments, gear inventory) running with rich mock data by default (VITE_USE_MOCK=true) and zero-refactor endpoints pointing to /api/* when connected to Cloudflare Workers.
- Include schema definitions and mock data mirroring Cloudflare D1 tables (inquiries, trips, crew_assignments, gear_inventory).

Design & Alpine Aesthetics:
- Stoic, grounded Mount Kenya expedition aesthetic (inspired by Ahambi Tours and National Geographic Expeditions).
- Organic alpine palette: Basalt rock (#151719), glacial tarn slate (#3A4E5C), montane moorland green (#27382B), summit ochre (#C88238), and alpine chalk (#F6F5F1).
- Crisp Swiss/editorial typography with technical elevation tags (coordinates, elevation in meters ASL). Zero generic AI gradients or floating neon cards.
- Integrated high-resolution photography from the expedition album (Point Lenana, Lake Michaelson, Gorges Valley, Shipton's Camp, mountain crew).

Corporate Positioning:
- The company is the hero: institutional trust, safety, ethical porter welfare, and field readiness.
- Kevin Nderitu is featured in the About Us / Leadership section as Founder and Lead Guide with his 9+ years of alpine guiding and photography background.

Multi-Currency & Internationalization:
- Base rates in USD with automated/selectable currency switcher (USD, EUR, GBP, CAD, KES).
- Clear Non-Resident (USD) vs. Resident/Citizen (KES) toggle for park fee compliance.

The 5 Service Pillars:
1. Mountains:
   - Mt. Kenya: 5-Day Sirimon–Chogoria Traverse ($1,120–$1,350), 4-Day Naro Moru Fast Ascent ($820–$990), 6-Day Peak Circuit, and Technical Rock Climbs (Nelion & Batian).
   - Mt. Kilimanjaro: 7-Day Machame Route ($2,250), 8-Day Lemosho Route ($2,520), 6-Day Marangu.
   - Mt. Meru (4 Days, $920).
   - Interactive elevation profiles (meters ASL), day-by-day expedition logs, gear requirements, inclusions/exclusions, and dynamic group size calculator.

2. Safaris:
   - 3-Day & 5-Day Maasai Mara Great Migration Safaris.
   - Amboseli National Park (Elephants under Kilimanjaro).
   - Ol Pejeta & Samburu Northern Circuit.
   - Lake Nakuru & Lake Naivasha Rift Valley escapes.

3. Gear Rental:
   - 4-season 2-man and 4-man high-altitude tents ($15–$25/day), sub-zero down sleeping bags ($8/day), trekking poles, crampons, camp stoves, and mess kits with daily rate calculator and rental duration selector.

4. Transport & Fleet:
   - 4x4 Safari Land Cruisers (pop-up roof, UHF radio, dual spare tires, inverter chargers, $160–$220/day) and safari tour vans ($95–$140/day).
   - Selector: Chauffeur-driven with certified KATO driver-guide vs. self-drive rental.
   - Airport and Nanyuki transfers.

5. Other Services:
   - Corporate team building and weekend conditioning hikes (Elephant Hill, Mt. Longonot).
   - Film and photography expedition logistics.
   - Tailored VIP private itineraries.

Trust, Safety & Direct Channels:
- KWS compliance, certified alpine guides, wilderness first aid, pulse oximetry.
- Ethical Porter Welfare Pledge (fair wages, warm mountain gear, weight caps).
- Review showcases and floating WhatsApp Concierge drawer for direct communication.

Migradia Ops Back-End Portal (Protected Admin View):
- Leads & Inquiry pipeline (Kanban/table of web and WhatsApp inquiries).
- Trip manifest and calendar (active groups on mountain & safari).
- Crew & porter payroll ledger (daily rates, cash advances, gate payout balance).
- Gear and fleet availability tracker.
- Document vault for client passports and park permits.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3df4a68b-691b-4614-9a76-d136c2e2481c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
