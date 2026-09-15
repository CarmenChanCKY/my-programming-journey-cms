# Code Block Caption — Feature Plan

## Goal

Add a Notion/Medium-style editable caption to code blocks in the Tiptap editor. The caption appears directly below the code block in the editor canvas as an inline input field.

## HTML Contract (CMS + Blog)

### Saved output (`editor.getHTML()`)

```html
<!-- with caption -->
<figure class="codeblock-figure" data-codeblock-figure="">
  <pre class="language-typescript"><code class="language-typescript">...</code></pre>
  <figcaption class="codeblock-caption">plain text caption</figcaption>
</figure>

<!-- without caption (backward compatible) -->
<pre class="language-typescript"><code class="language-typescript">...</code></pre>
```

- Empty captions produce bare `<pre>` — no migration needed for existing posts.
- Blog side only needs CSS: `.codeblock-figure` (margin), `.codeblock-caption` (centered, small, muted).
- No JS needed on the blog side.

## Files Changed

### 1. `src/components/tiptap-editor/prism-plugin/CodeBlockPrismView.tsx` (new)

React NodeView component that renders the Notion-style in-editor experience.

- `NodeViewWrapper` as `<figure class="codeblock-figure">` with `ProseMirror-selectednode` class when selected.
- `pre > NodeViewContent as="code"` — preserves Prism inline decorations.
- `figcaption` (contentEditable=false) containing an `<input>` for the caption:
  - Always visible (Notion style — no hide/show toggle).
  - Placeholder: "Write a caption..."
  - `onChange` → `updateAttributes({ caption })`.
  - `onMouseDown` stops propagation (prevents ProseMirror from stealing focus).
  - Key handlers:
    - `Enter` → inserts a paragraph after the code block.
    - `ArrowUp` → jumps cursor to end of code.
    - `Escape` → blurs input, focuses editor.
    - All keys: `stopPropagation` to prevent ProseMirror capture.

### 2. `src/components/tiptap-editor/prism-plugin/code-block-prism.ts` (modified)

Extends `CodeBlock` with caption support and the NodeView.

- **`addAttributes()`**: adds `caption` (default `""`, `rendered: false`).
  - `parseHTML` extracts text from `<figcaption>` inside `<figure>`, returns `""` for bare `<pre>`.
- **`parseHTML()`**: two rules:
  - `figure[data-codeblock-figure]` with `contentElement: "pre code"` + `preserveWhitespace: "full"` — reads code text only, ignores `<figcaption>` (avoids double-node bug).
  - `pre` with `preserveWhitespace: "full"` — legacy fallback for bare code blocks.
- **`renderHTML()`**:
  - Empty caption → legacy bare `pre > code` (backward compat).
  - Non-empty → `figure > pre > code + figcaption.codeblock-caption`.
- **`addCommands()`**: `setCodeBlockCaption(caption)` and `unsetCodeBlockCaption()` via `updateAttributes`.
- **`addNodeView()`**: returns `ReactNodeViewRenderer(CodeBlockPrismView)`.
- **`addProseMirrorPlugins()`**: unchanged (PrismPlugin still finds `codeBlock` nodes via `findChildren`, works inside NodeView).

### 3. `src/components/tiptap-editor/EditorToolbar.tsx` (modified)

Language dropdown fix to preserve caption when switching languages.

- Before: always called `toggleCodeBlock({ language })` which unwrapped the node, losing caption.
- After: if `isActive("codeBlock")` → `updateAttributes("codeBlock", { language })`; otherwise `toggleCodeBlock`.

### 4. `src/styles/tiptap-editor.scss` (modified)

Editor-side styles for the figure/caption.

```scss
.codeblock-figure {
  margin: 0.5em 0;
  > pre { margin-bottom: 0; }
  &.ProseMirror-selectednode > pre {
    outline: 2px solid #a8c7fa;
    outline-offset: 2px;
  }
}

.codeblock-caption-wrap {
  margin-top: 0.4rem;
}

.codeblock-caption-input {
  width: 100%;
  text-align: left;
  font-size: 0.85rem;
  line-height: 1.6;
  color: rgba(0, 0, 0, 0.55);
  background: transparent;
  border: 0;
  outline: none;
  padding: 2px 8px;
  &::placeholder { color: rgba(0, 0, 0, 0.35); }
  &:focus { color: rgba(0, 0, 0, 0.8); }
}
```

## Key Design Decisions

1. **Attribute-based, not child-node**: Caption is stored as a node attribute (`caption: string`), not a separate ProseMirror node. This keeps the schema simple, avoids complex NodeView nesting, and lets `PrismPlugin` decorations work unchanged.

2. **NodeView for editor, attribute for storage**: The NodeView (`CodeBlockPrismView`) handles the interactive input in the editor. The `caption` attribute persists the value. `renderHTML` produces semantic `<figure>/<figcaption>` for the blog.

3. **`contentElement: "pre code"` on parse rule**: Prevents ProseMirror from re-matching the inner `<pre>` against the bare `pre` rule (which caused duplicate code blocks + stray paragraph on load).

4. **Always-visible caption input**: Unlike Notion's "Add caption" affordance that only shows on selection, the input is always rendered. This avoids the bug where the caption was invisible after creating a new code block (the `selected` prop is only true for whole-node selection, not cursor-inside).

5. **Backward compatibility**: Bare `<pre>` posts load fine (caption defaults to `""`). Empty captions produce bare `<pre>` output. No data migration needed.

## Bugs Fixed During Implementation

### Double code block on load

**Symptom**: Loading `<figure><pre><code>test</code></pre><figcaption>caption</figcaption></figure>` rendered two code blocks + a stray paragraph.

**Root cause**: `parseHTML()` had two rules (`figure` + bare `pre`) but no `contentElement`. ProseMirror matched the outer `<figure>` (codeBlock #1), descended into children, re-matched inner `<pre>` (codeBlock #2), and `<figcaption>` text fell through as `<p>`.

**Fix**: Added `contentElement: "pre code"` to the figure rule. Parser only reads code text; `<figcaption>` is ignored (caption extracted via `addAttributes().parseHTML`).

### Caption input invisible after creation

**Symptom**: Created a code block, no caption input visible.

**Root cause**: NodeView rendered caption only when `(caption || selected)`. The `selected` prop is only true for a whole-node selection, not when cursor is inside the code. New code blocks have empty caption, so neither condition was true.

**Fix**: Removed the conditional — always render the caption input.

### Language switch lost caption

**Symptom**: Switching language via toolbar dropdown erased the caption.

**Root cause**: Dropdown called `toggleCodeBlock({ language })` which unwraps and recreates the node, losing all attributes.

**Fix**: Use `updateAttributes("codeBlock", { language })` when already inside a code block; only `toggleCodeBlock` when creating a new one.

## Verification Checklist

1. `vite dev` → insert code block → type code → verify Prism highlighting works.
2. Click caption input → type text → verify `editor.getHTML()` contains `figure > figcaption`.
3. Reload editor with that HTML → code + caption reparsed correctly (single block, not two).
4. Empty caption → output is bare `<pre>` (backward compat).
5. Switch language via toolbar → caption preserved.
6. `Enter` in caption → paragraph inserted after code block.
7. `ArrowUp` in caption → focus jumps to end of code.
8. Paste external `<pre>` → loads as bare code block, no crash.
9. `npx tsc --noEmit` → clean.
