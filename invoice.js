/** @type {{ id: number, size: string, qty: number, rate: number, sqft: number }[]} */
let items = [];
let nextId = 1;

function formatINR(/** @type {number} */ n) {
    return '₹ ' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function addRow() {
    items.push({ id: nextId++, size: '', qty: 0, rate: 0, sqft: 0 });
    render();
}

function removeRow(/** @type {number} */ id) {
    items = items.filter(i => i.id !== id);
    render();
}

/** Parse size string like "84*42" and return sqft = (L * B) / 144, rounded to 2 dp */
function getSqFt(/** @type {string} */ size) {
    const m = size.match(/(\d+(?:\.\d+)?)\*(\d+(?:\.\d+)?)/);
    if (!m) return 0;
    const L = parseFloat(m[1]);
    const B = parseFloat(m[2]);
    return +((L * B) / 144).toFixed(2);
}

function getTotalPrice(/** @type {typeof items[0]} */ item) {
    const sf = getSqFt(item.size);
    return +(sf * item.rate).toFixed(2);
}

function render() {
    const tbody = document.getElementById('items-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    items.forEach((item) => {
        const sqft = getSqFt(item.size);
        const totalPrice = getTotalPrice(item);
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
      <td class="sqft-cell" data-label="Sq. Ft.">${sqft > 0 ? sqft.toFixed(2) : '—'}</td>
      <td data-label="Rate (₹)">
        <input type="number" value="${item.rate || ''}" min="0" placeholder="0"
          oninput="updateField(${item.id},'rate',+this.value)"
          style="text-align:right;" />
      </td>
      <td class="total-cell" data-label="Total Price">${totalPrice > 0 ? formatINR(totalPrice) : '—'}</td>
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
    // refresh sqft cell and total price cell of this row
    const rows = document.querySelectorAll('#items-body tr');
    const idx = items.indexOf(item);
    if (rows[idx]) {
        const sqftCell = rows[idx].querySelector('.sqft-cell');
        const sf = getSqFt(item.size);
        if (sqftCell) sqftCell.textContent = sf > 0 ? sf.toFixed(2) : '—';

        const totalCell = rows[idx].querySelector('.total-cell');
        const tp = getTotalPrice(item);
        if (totalCell) totalCell.textContent = tp > 0 ? formatINR(tp) : '—';
    }
    updateTotal();
}

function updateTotal() {
    const grand = items.reduce((s, i) => s + getTotalPrice(i), 0);
    const el = document.getElementById('grand-total');
    if (el) el.textContent = formatINR(grand);
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
function downloadPDF() {
    const invNoEl = document.getElementById('invoice-no');
    const custNameEl = document.getElementById('cust-name');
    const invNo = (invNoEl ? invNoEl.value.trim() : 'Bill') || 'Bill';
    const cust = (custNameEl ? custNameEl.value.trim() : '') || '';
    const filename = cust ? `${invNo}_${cust}.pdf` : `${invNo}.pdf`;

    // ── Replace Size-column selects with plain text before printing ──
    // This removes the dropdown arrow and its gap from the printed output.
    const restored = [];
    document.querySelectorAll('#items-body tr').forEach(function (tr) {
        const sizeCell = tr.querySelector('td:first-child');
        if (!sizeCell) return;

        const sel = sizeCell.querySelector('select');
        const customInput = sizeCell.querySelector('input[type="text"]');

        // Decide what text to display
        let displayText = '';
        if (customInput && customInput.value.trim()) {
            displayText = customInput.value.trim();
        } else if (sel) {
            const opt = sel.options[sel.selectedIndex];
            displayText = (opt && opt.value && opt.value !== '' && opt.value !== '__custom__')
                ? opt.text : '\u2014';
        }

        // Insert a plain text span
        const span = document.createElement('span');
        span.className = 'print-size-text';
        span.textContent = displayText;
        span.style.cssText = 'font-weight:600;font-size:0.9rem;color:var(--ink);';
        sizeCell.insertBefore(span, sizeCell.firstChild);

        // Hide the interactive elements.
        // Must use setProperty with 'important' because the @media print CSS
        // has display:block !important on selects, which beats a plain inline style.
        if (sel) sel.style.setProperty('display', 'none', 'important');
        if (customInput) customInput.style.setProperty('display', 'none', 'important');

        restored.push({ sel: sel, span: span, input: customInput });
    });

    // Temporarily set document title for PDF filename
    const originalTitle = document.title;
    document.title = filename;

    window.print();

    // Restore everything after the print dialog closes
    setTimeout(function () {
        document.title = originalTitle;
        restored.forEach(function (r) {
            r.span.remove();
            if (r.sel) r.sel.style.removeProperty('display');
            if (r.input) r.input.style.removeProperty('display');
        });
    }, 1000);
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
