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
            .select('id, storage_path')
            .eq('id', id)
            .single();

        if (fetchError) {
            return jsonResponse({ error: fetchError.message }, 404);
        }

        const { error: storageError } = await supabase.storage
            .from('invoice-pdfs')
            .remove([invoice.storage_path]);

        if (storageError) {
            return jsonResponse({ error: storageError.message }, 500);
        }

        const { error: deleteError } = await supabase
            .from('invoices')
            .delete()
            .eq('id', id);

        if (deleteError) {
            return jsonResponse({ error: deleteError.message }, 500);
        }

        return jsonResponse({ success: true });
    } catch (error) {
        return jsonResponse({ error: errorMessage(error, 'Failed to delete invoice') }, 500);
    }
});
