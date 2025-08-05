// src/components/Editor.tsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { PageBreak, pageBreakStyles } from '../extentions/PageBreak'

// Simple debounce
function debounce<Func extends (...args: any[]) => void>(fn: Func, wait: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<Func>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, wait);
  };
}

// A4 conversion
const mmToPx = (mm: number) => (mm / 25.4) * 96;

const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;
const HEADER_HEIGHT = 60;
const FOOTER_HEIGHT = 60;

interface PaginatedPage {
  html: string;
}

type Tab = 'edit' | 'preview';

const Editor: React.FC = () => {
  const editor = useEditor({
    extensions: [StarterKit, PageBreak],
    content: '<p>Start typing your legal document here...</p>',
    editorProps: {
      attributes: {
        class:
          'focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none',
        style: 'min-height:300px;',
      },
    },
  });

  const [pages, setPages] = useState<PaginatedPage[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('edit');
  const usablePageHeight = useRef<number>(0);

  // Compute usable height once
  useEffect(() => {
    const pageHeightPx = mmToPx(PAGE_HEIGHT_MM);
    usablePageHeight.current =
      pageHeightPx - HEADER_HEIGHT - FOOTER_HEIGHT - 32; // buffer for padding
  }, []);

  // Improved Pagination logic: splits at page breaks even inside paragraphs or blocks
  const paginate = useCallback(
    (html: string) => {
      const container = document.createElement('div');
      container.style.cssText = `
        position: absolute;
        visibility: hidden;
        width: ${mmToPx(PAGE_WIDTH_MM)}px;
        padding: 16px;
        box-sizing: border-box;
        font-size: 14px;
        line-height: 1.6;
        font-family: ui-sans-serif, system-ui, sans-serif;
        white-space: normal;
      `;
      container.innerHTML = html;
      document.body.appendChild(container);

      const pagesAccum: string[] = [];
      let currentPageWrapper = document.createElement('div');

      // Helper: recursively process nodes, splitting at page breaks
      function processNode(node: Node) {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          (node as HTMLElement).hasAttribute('data-page-break')
        ) {
          // Page break found: flush current page
          flushCurrent();
          return;
        }

        // If element contains a page break inside, split children
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          (node as HTMLElement).querySelector('[data-page-break]')
        ) {
          const el = node as HTMLElement;
          let buffer: Node[] = [];
          for (const child of Array.from(el.childNodes)) {
            if (
              child.nodeType === Node.ELEMENT_NODE &&
              (child as HTMLElement).hasAttribute('data-page-break')
            ) {
              // Flush buffer as a partial clone of parent
              if (buffer.length > 0) {
                const partial = el.cloneNode(false) as HTMLElement;
                buffer.forEach((n) => partial.appendChild(n.cloneNode(true)));
                currentPageWrapper.appendChild(partial);
              }
              flushCurrent();
              buffer = [];
              continue;
            }
            buffer.push(child);
          }
          // Flush any remaining buffer
          if (buffer.length > 0) {
            const partial = el.cloneNode(false) as HTMLElement;
            buffer.forEach((n) => partial.appendChild(n.cloneNode(true)));
            currentPageWrapper.appendChild(partial);
          }
          return;
        }

        // Otherwise, just append
        currentPageWrapper.appendChild(node.cloneNode(true));
      }

      const flushCurrent = () => {
        if (currentPageWrapper.innerHTML.trim()) {
          pagesAccum.push(currentPageWrapper.innerHTML);
        }
        currentPageWrapper = document.createElement('div');
      };

      // Process all top-level nodes
      for (const node of Array.from(container.childNodes)) {
        processNode(node);
      }

      flushCurrent();
      document.body.removeChild(container);

      // Remove empty pages
      const filtered = pagesAccum.filter((h) => h.trim() !== '');
      setPages((filtered.length ? filtered : [html]).map((h) => ({ html: h })));
    },
    [setPages]
  );

  const debouncedPaginate = useRef(
    debounce((html: string) => {
      paginate(html);
    }, 150)
  ).current;

  useEffect(() => {
    if (!editor) return;
    const handler = () => {
      debouncedPaginate(editor.getHTML());
    };
    handler(); // initial
    editor.on('update', handler);
    return () => {
      editor.off('update', handler);
    };
  }, [editor, debouncedPaginate, paginate]);

  const insertPageBreak = () => {
    editor?.chain().focus().insertPageBreak().run();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Inject page break styles */}
      <style>{pageBreakStyles}</style>

      {/* Header / Tabs */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-4">
          <div
            role="tab"
            aria-selected={activeTab === 'edit'}
            tabIndex={0}
            onClick={() => setActiveTab('edit')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setActiveTab('edit');
            }}
            className={`px-4 py-2 rounded-t-lg font-medium cursor-pointer border-b-2 ${
              activeTab === 'edit'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-gray-600 bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Edit
          </div>
          <div
            role="tab"
            aria-selected={activeTab === 'preview'}
            tabIndex={0}
            onClick={() => setActiveTab('preview')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setActiveTab('preview');
            }}
            className={`px-4 py-2 rounded-t-lg font-medium cursor-pointer border-b-2 ${
              activeTab === 'preview'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-gray-600 bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Preview
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={insertPageBreak}
            disabled={!editor}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded shadow disabled:opacity-50"
          >
            + Page Break
          </button>
          <button
            onClick={() => window.print()}
            className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded shadow"
          >
            Print / PDF
          </button>
        </div>
      </div>

      {/* Tab panels */}
      <div className="max-w-6xl mx-auto">
        {activeTab === 'edit' && (
          <div
            role="tabpanel"
            aria-label="Editor tab"
            className="bg-white shadow rounded-lg p-6 mb-10"
          >
            <EditorContent editor={editor} />
          </div>
        )}

        {activeTab === 'preview' && (
          <div
            role="tabpanel"
            aria-label="Preview tab"
            className="space-y-8"
          >
            {pages.map((page, idx) => (
              <div
                key={idx}
                className="page relative"
                style={{
                  width: mmToPx(PAGE_WIDTH_MM),
                  height: mmToPx(PAGE_HEIGHT_MM),
                }}
              >
                <div className="page-header flex justify-between items-center px-6">
                  <div className="text-xs font-medium">Confidential</div>
                  <div className="text-sm font-semibold">Legal Document</div>
                  <div className="text-xs">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>

                <div
                  className="page-body overflow-hidden px-6 mt-16"
                  style={{
                    flex: 1,
                    paddingTop: 0,
                    paddingBottom: 0,
                    marginTop: '20px',
                    marginBottom: 0,
                    height:
                      mmToPx(PAGE_HEIGHT_MM) - HEADER_HEIGHT - FOOTER_HEIGHT - 2,
                    boxSizing: 'border-box',
                  }}
                  dangerouslySetInnerHTML={{ __html: page.html }}
                />

                <div className="page-footer flex justify-between items-center px-6">
                  <div className="text-xs">Prepared for: Client Name</div>
                  <div className="text-xs">
                    Page {idx + 1} of {pages.length}
                  </div>
                  <div className="text-xs">© LawFirm</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scoped styles for pages and print */}
      <style>{`
        .page {
          background: white;
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
          position: relative;
          page-break-inside: avoid;
          break-inside: avoid;
          margin: 0 auto;
        }
        .page-header {
          height: ${HEADER_HEIGHT}px;
          border-bottom: 1px solid #e2e8f0;
          flex-shrink: 0;
          background: #f9fafb;
        }
        .page-footer {
          height: ${FOOTER_HEIGHT}px;
          border-top: 1px solid #e2e8f0;
          flex-shrink: 0;
          background: #f9fafb;
        }
        @media print {
          body {
            background: white !important;
          }
          .page {
            box-shadow: none;
            margin: 0;
            page-break-after: always;
          }
          .page-header,
          .page-footer {
            background: white;
          }
          /* Only print preview tab content */
          [role="tabpanel"]:not([aria-label="Preview tab"]) {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Editor;
