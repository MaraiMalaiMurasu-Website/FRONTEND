# Maraimalai Murasu — Ads API Server

This tiny Node.js server makes the **Per-Slot Ad Manager** sync across every browser and device. Without it, ad uploads in Chrome don't appear in Edge (or on your phone, or for any visitor) because browser localStorage is private to each browser.

## ✅ What this fixes

| Before | After |
|---|---|
| Ad uploaded in Chrome → only visible in Chrome | Ad uploaded in any browser → visible to every visitor everywhere within 10 seconds |
| Each device had its own ads | One central source of truth |
| Visitors saw blank ad slots | Visitors see whatever you uploaded |

## 🚀 First-time setup (one-time)

Open a NEW terminal window (keep your normal Vite dev server running in another window).

```bash
cd "E:\maraimalai-murasu web\maraimalai-murasu\server"
npm install
```

This installs Express + CORS (about 5 seconds, ~20MB).

## 🟢 Start the server

Every time you want to work on the site, you now need TWO terminal windows:

**Terminal 1 (your existing one) — runs the React app:**
```bash
cd "E:\maraimalai-murasu web\maraimalai-murasu"
npm run dev
```

**Terminal 2 (new) — runs the Ads API:**
```bash
cd "E:\maraimalai-murasu web\maraimalai-murasu\server"
npm start
```

You'll see:
```
🟢 Maraimalai Murasu Ads API running on http://localhost:5050
```

Leave both windows open. Visit your site at http://localhost:5173 (or 5174).

## 🔍 How to verify it's working

1. Open the admin panel at http://localhost:5173/admin
2. Go to **Ad Manager**
3. Look at the green/red status badge at the top:
   - 🟢 **"Connected — ads sync to every browser & device"** → server is running, all good
   - 🔴 **"Ads API offline"** → start the server (Terminal 2 above)
4. Upload an ad image to any slot
5. Open the SAME site in Chrome (if you were in Edge) → you should see the new ad within 10 seconds
6. Or open `http://localhost:5050/api/ads` directly — you'll see your ad data as JSON

## 📦 Deploying to Hostinger

See `DEPLOY.md` next to this file for full instructions.

## ⚙️ Configuration

The server reads these environment variables (all optional):

| Var | Default | Purpose |
|---|---|---|
| `PORT` | `5050` | Which port to listen on |
| `ADMIN_TOKEN` | `maraimalai-murasu-2026` | Required header to save ads. Change in production. |
| `CORS_ORIGIN` | (allow all) | Lock down to your domain in production |

The React app reads matching values from a `.env` file in the project root:

```
VITE_ADS_API=http://localhost:5050
VITE_ADS_API_TOKEN=maraimalai-murasu-2026
```

You don't need to create this file for local development — the defaults work out of the box.

## 🗄️ Where is the data stored?

`server/data/ads.json` — a single JSON file. Back it up if you want to preserve ad uploads.

## 🐛 Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Badge says "Ads API offline" | Server not running | Run `npm start` in the server folder |
| `EADDRINUSE: address already in use 5050` | Server already running in another window | Close the other window or use a different port: `PORT=5051 npm start` |
| Save button works but other browsers still see old ads | Wait 10s — that's the polling interval | Or just refresh the other browser |
| Admin shows "401 Invalid token" | Frontend and server tokens don't match | Check both are the default `maraimalai-murasu-2026` or set both env vars |
| Big images won't save | Body limit hit | Already raised to 50MB. If still failing, compress the image first. |
