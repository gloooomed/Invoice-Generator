// Vercel Serverless Function — /api/config
// Reads Supabase credentials from Vercel environment variables and
// returns them as JSON so the frontend never needs the keys hard-coded.
//
// Set these in: Vercel Dashboard → Project → Settings → Environment Variables
//   SUPABASE_URL
//   SUPABASE_ANON_KEY

export default function handler(req, res) {
    const url  = process.env.SUPABASE_URL      || '';
    const key  = process.env.SUPABASE_ANON_KEY || '';

    if (!url || !key) {
        return res.status(500).json({
            error: 'Supabase environment variables are not set on Vercel. ' +
                   'Add SUPABASE_URL and SUPABASE_ANON_KEY in your Vercel project settings.'
        });
    }

    // Cache for 5 minutes — these values almost never change
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    res.status(200).json({ url, key });
}
