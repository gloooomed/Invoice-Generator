const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('.'));

// Create invoices directory if it doesn't exist
const invoicesDir = path.join(__dirname, 'invoices');
if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
}

function sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function getInvoicePath(filename) {
    const cleanFilename = sanitizeFilename(filename);
    const filepath = path.resolve(invoicesDir, cleanFilename);
    const resolvedInvoicesDir = path.resolve(invoicesDir);

    if (path.dirname(filepath) !== resolvedInvoicesDir) {
        return null;
    }

    return { cleanFilename, filepath };
}

// API endpoint to save PDF
app.post('/api/save-invoice', (req, res) => {
    try {
        const { pdfData, filename } = req.body;

        if (!pdfData || !filename) {
            return res.status(400).json({ error: 'Missing pdfData or filename' });
        }

        // Sanitize filename
        const invoicePath = getInvoicePath(filename);
        if (!invoicePath) {
            return res.status(403).json({ error: 'Access denied' });
        }
        const { cleanFilename, filepath } = invoicePath;

        // Convert base64 to buffer
        const buffer = Buffer.from(pdfData, 'base64');

        // Save file
        fs.writeFileSync(filepath, buffer);

        // Log the save
        const timestamp = new Date().toISOString();
        const logEntry = `${timestamp} - Saved: ${cleanFilename} (${buffer.length} bytes)\n`;
        fs.appendFileSync(path.join(invoicesDir, 'log.txt'), logEntry);

        res.json({
            success: true,
            message: 'Invoice saved successfully',
            filename: cleanFilename,
            size: buffer.length
        });
    } catch (error) {
        console.error('Error saving invoice:', error);
        res.status(500).json({ error: 'Failed to save invoice', details: error.message });
    }
});

// API endpoint to get saved invoices list
app.get('/api/invoices', (req, res) => {
    try {
        const files = fs.readdirSync(invoicesDir)
            .filter(f => f.endsWith('.pdf'))
            .map(f => {
                const stats = fs.statSync(path.join(invoicesDir, f));
                return {
                    filename: f,
                    size: stats.size,
                    created: stats.birthtime
                };
            })
            .sort((a, b) => b.created - a.created);

        res.json({ invoices: files });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch invoices' });
    }
});

// Download invoice
app.get('/api/download/:filename', (req, res) => {
    try {
        const invoicePath = getInvoicePath(req.params.filename);
        if (!invoicePath) {
            return res.status(403).json({ error: 'Access denied' });
        }
        const { filepath } = invoicePath;

        if (!fs.existsSync(filepath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.download(filepath);
    } catch (error) {
        res.status(500).json({ error: 'Failed to download file' });
    }
});

// Delete invoice
app.delete('/api/invoices/:filename', (req, res) => {
    try {
        const invoicePath = getInvoicePath(req.params.filename);
        if (!invoicePath) {
            return res.status(403).json({ error: 'Access denied' });
        }
        const { cleanFilename, filepath } = invoicePath;

        if (!fs.existsSync(filepath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        fs.unlinkSync(filepath);

        const timestamp = new Date().toISOString();
        const logEntry = `${timestamp} - Deleted: ${cleanFilename}\n`;
        fs.appendFileSync(path.join(invoicesDir, 'log.txt'), logEntry);

        res.json({
            success: true,
            message: 'Invoice deleted successfully',
            filename: cleanFilename
        });
    } catch (error) {
        console.error('Error deleting invoice:', error);
        res.status(500).json({ error: 'Failed to delete invoice', details: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✓ Suproan Invoice Backend running on http://localhost:${PORT}`);
    console.log(`✓ Invoices saved to: ${invoicesDir}`);
});
