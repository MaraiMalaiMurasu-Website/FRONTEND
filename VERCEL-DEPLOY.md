# 🚀 Maraimalai Murasu — Vercel Deployment

> One Vercel project hosts the React app **AND** the API. Same domain, no CORS, free tier covers everything you'll use.

---

## What's in this deploy

| Path | Served by |
|---|---|
| `/` and any non-API route | React SPA (`dist/index.html`) |
| `/admin` | React SPA (admin panel) |
| `/api/ads` | Vercel serverless function (`api/ads/index.js`) |
| `/api/ads/health` | Vercel serverless function |
| `/api/content` | Vercel serverless function — bundle fetch |
| `/api/content/customHomeContent` etc. | Vercel serverless function — `api/content/[key].js` |

Data lives in **Vercel KV** (free Redis). Persistent across deploys, shared across every browser/device that visits your site.

---

## ⏱ One-time setup (15 minutes)

### 1. Push the latest code

```bash
git add api vercel.json package.json src/utils/adsApi.js src/utils/contentSync.js
git commit -m "feat: Vercel serverless backend for ads + content sync"
git push
```

Vercel auto-deploys, but the API needs KV before it can save anything. Continue below.

### 2. Connect Vercel KV (one click)

1. Open https://vercel.com/dashboard
2. Pick your **marai-malai-murasu** project
3. Top tabs → **Storage** → **Create Database**
4. Choose **KV** (Redis-compatible) → name it `mm-store` → pick the region closest to you
5. Click **Connect Project** → tick the marai-malai-murasu project → **Save**

Vercel automatically adds these env vars to your project:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`
- `KV_URL`

### 3. Add your two custom env vars

Same Vercel project → **Settings → Environment Variables**:

| Name | Value | Environments |
|---|---|---|
| `ADMIN_TOKEN` | A strong random string (e.g. `mm2026XyZ7qPq8tRkL3vN`) | Production, Preview, Development |
| `VITE_ADS_API_TOKEN` | **The exact same string** as above | Production, Preview, Development |

(Both names point at the same secret. Server reads `ADMIN_TOKEN`, frontend bundle reads `VITE_ADS_API_TOKEN`.)

You do NOT need to set `VITE_ADS_API` — the frontend auto-detects same-origin in production.

### 4. Redeploy

Settings → Deployments → click the latest one → **Redeploy**. (Or just push another tiny commit.)

The redeploy is needed because env vars are baked in at build time.

### 5. Test

| URL | Expected |
|---|---|
| `https://marai-malai-murasu.vercel.app/api/ads/health` | `{"ok":true,"ts":"...","storage":"vercel-kv"}` |
| `https://marai-malai-murasu.vercel.app/api/ads` | `{"houseAds":{},...}` (default empty ads) |
| `https://marai-malai-murasu.vercel.app/admin` | Admin login screen |
| `https://marai-malai-murasu.vercel.app/headlines` | Headlines page (not 404) |

If `storage` says `tmp-fallback` instead of `vercel-kv`, KV env vars aren't wired up. Go back to step 2.

### 6. Log in and test the sync

1. Open `/admin` in Chrome → log in (`maraimalai` / `Admin@2026`)
2. Go to **Ad Manager** → check the badge: 🟢 **Connected** ✅
3. Upload any ad image to any slot
4. Open the live site in Edge (or your phone, or anything)
5. Within 10 seconds, the ad shows up everywhere ✅

🎉 **Done.** From now on, edit from admin and everyone sees it.

---

## What about the local Express server?

Keep `server/server.js` for local development if you want — it still runs on `localhost:5050`. The frontend automatically uses it when you're on `localhost`, and switches to same-origin `/api` on Vercel.

You don't have to deploy `server/` to Vercel — Vercel uses the `api/` folder instead. Both exist side-by-side in the repo, doing the same job for their respective hosts.

---

## Daily workflow (after setup)

1. Open `https://marai-malai-murasu.vercel.app/admin`
2. Log in
3. Edit anything — page sections, ad images/videos, articles, etc.
4. Save
5. Every visitor sees the change within 10 seconds. Done.

**No git push, no `npm run build`, no file uploads. Forever.**

The only time you'll need to push code is when you (or me) change actual `.jsx` files.

---

## 💸 Vercel free tier limits — easy to stay under

| Resource | Free tier | This site's usage |
|---|---|---|
| Serverless invocations | 100,000 / month | < 5,000 if you have a steady audience |
| KV reads | 30,000 / day | Plenty — one boot fetch + 6 polls/min per visitor |
| KV writes | 3,000 / day | You'd have to save in admin 100+ times an hour to hit this |
| Bandwidth | 100 GB / month | Plenty unless you have viral traffic |
| Build minutes | 6,000 / month | Each deploy uses ~1 minute |

You can monitor usage in Vercel dashboard → Usage tab.

---

## Backup your data

Vercel KV doesn't auto-backup the free tier. To export:

1. Go to project → Storage → your KV → **Data** tab
2. Click **Export** → download JSON

Or use the CLI:
```bash
npx @vercel/kv-cli export --token=<your-token> > backup.json
```

Stick this in your calendar weekly.

---

## 🔒 Security checklist before sharing the URL

- [ ] Changed `ADMIN_TOKEN` from default `maraimalai-murasu-2026` to a strong random string
- [ ] `VITE_ADS_API_TOKEN` matches the new `ADMIN_TOKEN`
- [ ] Changed admin password from default `Admin@2026` (in `src/admin/AdminLogin.jsx`) — code change, requires git push
- [ ] Added Vercel custom domain + SSL (auto-enabled by Vercel)

---

## 🆘 Troubleshooting

| Symptom | Fix |
|---|---|
| `/admin` returns 404 | `vercel.json` not pushed. Check repo → push it → redeploy |
| Health endpoint says `tmp-fallback` not `vercel-kv` | KV env vars missing. Re-do Step 2 |
| Admin badge red — "Ads API offline" | Open `/api/ads/health` directly. If it 404s, the `api/` folder didn't deploy. Check repo structure |
| Save returns 401 | Token mismatch. Both `ADMIN_TOKEN` and `VITE_ADS_API_TOKEN` must be IDENTICAL |
| Edge sees old content | Wait 10 seconds for next poll, or hard-refresh (Ctrl+Shift+R) |
| Local dev now broken | `cd server && npm start` — frontend uses localhost in dev |

---

That's everything. Once Step 6 passes, the site runs itself. ✅
