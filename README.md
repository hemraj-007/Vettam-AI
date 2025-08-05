# Lawyer-Focused Paginated Editor

**Live Demo:** [https://vettam-ai-one.vercel.app/](https://vettam-ai-one.vercel.app/)

A minimal React + Tiptap prototype demonstrating paginated editing for legal-style documents.

## Features

* **A4 Visual Boundaries**: Each page is rendered at true A4 size (210mm × 297mm).
* **Manual & Automatic Page Breaks**: Insert page breaks with a button or keyboard shortcut (Ctrl/Cmd + Enter), and content overflows paginate automatically.
* **Dynamic Headers & Footers**: Each page shows configurable headers and footers with page numbers (e.g., Page 1 of N), date, and custom text.
* **Two-Tab UI (Edit / Preview)**: Switch between a live Tiptap editor and a read-only paginated preview.
* **Pill-Style Tab Navigation**: Clean, rounded pill tabs for easy toggling.
* **Print/Export PDF**: Only the preview area prints to PDF, hiding the editor and UI chrome.
* **Custom PageBreak Extension**: A Tiptap node with visual indicator, click-to-delete, and optional trailing paragraph insertion.
* **Animated Background (Optional)**: Subtle gradient and shape animations for a polished UI.

## Installation

### Prerequisites

* Node.js >= 14
* npm or yarn

### Setup

```bash
# Clone the repo
git clone https://github.com/hemraj-007/Vettam-AI

# Install dependencies
npm install
# or
# yarn install
```

## Development

```bash
# Start the development server
npm run dev
# or
# yarn dev
```


## Usage

1. **Edit Tab**: Write and format your document in the Tiptap editor.
2. **Insert Page Break**: Click **+ Page Break** or press **Ctrl/Cmd + Enter** to force a new page.
3. **Preview Tab**: Click **Preview** to see the final paginated output with headers/footers.
4. **Print/Export**: In Preview, click **Print / PDF** to generate a PDF of the paginated preview only.

## File Structure

```
src/
├── components/
│   ├── Editor.tsx       # Main editor & pagination logic
│   ├── Sidebar.tsx      # Sidebar placeholder component
│   └── ...
├── extensions/
│   └── PageBreak.ts     # Custom Tiptap page-break extension
├── App.tsx              # Layout, tabs, and global UI
└── main.tsx            # Entry point
```

## Customization

* **Headers & Footers**: Edit the `<div className="page-header">` and `<div className="page-footer">` blocks in `Editor.tsx`.
* **Page Size**: Change `PAGE_WIDTH_MM` and `PAGE_HEIGHT_MM` constants to target different paper sizes.
* **Tab Styles**: Adjust the pill classes in `Editor.tsx` for shape, colors, and spacing.
* **Background Animations**: Modify the CSS animations in `App.tsx` under `<style jsx>`.

## Limitations & Trade-offs

* **Read-Only Preview**: Editing per page in-place isn’t supported; the preview is non-editable.
* **Block-Level Pagination**: Splits occur at block boundaries—no orphan/widow control (single lines at page ends).
* **Performance**: Pagination is debounce-throttled but may lag on extremely large documents.
* **Browser Print Variance**: `window.print()` behavior can differ slightly across browsers.

## Productionizing

1. **Headless PDF Generation**: Use Puppeteer or a serverless PDF service to render the preview cleanly.
2. **Template Engine**: Load header/footer templates (client info, logos) from a server or config.
3. **Advanced Layout**: Integrate an engine for smart orphan/widow control and section breaks (e.g., Paged.js).
4. **Collaboration & Versioning**: Add real-time sync (CRDT) and document history for legal workflows.

## License

This project is licensed under the MIT License.
