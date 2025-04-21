// src/Tiptap.tsx
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import EditorToolbar from "@/components/tiptap-editor/EditorToolbar";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import "@/styles/tiptap-editor.scss";

// define your extension array
const extensions = [
  StarterKit,
  Underline,
  TextAlign.configure({
    types: ["heading", "paragraph", "bulletList", "orderedList"],
  }),
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true })
];

const content = "<p>Hello World!</p>";

function TiptapEditor() {
  return (
    <EditorProvider
      slotBefore={<EditorToolbar />}
      extensions={extensions}
      content={content}
      injectCSS={true}
    ></EditorProvider>
  );
}

export default TiptapEditor;
