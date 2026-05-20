import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, errorMessage, jsonResponse, sanitizeFilename } from '../_shared/cors.ts';

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
        const {
            pdfData,
            filename,
            customerName,
            invoiceNumber,
            invoiceDate
        } = await req.json();

        if (!pdfData || !filename) {
            return jsonResponse({ error: 'Missing pdfData or filename' }, 400);
        }

        const cleanFilename = sanitizeFilename(filename);
        const binary = Uint8Array.from(atob(pdfData), (char) => char.charCodeAt(0));
        const storagePath = `${crypto.randomUUID()}-${cleanFilename}`;

        const { error: uploadError } = await supabase.storage
            .from('invoice-pdfs')
            .upload(storagePath, binary, {
                contentType: 'application/pdf',
                upsert: false
            });

        if (uploadError) {
            return jsonResponse({ error: uploadError.message }, 500);
        }

        const { data, error: insertError } = await supabase
            .from('invoices')
            .insert({
                filename: cleanFilename,
                storage_path: storagePath,
                size_bytes: binary.byteLength,
                customer_name: customerName || null,
                invoice_number: invoiceNumber || null,
                invoice_date: invoiceDate || null
            })
            .select()
            .single();

        if (insertError) {
            await supabase.storage.from('invoice-pdfs').remove([storagePath]);
            return jsonResponse({ error: insertError.message }, 500);
        }

        return jsonResponse({ success: true, invoice: data });
    } catch (error) {
        return jsonResponse({ error: errorMessage(error, 'Failed to save invoice') }, 500);
    }
});
