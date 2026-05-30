# 📧 Contact Form — EmailJS Setup Guide

The contact form on `/contact` uses **EmailJS** (mail.js) to send messages directly from the visitor's browser to your inbox — no backend SMTP server required.

## ✅ Already wired up

| Credential | Value | Where it's stored |
|---|---|---|
| Service ID | `service_55wwent` | Hardcoded fallback + admin Site Settings |
| Template ID | `template_3ww2af7` | Hardcoded fallback + admin Site Settings |
| Public Key | `3syQjW5hMw_zi4QWn` | Hardcoded fallback + admin Site Settings |

## How it works

```
Visitor fills form
    ↓
EmailJS SDK in browser
    ↓
EmailJS servers (using your Service ID + Template ID + Public Key)
    ↓
Email lands in your linked Gmail/Outlook/SMTP inbox
```

No serverless function. No SMTP credentials in env vars. Works on **localhost AND production** with zero config.

## 📋 EmailJS template — what variables to use

In your EmailJS dashboard, edit template `template_3ww2af7` to reference these placeholders. Copy-paste this template:

```
Subject: [மறைமலை முரசு] {{subject}} — {{from_name}}

From: {{from_name}} <{{from_email}}>
Phone: {{phone}}
Subject: {{subject}}

Message:
{{message}}

—
Sent from {{site_name}} contact form · {{submitted_at}}
Reply to: {{reply_to}}
```

**Critical EmailJS template settings:**
1. Open template → **Settings** tab
2. **"To Email"** field → set to your inbox: `maraimalaimurasu@gmail.com`
3. **"From Name"** → `{{from_name}}` (so it shows the visitor's name)
4. **"Reply To"** → `{{reply_to}}` (so clicking Reply in Gmail goes to the visitor)
5. Save

## 🎯 Template variables your form sends

| EmailJS variable | What it contains |
|---|---|
| `{{from_name}}` | Visitor's name |
| `{{from_email}}` | Visitor's email |
| `{{reply_to}}` | Same as from_email (for Reply-To) |
| `{{phone}}` | Phone number (or `—` if blank) |
| `{{subject}}` | Subject dropdown selection (Editorial / Ad / Subscription / Other) |
| `{{message}}` | The message body |
| `{{site_name}}` | `மறைமலை முரசு` |
| `{{submitted_at}}` | IST timestamp |
| `{{source}}` | `contact-page-form` |

## 🔄 Updating credentials without code changes

Visit **Admin → Site Settings → 📧 EmailJS Settings** (blue panel). Edit any of the three values — they're stored in localStorage and applied immediately. Useful when you:
- Rotate the Public Key
- Switch to a new EmailJS account
- Test with a different template before going live

## 🔧 Alternative: Vite env vars (overrides defaults at build time)

Create `.env.production` in the project root:

```
VITE_EMAILJS_SERVICE_ID=service_55wwent
VITE_EMAILJS_TEMPLATE_ID=template_3ww2af7
VITE_EMAILJS_PUBLIC_KEY=3syQjW5hMw_zi4QWn
```

Then `npm run build`. Vercel users: set these in **Project → Settings → Environment Variables**.

**Precedence order (highest first):**
1. localStorage (admin Site Settings) — runtime override
2. Vite env var — build-time override
3. Hardcoded defaults in ContactPage.jsx

## 🧪 Testing

### Locally:
```bash
npm install        # installs @emailjs/browser
npm run dev
```
Open `http://localhost:5173/contact`, fill the form, click submit. Email lands in the inbox configured in your EmailJS template within ~5 seconds.

### Production (Vercel):
Just push to git. Vercel auto-installs `@emailjs/browser` and the form works on the live site immediately.

## 📊 EmailJS free tier limits

| Resource | Free tier | Realistic monthly use |
|---|---|---|
| Emails sent | **200/month** | Plenty for a contact form |
| Templates | 2 | We use 1 |
| Email services | 2 | We use 1 |
| Max attachment size | 1 MB | Not used (form has no file upload) |

If 200/month is too tight, EmailJS Personal plan is $9/month for 1,000 emails. For higher volume, switch to nodemailer + SMTP (the `api/contact.js` and `server/server.js` endpoints are still in the code as a fallback).

## 🐛 Troubleshooting

| Symptom | Fix |
|---|---|
| Form shows success but no email arrives | Check EmailJS Dashboard → **Email History**. If status is "Delivered", check your spam folder. If "Failed", click for the reason. |
| `EmailJS returned status 400` | Template variable name mismatch. Check Step 2 above — variables must match exactly. |
| `403 Forbidden` from EmailJS | Public Key wrong, or your EmailJS account has billing issue, or you've hit 200/month free quota |
| Email body is empty | The template doesn't reference `{{message}}` properly. Open template editor and ensure `{{message}}` appears in the body. |
| Reply goes to no-reply address | Set "Reply To" to `{{reply_to}}` in template Settings tab (see Step "Critical EmailJS template settings" above) |
| Works locally, fails on Vercel | `@emailjs/browser` package not installed. Check Vercel build logs. |

## 🔒 Security

- **The Public Key is safe to expose** — it's designed to be in client-side code. EmailJS validates the origin domain in their dashboard (Settings → Account → Security) to prevent abuse from other websites.
- To lock down which domains can use your Service ID, go to **EmailJS Dashboard → Account → Security → Add allowed origins** → add `https://marai-malai-murasu.vercel.app` and `https://maraimalaimurasu.com`.
- The form has basic rate limiting via EmailJS (max 200/month free). For higher volume + abuse protection, add hCaptcha to the form's onSubmit.

## 🚀 Push to deploy

```bash
cd "E:\maraimalai-murasu web\MMM front end"
git add package.json src/pages/ContactPage.jsx src/admin/AdminDashboard.jsx CONTACT-FORM-SETUP.md
git commit -m "feat: contact form uses EmailJS (admin-editable credentials)"
git push
```

After Vercel rebuilds (~1 min):
- Open `https://marai-malai-murasu.vercel.app/contact`
- Fill the form
- Click "செய்தியை அனுப்பு"
- Email arrives in the inbox configured in your EmailJS template ✅
