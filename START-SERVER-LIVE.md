# 🚀 Start the Server for the Live Site — Step-by-Step

> **The problem:** Hostinger serves your React build (static HTML/CSS/JS) but has **no Node.js backend** running there. So when the admin tries to save ads, it calls `https://maraimalaimurasu.com/api/ads/health` → 404 → the warning "Saved locally only" appears.
>
> **The fix:** Host the backend on **Vercel** (free, takes 5 minutes), then tell your Hostinger frontend where to find it.

---

## ✅ What's already in the code

| File | Purpose |
|---|---|
| `api/ads/index.js` | GET/POST ad settings (shared across all browsers) |
| `api/ads/health.js` | Health check endpoint |
| `api/content/index.js` | GET/POST custom page content |
| `api/content/[key].js` | Per-page content storage |
| `api/contact.js` | Contact-form fallback (EmailJS handles main flow) |
| `api/_lib/store.js` | Redis storage + `/tmp` fallback |
| `vercel.json` | Vercel routing config |

All endpoints are already written. You just need to deploy them.

---

## 🎯 Recommended path — Vercel backend + Hostinger frontend

### Step 1 — Push the code to GitHub (if not already)

```bash
cd "E:\maraimalai-murasu web\MMM front end"
git add .
git commit -m "feat: production-aware admin error messages + server start guide"
git push
```

### Step 2 — Sign up at vercel.com (free)

1. Open https://vercel.com/signup
2. Choose **Continue with GitHub** (uses the same account that owns this repo)
3. Approve Vercel's GitHub access

### Step 3 — Import the project on Vercel

1. Click **Add New… → Project**
2. Find your `maraimalai-murasu` repo → click **Import**
3. **Framework Preset** should auto-detect as **Vite** ✅
4. **Root Directory** → click **Edit** → select `MMM front end` (since the React app is in that subfolder)
5. **Don't deploy yet** — first add env vars below

### Step 4 — Add environment variables

In the Vercel project settings (before clicking Deploy), click **Environment Variables** and add:

| Name | Value | Notes |
|---|---|---|
| `ADMIN_TOKEN` | `maraimalai-murasu-2026` | Must match `VITE_ADS_API_TOKEN` byte-for-byte |
| `VITE_ADS_API_TOKEN` | `maraimalai-murasu-2026` | Same value as above |
| `VITE_ADS_API` | *(leave blank or set `/`)* | Same-origin → uses Vercel's own `/api` |

> **Optional but recommended for persistent storage:** Add Vercel KV (Redis) — it gives you a real database instead of `/tmp` (which resets on each deploy).
>
> 1. Vercel dashboard → **Storage** → **Create Database** → **KV**
> 2. Vercel auto-injects `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN` as env vars
> 3. Your `api/_lib/store.js` already supports them — no code change needed

### Step 5 — Click Deploy

Vercel will build & deploy in ~2 minutes. When done you get a URL like:

```
https://maraimalai-murasu.vercel.app
```

Test it: open `https://maraimalai-murasu.vercel.app/api/ads/health` — you should see JSON like `{"ok":true,"ts":...}`.

### Step 6 — Point your Hostinger frontend at the Vercel API

Edit `E:\maraimalai-murasu web\MMM front end\.env.production`:

```
VITE_ADS_API=https://maraimalai-murasu.vercel.app
VITE_ADS_API_TOKEN=maraimalai-murasu-2026
```

> Replace `maraimalai-murasu.vercel.app` with **your** actual Vercel URL from Step 5.

### Step 7 — Rebuild the Hostinger frontend

```bash
cd "E:\maraimalai-murasu web\MMM front end"
npm run build
```

This creates `dist/` with the new API URL baked in.

### Step 8 — Re-upload `dist/` to Hostinger

1. Open **Hostinger hPanel → File Manager**
2. Navigate to `public_html/`
3. **Delete everything inside** `public_html/` (the old build)
4. **Upload all files & folders from** `E:\maraimalai-murasu web\MMM front end\dist\`
5. Make sure `.htaccess` is included for SPA routing — if missing, create one with:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Step 9 — Verify

1. Open https://maraimalaimurasu.com/admin (hard refresh: **Ctrl + Shift + R**)
2. Go to **Ads tab**
3. Top banner should now read **🟢 "Connected — ads sync to every browser & device"**
4. The URL beside it should show your Vercel API base
5. Edit an ad, click **Save Ad Settings** → alert should say **"✅ Ad Settings Saved! Pushed to the shared Ads API…"**

---

## 🧪 Local development (still works exactly as before)

```bash
# Terminal 1 — start the local Express backend
cd "E:\maraimalai-murasu web\MMM front end\server"
npm start
# → listens on http://localhost:5050

# Terminal 2 — start the Vite dev server
cd "E:\maraimalai-murasu web\MMM front end"
npm run dev
# → opens http://localhost:5173
```

Localhost auto-detects and talks to `http://localhost:5050`. No env changes needed for local dev.

---

## 🆘 Alternative path — Hostinger Node.js App (if Vercel is not an option)

Only do this if your Hostinger plan shows **"Node.js"** under Advanced (Business plan or higher).

1. **hPanel → Advanced → Node.js → Create Application**
2. **Node.js version:** 20.x
3. **Application root:** `domains/maraimalaimurasu.com/server`
4. **Application URL:** `maraimalaimurasu.com/api`
5. **Application startup file:** `server.js`
6. **Upload** the contents of `E:\maraimalai-murasu web\MMM front end\server\` (NOT including `node_modules`) to the application root via File Manager or FTP
7. Click **NPM Install** → Vercel-style auto-installs the deps
8. Click **Start** → Hostinger boots `node server.js`
9. Your live API base becomes `https://maraimalaimurasu.com/api` — which is what `.env.production` already points to ✅ (no rebuild needed)

---

## 🆘 Alternative path — Hostinger SSH + PM2 (technical, requires SSH activation)

In your SSH Access screen, **enable SSH first** (currently INACTIVE). Then:

```bash
# From your Windows machine
ssh u577509731@82.25.87.18 -p 65002

# On the server
cd domains/maraimalaimurasu.com
mkdir backend && cd backend
# Upload server/ folder contents here (use SFTP/FileZilla)

# Install Node 20 via nvm if not present
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

npm install
npm install -g pm2

# Start the server with PM2 (auto-restart on crash, runs forever)
pm2 start server.js --name mmm-backend
pm2 save
pm2 startup  # follow the printed instruction to enable on boot
```

Then set up a reverse proxy from `maraimalaimurasu.com/api/*` → `localhost:5050/*` (ask Hostinger support or use their Apache config UI).

---

## ❓ Why did the "cd server / npm start" message appear on the live site?

Because the old `AdminDashboard.jsx` alert text was written assuming the admin would always be using it from localhost. It's now fixed:

- **On localhost:** "Start the dev server with: cd server && npm start" (correct)
- **On maraimalaimurasu.com:** "Production backend not deployed yet — see deployment guide" (correct)

This was deployed in the same commit. After your next Hostinger upload, the misleading message will be gone.

---

## ⚡ TL;DR

1. Push code to GitHub
2. Import repo in Vercel (5 min)
3. Get the `*.vercel.app` URL
4. Update `.env.production` → `VITE_ADS_API=https://your-app.vercel.app`
5. `npm run build`
6. Re-upload `dist/` to Hostinger
7. Hard-refresh `maraimalaimurasu.com/admin` → see green "Connected" banner ✅
