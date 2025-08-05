// src/extensions/PageBreak.ts
import { Node, mergeAttributes } from '@tiptap/core';


export const PageBreak = Node.create({
  name: 'pageBreak',

  group: 'block',
  atom: true,
  selectable: true,
  draggable: false,

  parseHTML() {
    return [
      { tag: 'div[data-page-break]' },
      { tag: 'hr[data-page-break]' }, // legacy support
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-page-break': 'true',
        class: 'page-break-element',
        contenteditable: 'false',
      }),
      [
        'div',
        { class: 'page-break-visual' },
        ['div', { class: 'page-break-line' }],
        ['div', { class: 'page-break-label' }, '— Page Break —'],
      ],
    ];
  },

  addCommands() {
    return {
      insertPageBreak:
        () =>
        ({ chain }: any) => {
          return chain().insertContent({ type: this.name }).run();
        },

      insertPageBreakWithContent:
        () =>
        ({ chain }: any) => {
          return chain()
            .insertContent([
              { type: this.name },
              { type: 'paragraph' }, // ensures cursor lands in new paragraph
            ])
            .run();
        },
    };
  },


  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-id'),
        renderHTML: (attributes) => {
          if (!attributes.id) return {};
          return { 'data-id': attributes.id };
        },
      },
    };
  },

  addNodeView() {
    return ({ editor, getPos }) => {
      const dom = document.createElement('div');
      dom.className = 'page-break-element';
      dom.setAttribute('data-page-break', 'true');
      dom.setAttribute('contenteditable', 'false');

      const visual = document.createElement('div');
      visual.className = 'page-break-visual';

      const line = document.createElement('div');
      line.className = 'page-break-line';

      const label = document.createElement('div');
      label.className = 'page-break-label';
      label.textContent = '— Page Break —';

      visual.appendChild(line);
      visual.appendChild(label);
      dom.appendChild(visual);

      // Click deletes the break

      dom.addEventListener('click', () => {
        if (typeof getPos === 'function') {
          const pos = getPos();
          if (typeof pos === 'number') {
            // Select the node then delete it
            editor.chain().focus().setNodeSelection(pos).deleteSelection().run();
          }
        }
      });

      dom.addEventListener('mouseenter', () => {
        dom.classList.add('page-break-hover');
      });
      dom.addEventListener('mouseleave', () => {
        dom.classList.remove('page-break-hover');
      });

      return {
        dom,
        contentDOM: null,
        update: () => false,
        destroy: () => {},
      };
    };
  },
});

// Export styles to inject or put in a shared CSS file
export const pageBreakStyles = `
.page-break-element {
  margin: 2rem 0;
  padding: 0;
  user-select: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-break-visual {
  position: relative;
  text-align: center;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-break-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent 0%,
    #cbd5e1 10%,
    #94a3b8 50%,
    #cbd5e1 90%,
    transparent 100%
  );
  transform: translateY(-50%);
}

.page-break-label {
  background: white;
  color: #64748b;
  font-size: 11px;
  font-weight: 500;
  padding: 4px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  position: relative;
  z-index: 1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.page-break-element:hover .page-break-label,
.page-break-hover .page-break-label {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.page-break-element:hover .page-break-label::after,
.page-break-hover .page-break-label::after {
  content: " (Click to delete)";
  font-size: 9px;
  opacity: 0.9;
}

.page-break-element.ProseMirror-selectednode .page-break-label {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px #93c5fd;
}

/* Print styles */
@media print {
  .page-break-element {
    page-break-after: always;
    break-after: page;
    margin: 0;
    height: 0;
    overflow: hidden;
  }

  .page-break-visual,
  .page-break-line,
  .page-break-label {
    display: none !important;
  }
}
`;

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pageBreak: {
      insertPageBreak: () => ReturnType;
      insertPageBreakWithContent: (content?: string) => ReturnType;
    };
  }
}
