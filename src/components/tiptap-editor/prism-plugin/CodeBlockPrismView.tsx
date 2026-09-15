import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";

function CodeBlockPrismView(props: NodeViewProps) {
  const { node, selected, updateAttributes, extension, editor, getPos } = props;
  const caption: string = node.attrs.caption ?? "";
  const language: string | null = node.attrs.language ?? null;
  const languageClassPrefix: string =
    (extension.options?.languageClassPrefix as string | undefined) ??
    "language-";
  const languageClass = language
    ? `${languageClassPrefix}${language}`
    : undefined;

  const focusCodeEnd = () => {
    if (typeof getPos !== "function") return;
    const pos = getPos();
    if (typeof pos !== "number") return;
    // pos = start of codeBlock node; pos + nodeSize - 1 = end of text content
    const end = pos + node.nodeSize - 1;
    editor.chain().setTextSelection(end).focus().run();
  };

  const exitToNextParagraph = () => {
    if (typeof getPos !== "function") return;
    const pos = getPos();
    if (typeof pos !== "number") return;
    const after = pos + node.nodeSize;
    editor.chain().focus().insertContentAt(after, { type: "paragraph" }).run();
  };

  return (
    <NodeViewWrapper
      as="figure"
      className={`codeblock-figure${selected ? " ProseMirror-selectednode" : ""}`}
      data-codeblock-figure=""
    >
      <pre className={languageClass}>
        <NodeViewContent as="code" className={languageClass} />
      </pre>

      <figcaption
        contentEditable={false}
        className="codeblock-caption-wrap"
        data-caption-wrap=""
      >
        <input
          className="codeblock-caption-input"
          value={caption}
          placeholder="Write a caption..."
          aria-label="Code block caption"
          onChange={(e) => updateAttributes({ caption: e.target.value })}
          onMouseDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Enter") {
              e.preventDefault();
              exitToNextParagraph();
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              focusCodeEnd();
            } else if (e.key === "Escape") {
              (e.target as HTMLInputElement).blur();
              editor.commands.focus();
            }
          }}
        />
      </figcaption>
    </NodeViewWrapper>
  );
}

export default CodeBlockPrismView;
