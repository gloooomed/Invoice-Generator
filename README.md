# Suproan Invoice Generator

A lightweight, browser-based tax invoice generator built for **Suproan Enterprises**, a premium plywood and board supplier based in Darbhanga, Bihar. The application runs entirely in the browser with no backend, no dependencies, and no build process required.

---

## Features

- Fill in customer name, invoice number, and date in a clean billing form
- Add and remove line items with a dropdown of preset plywood sizes plus a custom entry option
- Automatically calculates the total quantity per row and the overall grand total
- Download the invoice as a PDF directly from the browser with a pre-filled filename
- Fully responsive layout that works on desktop, tablet, and mobile devices
- Clear All button to reset the invoice for the next customer

---

## Project Structure

```
suproan-invoice/
├── index.html      — HTML markup and page structure
├── style.css       — Stylesheet including responsive breakpoints and print styles
├── invoice.js      — Application logic: rendering, totals, PDF export
└── README.md       — Project documentation
```

---

## Getting Started

1. Clone or download the repository.
2. Open `index.html` in any modern browser (Chrome, Edge, or Firefox recommended).
3. Fill in the invoice details and add items.
4. Click **Download PDF** to save the invoice.

No installation, package manager, or build step is required.

---

## Usage

| Step | Action |
|------|--------|
| 1 | Enter the customer name, invoice number, and invoice date in the Bill To section |
| 2 | Click **Add Row** to add a plywood line item |
| 3 | Select a size from the dropdown or choose **Custom** to enter a size manually |
| 4 | Enter the quantity and rate — the total quantity is calculated automatically |
| 5 | Click **Download PDF** and choose **Save as PDF** in the browser print dialog |

---

## Supported Plywood Sizes

The following sizes are available in the size dropdown:

| Series | Available Sizes |
|--------|-----------------|
| 84     | 84×42, 84×40, 84×38, 84×36, 84×34, 84×32 |
| 81     | 81×42, 81×40, 81×38, 81×36, 81×34, 81×32 |
| 78     | 78×38, 78×36, 78×34, 78×32, 78×30 |
| Custom | Any size entered manually |

---

## Business Information

| Field   | Details |
|---------|---------|
| Company | Suproan Enterprises |
| Type    | Premium Plywood and Board Suppliers |
| Address | C/O Suproan Enterprises, Donar Industrial Area, Darbhanga – 864009 |
| Phone   | 8294150110 / 7992315783 |
| Email   | info@suproanenterprises.com |

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Page structure and semantic markup |
| CSS3 | Styling, responsive layout, and print media styles |
| Vanilla JavaScript | Invoice logic, DOM rendering, and PDF export |
| Google Fonts | Playfair Display and DM Sans typefaces |

---

## License

This project is intended for internal business use by Suproan Enterprises.  
© 2026 Suproan Enterprises. All Rights Reserved.
