# Photo Optimizer / ColorSnap

This repo currently contains:

- **Legacy static site (HTML/CSS/JS)** at the repo root (e.g. `index.html`, `analysis.html`).
- **New React rebuild** inside `web/` (Vite + React + React Router).

## Run the React app

### Prerequisites

- Node.js **18+**
- npm (comes with Node)

### Install + start dev server

```bash
cd "web"
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Build (production)

```bash
cd "web"
npm run build
npm run preview
```

The production build output is in `web/dist/`.

## Where to edit things

- **Pages (routes)**: `web/src/pages/*`
- **Shared layout (header/footer)**: `web/src/components/*`
- **Global styles**: `web/public/global.css`
- **Images**: `web/public/images/*` (served at `images/...`)

## Notes about the demo logic

- **Upload → Result** uses `localStorage` key `uploadedPhoto` (Base64 data URL) to preserve your photo across pages.
- **Shopping cart** uses `localStorage` key `shoppingCart`.


