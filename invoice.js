/** @type {{ id: number, size: string, qty: number, rate: number }[]} */
let items = [];
let nextId = 1;

function formatINR(/** @type {number} */ n) {
    return '₹ ' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function addRow() {
    items.push({ id: nextId++, size: '', qty: 0, rate: 0 });
    render();
}

function removeRow(/** @type {number} */ id) {
    items = items.filter(i => i.id !== id);
    render();
}

function getTotalQty(/** @type {typeof items[0]} */ item) {
    return item.qty;
}

function render() {
    const tbody = document.getElementById('items-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    items.forEach((item) => {
        const total = getTotalQty(item);
        const tr = document.createElement('tr');

        const sizes = [
            // 84* : 42 down to 32, step -2
            '84*42', '84*40', '84*38', '84*36', '84*34', '84*32',
            // 81* : 42 down to 32, step -2
            '81*42', '81*40', '81*38', '81*36', '81*34', '81*32',
            // 78* : 38 down to 30, step -2
            '78*38', '78*36', '78*34', '78*32', '78*30',
        ];

        const optionsHtml = sizes.map(s =>
            `<option value="${s}" ${item.size === s ? 'selected' : ''}>${s}</option>`
        ).join('');

        const isCustom = item.size !== '' && !sizes.includes(item.size);

        tr.innerHTML = `
      <td data-label="Size" style="min-width:200px;">
        <select onchange="handleSizeSelect(${item.id}, this.value)" style="width:100%; margin-bottom:${isCustom ? '6px' : '0'};">
          <option value="" ${item.size === '' ? 'selected' : ''}>— Select Size —</option>
          ${optionsHtml}
          <option value="__custom__" ${isCustom ? 'selected' : ''}>Custom…</option>
        </select>
        ${isCustom ? `<input type="text" value="${item.size}" placeholder="e.g. 90*44-28"
          oninput="updateField(${item.id},'size',this.value)"
          style="width:100%; margin-top:4px;" />` : ''}
      </td>
      <td data-label="Quantity">
        <input type="number" value="${item.qty || ''}" min="0" placeholder="0"
          oninput="updateField(${item.id},'qty',+this.value)"
          style="text-align:right;" />
      </td>
      <td data-label="Rate (₹)">
        <input type="number" value="${item.rate || ''}" min="0" placeholder="0"
          oninput="updateField(${item.id},'rate',+this.value)"
          style="text-align:right;" />
      </td>
      <td class="total-cell" data-label="Total Qty">${total > 0 ? total.toLocaleString('en-IN') : '—'}</td>
      <td class="del-cell" data-label="">
        <button class="del-btn" onclick="removeRow(${item.id})" title="Remove row">✕</button>
      </td>
    `;
        tbody.appendChild(tr);
    });

    updateTotal();
}

function handleSizeSelect(/** @type {number} */ id, /** @type {string} */ value) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    if (value === '__custom__') {
        item.size = '__custom__';
    } else {
        item.size = value;
    }
    render();
}

function updateField(/** @type {number} */ id, /** @type {string} */ field, /** @type {any} */ value) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    // For size field, if user typed something, store it directly (not '__custom__')
    if (field === 'size' && value !== '__custom__') {
        item.size = value;
    } else {
        (item)[field] = value;
    }
    // refresh only the total cell of this row
    const rows = document.querySelectorAll('#items-body tr');
    const idx = items.indexOf(item);
    if (rows[idx]) {
        const cell = rows[idx].querySelector('.total-cell');
        const t = getTotalQty(item);
        if (cell) cell.textContent = t > 0 ? t.toLocaleString('en-IN') : '—';
    }
    updateTotal();
}

function updateTotal() {
    const grand = items.reduce((s, i) => s + getTotalQty(i), 0);
    const el = document.getElementById('grand-total');
    if (el) el.textContent = grand.toLocaleString('en-IN');
}

function updateInvoiceNumber(/** @type {string} */ val) {
    const el = document.getElementById('invoice-number-display');
    if (el) el.textContent = val || '—';
}

function clearAll() {
    if (!confirm('Clear all items and reset the invoice?')) return;
    items = [];
    nextId = 1;
    const custName = /** @type {HTMLInputElement} */ (document.getElementById('cust-name'));
    if (custName) custName.value = '';
    render();
}

// ── DOWNLOAD PDF ──
async function downloadPDF() {
    // Derive a filename from the invoice number
    const invNoEl = /** @type {HTMLInputElement} */ (document.getElementById('invoice-no'));
    const custNameEl = /** @type {HTMLInputElement} */ (document.getElementById('cust-name'));
    const invNo = (invNoEl ? invNoEl.value.trim() : 'Invoice') || 'Invoice';
    const cust = (custNameEl ? custNameEl.value.trim() : '') || '';
    const filename = cust ? `${invNo}_${cust}.pdf` : `${invNo}.pdf`;

    try {
        // Show loading indicator
        const btn = document.getElementById('btn-download-pdf');
        const originalText = btn.textContent;
        btn.textContent = '⏳ Processing...';
        btn.disabled = true;

        // Clone the main content to avoid modifying the original
        const element = document.querySelector('main');
        const cloned = element.cloneNode(true);

        // Remove any problematic elements from clone
        cloned.querySelectorAll('button').forEach(btn => btn.remove());
        cloned.querySelectorAll('input').forEach(input => {
            const label = document.createElement('span');
            label.textContent = input.value || input.placeholder;
            input.replaceWith(label);
        });

        // Generate PDF from the cloned element
        const opt = {
            margin: 10,
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, allowTaint: true },
            jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
        };

        const pdf = await html2pdf().set(opt).from(cloned).outputPdf('arraybuffer');
        const pdfBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(pdf)));

        // Send to backend
        const response = await fetch('/api/save-invoice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pdfData: pdfBase64, filename: filename })
        });

        const result = await response.json();

        if (response.ok) {
            alert(`✓ Invoice saved successfully!\nFilename: ${result.filename}\nSize: ${(result.size / 1024).toFixed(2)} KB`);
        } else {
            alert(`✗ Error: ${result.error}`);
        }

        // Restore button
        btn.textContent = originalText;
        btn.disabled = false;
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert(`✗ Error: ${error.message}`);
        const btn = document.getElementById('btn-download-pdf');
        btn.textContent = '⬇ Download PDF';
        btn.disabled = false;
    }
}

// ── DATE PICKER ──
function handleDatePick(/** @type {string} */ isoDate) {
    if (!isoDate) return;
    const [y, m, d] = isoDate.split('-');
    const yy = y.slice(-2);
    const el = document.getElementById('invoice-date');
    if (el) el.value = `${d}-${m}-${yy}`;
}

function openDatePicker() {
    const picker = /** @type {HTMLInputElement} */ (document.getElementById('invoice-date-picker'));
    if (!picker) return;
    try {
        picker.showPicker();
    } catch (_) {
        picker.click();
    }
}

// ── INIT ──
(function init() {
    const dateEl = /** @type {HTMLInputElement} */ (document.getElementById('invoice-date'));
    const pickerEl = /** @type {HTMLInputElement} */ (document.getElementById('invoice-date-picker'));
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yy = String(today.getFullYear()).slice(-2);
    const yyyy = today.getFullYear();
    if (dateEl) dateEl.value = `${dd}-${mm}-${yy}`;
    if (pickerEl) pickerEl.value = `${yyyy}-${mm}-${dd}`;

    // Start with 3 empty rows
    addRow(); addRow(); addRow();
})();
