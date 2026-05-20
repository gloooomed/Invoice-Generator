# Suproan Bill Invoice Generator

A browser-based invoice generator that saves PDF invoices and history in Supabase.

## What It Uses

- Static frontend: `index.html`, `style.css`, `invoice.js`
- Supabase database table: `public.invoices`
- Supabase private storage bucket: `invoice-pdfs`
- Supabase Edge Functions:
  - `save-invoice`
  - `delete-invoice`
  - `create-invoice-download`

## Local Setup

### 1. Configure Supabase credentials

`supabase-config.js` is **gitignored** — it is never committed to keep your keys private.
You must create it locally from the example template:

```bash
# Windows (PowerShell)
Copy-Item supabase-config.example.js supabase-config.js

# macOS / Linux
cp supabase-config.example.js supabase-config.js
```

Then open `supabase-config.js` and replace the placeholder values:

```js
window.SUPROAN_SUPABASE_URL      = 'https://YOUR_PROJECT_REF.supabase.co';
window.SUPROAN_SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

Find these values at: **Supabase Dashboard → Project Settings → API**

> ⚠️ Never commit `supabase-config.js`. Only `supabase-config.example.js` (with placeholder values) belongs in version control.

### 2. Supabase project setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Deploy the Edge Functions:

```bash
supabase functions deploy save-invoice
supabase functions deploy delete-invoice
supabase functions deploy create-invoice-download
```

The service role key is used only inside Supabase Edge Functions through the built-in `SUPABASE_SERVICE_ROLE_KEY` environment variable. Do not put it in frontend files.

## Usage

1. Open the app.
2. Fill customer, bill number, date, and line items.
3. Click **Save & Download PDF**.
4. The PDF downloads locally and is saved to Supabase.
5. Previous invoices appear in **Invoice History**, with download and delete actions.
