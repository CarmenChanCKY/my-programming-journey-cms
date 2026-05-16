import { Table } from '@tiptap/extension-table';
import { mergeAttributes } from '@tiptap/core';

/**
 * Custom Table extension that fixes the HTMLAttributes bug in @tiptap/extension-table
 * Issue: https://github.com/ueberdosis/tiptap/issues/7834
 * 
 * The original Table extension doesn't properly apply HTMLAttributes to the table element.
 * This extension overrides renderHTML to ensure HTMLAttributes are correctly applied.
 * 
 * For the editor view, use CSS selectors like:
 * .tiptap-editor-container table { ... }
 * or add the class via CSS:
 * .tiptap-editor-container .tableWrapper table { ... }
 */
const CustomTable = Table.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {},
    };
  },

  renderHTML({ HTMLAttributes }) {
    // Merge the configured HTMLAttributes with defaults
    const attributes = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes);

    return ['table', attributes, ['tbody', 0]];
  },
});

export default CustomTable;
