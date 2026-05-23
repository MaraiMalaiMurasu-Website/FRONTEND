# 🚀 Maraimalai Murasu — GO LIVE on Hostinger

> One-time setup. After this, **every admin change shows on every browser worldwide within 10 seconds — no rebuilds, no file uploads, nothing.**

---

## How the deployed system works

```
   ┌────────────────────────┐         ┌─────────────────────────────┐
   │  Visitor's browser     │         │ Hostinger                   │
   │  (Chrome / Edge /      │ ──GET── │                             │
   │   phone / anywhere)    │         │  ┌───────────────────────┐  │
   │                        │ ──GET── │  │ public_html/          │  │
   │  - Reads page content  │         │  │   index.html + dist/  │  │
   │  - Reads ads           │         │  │   .htaccess           │  │
   │                        │         │  └───────────────────────┘  │
   │                        │ ─/api/─►│                             │
   │                        │         │  ┌───────────────────────┐  │
   │                        │         │  │ Node.js App           │  │
   │                        │         │  │  /api/ads             │  │
   │                        │         │  │  /api/content/:key    │  │
   │                        │         │  │  → reads/writes JSON  │  │
   │                        │         │  └───────────────────────┘  │
   └────────────────────────┘         └─────────────────────────────┘

   You log in to /admin → save → API writes ads.json + content/*.json
                                  ↓
   All visitors auto-poll the API every 10s → see your update instantly
```

---

## ⏱ Quick checklist (45 minutes one-time)

