# Arrowgo Website Improvement - Phase 1 (Frontend & UI/UX)

Same stack as VMVAS: React (Create React App) + Tailwind frontend, Node/Express backend, deployable to Hostinger.
Phase 1 scope: visual design, content presentation, frontend interactions. Booking forms, request submission, payments and operational integrations are OUT of scope.

## Structure
```
arrowgo-website/
  backend/    Express API serving the approved location + service directory (JSON now, MySQL later if needed)
  frontend/   React + Tailwind site (Hero > Solutions > Locations > Facilities > About > Contact)
```

## Run locally
```bash
# backend (port 5000)
cd backend && cp .env.example .env && npm install && npm run dev

# frontend (port 3000)
cd frontend && cp .env.example .env && npm install && npm start
```
`REACT_APP_API_URL` is read in `frontend/src/api.js`. If the API is down the site falls back to bundled data.

## Deploy (Hostinger)
- Backend: upload `backend/`, set `PORT` and `CORS_ORIGINS` (your frontend domain).
- Frontend: set `REACT_APP_API_URL` to the backend `/api` URL, run `npm run build`, upload `build/`.
  Add an SPA rewrite so `/solutions/*` routes load `index.html`.

## TODO before UAT (brief "Inputs to confirm")
- [ ] Brand assets, colors, typography -> `tailwind.config.js`
- [ ] Approved photography -> `Facilities.jsx`
- [ ] Approved location/service directory -> `backend/data/*.json` (replace SAMPLE entries) and `frontend/src/data/*`
- [ ] Real simplified Philippine SVG -> `PhilippineMap.jsx` (ISLANDS placeholder)
- [ ] Interactive globe (drag/swipe, keyboard) -> `GlobePreview.jsx`
- [ ] Verified contact details and policy links -> `Footer.jsx`
- [ ] Performance budget, then verify: keyboard, touch/swipe, mobile layout, globe fallback, empty map state
