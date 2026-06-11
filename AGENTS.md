# CISA — Citas de Barbería

## Stack
- Firebase Realtime Database + Auth (CDN compat SDKs)
- No build tools; vanilla JS in HTML files
- Auth: Email/Password, company gate "TijeraSeca"

## Files
- `admin.html` — Admin panel (login, data editor, appointment management)
- `barberia.html` — Public booking site

## DB Paths
- `cisa/config` — Auth-protected read/write (business info, color scheme)
- `cisa/data` — Auth-protected read/write (appointments, services, schedule, barbers, prices, gallery, adPopup, logoUrl)
- `cisa/data/appointments` — Public read+write (push-keyed raw appointments from barberia)

## Key patterns
- Admin reads `cisa/data` (full snapshot), merges push-keyed appointments into array on each `value` event
- `saveData()` uses `set()` (overwrites entire `cisa/data` array)
- `loadAppData()` uses `Object.assign(appData, val)` to merge (never replace the whole object)
- `getData()` fills missing properties from `getDefaultData()` to handle corrupted localStorage
- `initAdmin()` called immediately after login auth (outside Firebase listeners) so page never blocks on DB
- `saveData()` persists to both localStorage (`barberco_data`) and Firebase `cisa/data`
- `pushConfig()` saves to both Firebase (`cisa/config`) and localStorage (`cisa_auth`) — barberia reads `cisa_auth` for colors + contact info

## Multimedia (admin Multimedia page)
- **Logo URL** stored in `appData.logoUrl` — applied to nav, hero, and footer logos in barberia.html + sidebar in admin
- **Gallery** stored in `appData.gallery[]` — array of `{ type:'image'|'video', src:'URL', barber:'carlos'|'iker' }`
- Gallery is rendered in barberia.html as a 3-slide carousel (active + side-left + side-right)
- Admin can add, edit, delete gallery items and change the logo URL

## Color Scheme → Web
- Admin selects a scheme card (visual preview only), then clicks "Aplicar cambios en la web"
- `applySchemeToWeb()` calls `applyScheme()` (admin CSS) + `pushConfig()` (Firebase + localStorage)
- barberia.html reads `cisa_auth` from localStorage on load and applies CSS variables
- Contact info (address, phone, email) propagates the same way via `pushConfig()`

## Anuncios / Popup (admin Anuncios page)
- **Popup** stored in `appData.adPopup` — enabled/disabled toggle
- Customizable: title, description, button text+link, background gradient (presets + custom), text color, shape (center/bottom/full), show-once-per-session, optional barber card with price
- Admin preview button shows a live preview modal
- barberia.html: `showPopupIfNeeded()` runs on page load — renders the popup with full styling, auto-closes on overlay click, respects `showOnce` via `sessionStorage`

## Critical rules
- Firebase Realtime Database must allow public read+write at `cisa/data/appointments` even though `cisa/data` and `cisa/config` require auth
- admin.html and barberia.html share localStorage key `barberco_data` — `getData()` fills missing keys from defaults

## Mobile breakpoints
- 900px: sidebar→56px, stats 2-col, scrollable tables
- 600px: sidebar→48px, stats 1-col, full-width modals, schedule stacked, filter-bar column
- 380px: sidebar→40px, tighter padding

## Testing
- Ctrl+F5 admin.html to force fresh load after changes
- Check F12 console for Firebase connectivity errors
- Firebase rules updated via Firebase Console → Realtime Database → Rules
