# Frontend integration: what changed

Branch: `feature/vaancha-frontend` -> PR into `develop`.

## Run
```
cd server && npm install && npm run dev        # needs server/.env with MONGO_URI, JWT_SECRET
cd client && npm install && cp .env.example .env && npm run dev
```
The client proxies `/api` to `http://localhost:5000` (change with `VITE_API_TARGET` in `client/.env`).

## New
- `src/api/` http.js (fetch wrapper, JWT header, 401 handling), services.js (`authApi`, `lookupApi`, `foodApi`), normalize.js
- `src/context/` auth-context.js + AuthProvider.jsx (login, register, logout, session in localStorage)
- `src/hooks/useAsync.js`
- `src/components/` ProtectedRoute, FormField (reusable), Feedback (Spinner, ErrorMessage), FoodCard
- `src/pages/` Login, Register, Fridge (replace the placeholders), AuthForm.css, Fridge.css
- `src/styles/brand.css` Classic Green theme + Inter (loaded last), `public/logo.svg`, `public/favicon.svg`, `src/assets/fonts/`

## Changed (Lorena's files)
- `FoodForm.jsx`: category and unit are now dropdowns loaded from the API (they send IDs); quantity allows decimals; shelf is optional ("No shelf"); shows saving state and API errors; uses `FormField`.
- `Dashboard.jsx`, `AddFood.jsx`, `EditFood.jsx`: load/save through the API (sample data no longer used; `data/sampleFoods.js` can be deleted when you are ready).
- `Navbar.jsx`: logo, shows Login/Register when logged out, user name + Log out when logged in.
- `App.jsx`: protected routes. `main.jsx`: AuthProvider + brand.css.
- `utils/summary.js`: **bug fix.** The dashboard counted "expires today" as Expiring, but the cards and badges show it red. It now uses the same status rules, so "Expired" includes items that expire today.
- `utils/format.js`: "1 pc" for the new `pcs` unit, plus `formatDate`.
- `vite.config.js`: dev proxy. `index.html`: title.

## Tested
Lint clean, production build OK. 33 browser checks (Playwright) against a stand-in server that copies the real controllers' behaviour: protected routes, register/login (incl. 401/409 messages), dashboard counts and alerts, My Fridge list/sort/filter/empty states, add/edit/delete with confirm, JWT header, ID payloads, other users' items hidden, mobile layout.
Not yet run against the Atlas database. See `docs/BACKEND_NOTES_FOR_CHRIS.md` (shelf only saves after the model gets the field).
