# Maraimalai Murasu — Ads API Deployment Guide

This is a tiny Node.js + Express server that stores ad settings in a JSON file. Every browser/device reads from this server, so ads are shared across all visitors.

## 1. Run Locally (Development)

```bash
cd "E:\maraimalai-murasu web\maraimalai-murasu\server"
npm install
npm start
```

You should see:
```
🟢 Maraimalai Murasu Ads API running on http://localhost:5050
```

Keep this terminal window open while developing. The Vite dev server (React app) on port 5173/5174 will talk to this on port 5050.

## 2. Deploy to Hostinger

Hostinger supports Node.js apps through **hPanel → Node.js Apps** section.

### Steps:

1. Log in to **Hostinger hPanel**.
2. Navigate to **Websites → Manage → Advanced → Node.js**.
3. Click **Create Application**:
   - **Node.js version:** 20.x (or latest LTS)
   - **Application Mode:** Production
   - **Application Root:** `/public_html/api` (or wherever you want it)
   - **Application URL:** `https://yourdomain.com/api` (subdirectory) OR a subdomain like `api.yourdomain.com`
   - **Application startup file:** `server.js`
4. Once created, Hostinger gives you SSH access and an `npm install` button.
5. Upload these files to the **Application Root** folder:
   - `server.js`
   - `package.json`
   - `.gitignore`
6. SSH into your server and run:
   ```bash
   cd ~/public_html/api
   npm install
   ```
7. Set environment variables in Hostinger's Node.js panel:
   - `ADMIN_TOKEN` → a strong random string (e.g. `mm-2026-#$@xY7zQ`)
   - `CORS_ORIGIN` → your site URL (e.g. `https://maraimalaimurasu.com`)
   - `PORT` → leave as default; Hostinger sets it automatically
8. Click **Restart** in the Node.js panel.
9. Visit `https://yourdomain.com/api/ads/health` — you should see `{"ok":true,...}`.

### Update the frontend to point to the live API

In your React app's `.env.production` (or just `.env`):
```
VITE_ADS_API=https://yourdomain.com/api
VITE_ADS_API_TOKEN=mm-2026-#$@xY7zQ
```

Use the same `ADMIN_TOKEN` you set in step 7.

Rebuild and redeploy the React app:
```bash
npm run build
# Upload the dist/ folder contents to public_html/
```

## 3. Security Notes

- The default `ADMIN_TOKEN` (`maraimalai-murasu-2026`) is in the code for development only. **Change it for production** via env var.
- The `VITE_ADS_API_TOKEN` is embedded in the React bundle — anyone can read it from DevTools. For higher security, move ad-writing to a server-rendered admin page or add a real login system. For an internal admin panel that only you use, this is acceptable.
- `CORS_ORIGIN` should be set to your real domain in production, not `*`.

## 4. Backups

The ad data is in `server/data/ads.json`. Back it up periodically:
```bash
cp ~/public_html/api/data/ads.json ~/backups/ads-$(date +%Y%m%d).json
```

Or set up a daily cron job in Hostinger.

## 5. Troubleshooting

| Problem | Fix |
|---|---|
| `Cannot GET /api/ads` | Server isn't running. Check `npm start` output and Hostinger Node.js panel. |
| `401 Invalid token` from admin save | `VITE_ADS_API_TOKEN` doesn't match `ADMIN_TOKEN` on server. |
| CORS errors in browser console | Set `CORS_ORIGIN` env var to your site URL. |
| Changes save but don't appear on other browsers | Check Network tab — admin should POST to `/api/ads` and pages should GET from `/api/ads`. |
| `EACCES` permission errors on Hostinger | `chmod 755 ~/public_html/api/data` and re-run. |
