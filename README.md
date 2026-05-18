# Suproan Bill Invoice Generator

A lightweight, browser-based bill invoice generator with backend storage. The application runs in the browser and automatically saves PDFs to a Node.js backend server.

---

## Features

- Fill in customer name, bill number, and date in a clean billing form
- Add and remove line items with a dropdown of preset plywood sizes plus a custom entry option
- Automatically calculates the total quantity per row and the overall grand total
- **Download the bill as a PDF and automatically save to backend**
- Fully responsive layout that works on desktop, tablet, and mobile devices
- Clear All button to reset the bill for the next customer
- Backend API to manage invoices (save, list, download)

---

## Project Structure

```
suproan-invoice/
├── index.html        — HTML markup and page structure
├── style.css         — Stylesheet including responsive breakpoints and print styles
├── invoice.js        — Application logic: rendering, totals, PDF export
├── server.js         — Express backend server for PDF storage
├── package.json      — Dependencies configuration
├── invoices/         — Folder where PDFs are saved
└── README.md         — Project documentation
```

---

## Getting Started

### Frontend Only (Browser-based)
1. Open `index.html` directly in any modern browser.
2. Fill in the bill details and add items.
3. Click **Download PDF** to save the bill locally.

### With Backend (Automatic Cloud Storage)

#### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

#### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3000`

3. **Open in browser:**
   - Navigate to `http://localhost:3000`
   - Fill in the bill details
   - Click **Download PDF** — the file will automatically save to the backend

---

## Usage

| Step | Action |
|------|--------|
| 1 | Enter the customer name, bill number, and bill date in the Bill To section |
| 2 | Click **Add Row** to add a line item |
| 3 | Select a size from the dropdown or choose **Custom** to enter a size manually |
| 4 | Enter the quantity and rate — the total quantity is calculated automatically |
| 5 | Click **Download PDF** — invoice is saved to backend automatically |

---

## API Endpoints

### Save Invoice
**POST** `/api/save-invoice`
```json
{
  "pdfData": "base64_encoded_pdf",
  "filename": "INV-001_CustomerName.pdf"
}
```

### List Invoices
**GET** `/api/invoices`

Returns list of all saved invoices with metadata.

### Download Invoice
**GET** `/api/download/:filename`

Downloads a specific invoice by filename.

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

## Technology Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Page structure and semantic markup |
| CSS3 | Styling, responsive layout, and print media styles |
| Vanilla JavaScript | Invoice logic, DOM rendering, and PDF export |
| Google Fonts | Playfair Display and DM Sans typefaces |

---

## License

© 2026 All Rights Reserved.
