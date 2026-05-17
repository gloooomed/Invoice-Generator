# 🪵 Suproan Invoice Generator

A clean, lightweight, browser-based **tax invoice generator** for **Suproan Enterprises** — a premium plywood & board supplier based in Darbhanga, Bihar.

No backend. No dependencies. Just open `index.html` and start billing.

---

## ✨ Features

- 📋 **Quick Billing** — Fill in customer name, invoice number, and date
- 📦 **Item Management** — Add/remove rows with size selection (preset sizes + custom)
- 🧮 **Auto Calculation** — Total amount calculated automatically per row and overall
- 🖨️ **Print Invoice** — Clean, print-ready layout hides all UI controls
- ⬇️ **Download as PDF** — Saves with a smart filename like `INV-2026-001_Raj Constructions.pdf`
- 🗑️ **Clear All** — Reset the invoice with one click
- 📱 **Responsive** — Works on desktop and mobile browsers

---

## 📁 Project Structure

```
suproan-invoice/
├── index.html      # Main HTML structure
├── style.css       # All styles, layout & print/PDF media query
├── invoice.js      # JavaScript logic (rendering, totals, PDF export)
└── README.md       # This file
```

---

## 🚀 Getting Started

1. **Clone or download** the repository
2. **Open** `index.html` in any modern browser (Chrome, Edge, Firefox)
3. Fill in the invoice details and items
4. Click **⬇ Download PDF** to save or **🖨 Print Invoice** to print

> No installation, no npm, no build step required.

---

## 🧾 How to Use

| Step | Action |
|------|--------|
| 1 | Enter **Customer Name**, **Invoice No.**, and **Invoice Date** |
| 2 | Click **+ Add Row** to add plywood items |
| 3 | Select a **size** from the dropdown (or choose *Custom…*) |
| 4 | Enter **Quantity** and **Rate (₹)** — total is calculated automatically |
| 5 | Click **⬇ Download PDF** → choose *Save as PDF* in the print dialog |

---

## 📐 Supported Plywood Sizes

Preset sizes include:

- **84\*** — 84×42, 84×40, 84×38, 84×36, 84×34, 84×32
- **81\*** — 81×42, 81×40, 81×38, 81×36, 81×34, 81×32
- **78\*** — 78×38, 78×36, 78×34, 78×32, 78×30
- **Custom** — Enter any size manually

---

## 🏢 Business Details

| Field | Value |
|-------|-------|
| **Company** | Suproan Enterprises |
| **Type** | Premium Plywood & Board Suppliers |
| **Address** | C/O - Suproan Enterprises, Donar Industrial Area, Darbhanga – 864009 |
| **Email** | info@suproanenterprises.com |

---

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| HTML5 | Page structure & semantic markup |
| CSS3 | Styling, layout, responsive design, print styles |
| Vanilla JavaScript | Invoice logic, DOM manipulation, PDF export |
| Google Fonts | Playfair Display & DM Sans |

---

## 📄 License

This project is for internal business use by **Suproan Enterprises**.  
© 2026 Suproan Enterprises · All Rights Reserved.
