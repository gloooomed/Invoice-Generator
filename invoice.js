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
      <td style="min-width:200px;">
        <select onchange="handleSizeSelect(${item.id}, this.value)" style="width:100%; margin-bottom:${isCustom ? '6px' : '0'};">
          <option value="" ${item.size === '' ? 'selected' : ''}>— Select Size —</option>
          ${optionsHtml}
          <option value="__custom__" ${isCustom ? 'selected' : ''}>Custom…</option>
        </select>
        ${isCustom ? `<input type="text" value="${item.size}" placeholder="e.g. 90*44-28"
          oninput="updateField(${item.id},'size',this.value)"
          style="width:100%; margin-top:4px;" />` : ''}
      </td>
      <td>
        <input type="number" value="${item.qty || ''}" min="0" placeholder="0"
          oninput="updateField(${item.id},'qty',+this.value)"
          style="text-align:right;" />
      </td>
      <td>
        <input type="number" value="${item.rate || ''}" min="0" placeholder="0"
          oninput="updateField(${item.id},'rate',+this.value)"
          style="text-align:right;" />
      </td>
      <td class="total-cell">${total > 0 ? total.toLocaleString('en-IN') : '—'}</td>
      <td class="del-cell">
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
function downloadPDF() {
    // Derive a filename from the invoice number
    const invNoEl = /** @type {HTMLInputElement} */ (document.getElementById('invoice-no'));
    const custNameEl = /** @type {HTMLInputElement} */ (document.getElementById('cust-name'));
    const invNo = (invNoEl ? invNoEl.value.trim() : 'Invoice') || 'Invoice';
    const cust = (custNameEl ? custNameEl.value.trim() : '') || '';
    const filename = cust ? `${invNo}_${cust}.pdf` : `${invNo}.pdf`;

    // Set the document title temporarily so browsers use it as the default PDF filename
    const originalTitle = document.title;
    document.title = filename;

    window.print();

    // Restore original title after a short delay
    setTimeout(() => { document.title = originalTitle; }, 1000);
}

// ── INIT ──
(function init() {
    const dateEl = /** @type {HTMLInputElement} */ (document.getElementById('invoice-date'));
    const today = new Date();
    if (dateEl) dateEl.value = today.toISOString().split('T')[0];

    const displayDate = today.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const dateDisplay = document.getElementById('invoice-date-display');
    if (dateDisplay) dateDisplay.textContent = displayDate;

    dateEl?.addEventListener('input', () => {
        const d = new Date(dateEl.value);
        const dd = document.getElementById('invoice-date-display');
        if (dd) dd.textContent = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    });

    // Start with 3 empty rows
    addRow(); addRow(); addRow();
})();