- [ ] Step 1: Deploy the **backend** (Node.js app) to Hostinger
- [ ] Step 2: Build the **frontend** with production env vars
- [ ] Step 3: Upload `dist/` contents to **public_html/**
- [ ] Step 4: Test from Chrome AND Edge
- [ ] Step 5: Forget about it. Just edit admin from now on. ✨

---

## Step 1 — Deploy the Node.js Backend

### 1a. Log in to Hostinger hPanel

Open https://hpanel.hostinger.com — pick the domain you want to use.

### 1b. Create the Node.js App

1. In hPanel sidebar → **Advanced → Node.js**
2. Click **Create Application**
3. Fill in:

   | Field | Value |
   |---|---|
   | Node.js version | **20.x** or latest LTS |
   | Application mode | **Production** |
   | Application root | `api` (creates `/home/USER/api`) |
   | Application URL | `https://yourdomain.com/api` |
   | Application startup file | `server.js` |
   | Environment variables (add 2) | `ADMIN_TOKEN` = a long random string<br>`CORS_ORIGIN` = `https://yourdomain.com` |

4. Click **Create**. Hostinger gives you a path like `/home/u123456789/api`.

### 1c. Upload the server files

In hPanel → **File Manager**, go to `/home/USER/api/` and upload:

- `server/server.js`
- `server/package.json`
- `server/.gitignore`

**OR** use SSH if you prefer:
```bash
scp -r server/* USER@HOST:/home/USER/api/
```

### 1d. Install dependencies

In hPanel → Node.js → click **Run NPM Install** on your app card.

It runs `npm install` and shows "added 71 packages".

### 1e. Start the app

Click **Restart** on the Node.js app card.

### 1f. Verify

Open in your browser:
```
https://yourdomain.com/api/ads/health
```

You should see:
```json
{"ok":true,"ts":"2026-..."}
```

✅ Backend is live.

---

## Step 2 — Build the Frontend for Production

### 2a. Create `.env.production`

In `E:\maraimalai-murasu web\maraimalai-murasu\` copy `.env.production.example` → `.env.production` and fill in:

```
VITE_ADS_API=https://yourdomain.com/api
VITE_ADS_API_TOKEN=<the same ADMIN_TOKEN you set on the server>
```

**⚠️ Both tokens MUST be identical.** If they don't match, admin saves return 401.

### 2b. Build

Open a terminal in the React project folder:

```bash
cd "E:\maraimalai-murasu web\maraimalai-murasu"
npm run build
```

This creates `dist/` containing `index.html`, hashed JS bundles, and your assets.

### 2c. Verify the .htaccess made it

Check that `dist/.htaccess` exists. If not, manually copy `public/.htaccess` to `dist/.htaccess` — Vite usually does this automatically for files in `public/`.

---

## Step 3 — Upload Frontend to public_html

### 3a. In Hostinger File Manager

1. Open `public_html/`
2. Delete any existing files (the default index page, etc.) — but **keep the `api/` folder** if it lives here
3. Upload **the contents of `dist/`** (not the folder itself) to `public_html/`
4. Make sure `.htaccess` is uploaded (it's a hidden file — File Manager may need "Show hidden files")

### 3b. Verify

Open https://yourdomain.com in a browser. The site loads. ✅

Open https://yourdomain.com/admin — the admin login screen appears. ✅

Open https://yourdomain.com/headlines — the headlines page renders (not 404). ✅ This proves `.htaccess` is working.

---

## Step 4 — Test the Sync

1. Open **https://yourdomain.com/admin** in Chrome → log in
2. Go to **Ad Manager** → look at the badge at the top:
   - 🟢 **"Connected — ads sync to every browser & device"** ✅
   - 🔴 If red → backend isn't reachable. Check Step 1f.
3. Upload an ad image to any slot
4. Open **https://yourdomain.com** in Edge (or your phone, or a friend's device)
5. Within 10 seconds, the new ad appears ✅
6. Edit a Pages Editor section → save → check the live page in Edge → it updates within 10 seconds ✅

🎉 **Done.** From this point on:

- You will **never run `npm run build` again** (unless you change actual code)
- You will **never upload files to Hostinger again** (unless you change actual code)
- All editing happens at https://yourdomain.com/admin
- Every change appears instantly for every visitor everywhere

---

## What you can edit from admin (everything!)

| Section | Live where |
|---|---|
| Home Editor — hero, banners, card grids, sponsor card, weekly PDF | Homepage |
| Pages Editor — Headlines / Law / Cinema / Sports / Beauty / Cooking / Astrology | All category pages |
| ePaper Editor | /epaper |
| Article Editor | /article (and category lists) |
| Write News | All article listings |
| Categories | Navbar dropdown + category pages |
| Site Settings | Browser title, hero title, search chips |
| Per-Slot Ad Manager | Every ad box on every page |
| Media Library | Used by all image pickers |

---

## When you actually edit CODE (rare)

If you (or me) change a `.jsx` file — that's a **code** change, not a content change. Then:

1. `npm run build` in the project folder
2. Re-upload `dist/` contents to `public_html/`

But content/ads changes never need this — they go through the admin panel only.

---

## 🔒 Security checklist before going live

- [ ] Changed `ADMIN_TOKEN` from the default `maraimalai-murasu-2026` to a strong random string
- [ ] `VITE_ADS_API_TOKEN` matches the new `ADMIN_TOKEN`
- [ ] `CORS_ORIGIN` is your real domain (not `*` or `true`)
- [ ] SSL is enabled on your domain (Hostinger → SSL → Force HTTPS)
- [ ] Uncomment the "Force HTTPS" block in `public/.htaccess` and rebuild
- [ ] Changed admin password from default `Admin@2026` (in `AdminLogin.jsx`)

---

## 💾 Backing up your content

All admin data lives on the server in `/home/USER/api/data/`:
- `ads.json` — every ad slot
- `content/customHomeContent.json` — homepage edits
- `content/customPagesContent.json` — all category pages
- `content/customArticles.json` — your articles
- ... and so on

Back this folder up weekly:
```bash
tar czf ~/backups/mm-$(date +%Y%m%d).tar.gz ~/api/data
```

Or set up a daily cron in Hostinger → Advanced → Cron Jobs.

---

## 🆘 Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Admin badge is red | Backend down or wrong URL | Check `VITE_ADS_API` matches Step 1c; click "Restart" on Node.js app |
| Save shows "Invalid token" | Tokens mismatch | Re-check both `ADMIN_TOKEN` and `VITE_ADS_API_TOKEN` are identical |
| Edge sees old ads | Polling hasn't run yet | Wait 10s, or hard-refresh (Ctrl+Shift+R) |
| /headlines returns 404 | `.htaccess` not uploaded | Re-upload `dist/.htaccess` to `public_html/` |
| Mixed content warning in console | API on http, site on https | Update `VITE_ADS_API` to `https://...` and rebuild |
| Admin panel loads but pages don't update | Sync interceptor didn't install | Check browser console for errors; check `App.jsx` is the deployed build |

---

That's it. **One setup, infinite content edits — without ever touching code or files again.**
