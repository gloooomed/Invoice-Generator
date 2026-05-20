import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, errorMessage, jsonResponse } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, serviceRoleKey);

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    if (req.method !== 'POST') {
        return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    try {
        const { id } = await req.json();

        if (!id) {
            return jsonResponse({ error: 'Missing invoice id' }, 400);
        }

        const { data: invoice, error: fetchError } = await supabase
            .from('invoices')
            .select('storage_path')
            .eq('id', id)
            .single();

        if (fetchError) {
            return jsonResponse({ error: fetchError.message }, 404);
        }

        const { data, error: signedUrlError } = await supabase.storage
            .from('invoice-pdfs')
            .createSignedUrl(invoice.storage_path, 60);

        if (signedUrlError) {
            return jsonResponse({ error: signedUrlError.message }, 500);
        }

        return jsonResponse({ url: data.signedUrl });
    } catch (error) {
        return jsonResponse({ error: errorMessage(error, 'Failed to create download link') }, 500);
    }
});
