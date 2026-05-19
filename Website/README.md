# M/S Supraon Enterprises - Premium Door & Plywood Designs

## Project Structure

```
├── index.html          # Main HTML file
├── styles.css          # All CSS styles
├── script.ts           # TypeScript source code (only source to keep)
├── dist/               # Compiled JavaScript bundle (generated)
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── .gitignore          # Git ignore file
```

## Development Setup

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

```bash
npm install
```

This installs TypeScript and esbuild as development dependencies.

## Build Commands

### Build (Compile TypeScript to JavaScript bundle)
```bash
npm run bundle
```
This creates `dist/script.js` from the TypeScript source.

### Watch Mode (Auto-rebuild on changes)
```bash
npm run dev
```
This watches `script.ts` for changes and automatically rebuilds the bundle.

### TypeScript Check
```bash
npm run build
```
This compiles TypeScript to the `dist/` folder with type checking.

## Development Workflow

1. **Edit TypeScript**: Modify `script.ts` with your code
2. **Rebuild**: Run `npm run bundle` or use `npm run dev` for watch mode
3. **Test**: Open `index.html` in a browser
4. **Deploy**: The `dist/script.js` file is what gets deployed to production

## File Descriptions

- **script.ts**: TypeScript source file with all application logic
  - Hero grid initialization
  - Gallery and filtering
  - Scroll reveal animations
  - Lightbox functionality
  - Contact form integration with WhatsApp

- **styles.css**: All CSS styling for the website
  - Color scheme and design system
  - Responsive design
  - Animations and transitions

- **index.html**: HTML structure
  - Semantic markup
  - Accessibility considerations
  - References `dist/script.js` (compiled from TypeScript)

## Important Notes

- Only commit `script.ts` to version control (source of truth)
- The `dist/` folder contains generated code and should be built before deployment
- Add `dist/` and `node_modules/` to `.gitignore` to keep the repo clean
- TypeScript provides type safety and better IDE support during development
