// src/Tiptap.tsx
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import EditorToolbar from "@/components/tiptap-editor/EditorToolbar";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Code from "@tiptap/extension-code";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import "@/styles/tiptap-editor.scss";

// define your extension array
const extensions = [
  StarterKit,
  Underline,
  TextAlign.configure({
    types: ["heading", "paragraph", "bulletList", "orderedList", "blockquote"],
  }),
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
  Code.configure({
    HTMLAttributes: {
      class: "inline-code",
    },
  }),
  Youtube,
  Link.configure({
    autolink: false,
    linkOnPaste: false,
    HTMLAttributes: {
      class: "post-hyperlink",
    },
    isAllowedUri: (url, ctx) => {
      try {
        // construct URL
        const parsedUrl = url.includes(":")
          ? new URL(url)
          : new URL(`${ctx.defaultProtocol}://${url}`);

        // use default validation
        if (!ctx.defaultValidate(parsedUrl.href)) {
          return false;
        }

        // disallowed protocols
        const disallowedProtocols = ["ftp", "file", "mailto"];
        const protocol = parsedUrl.protocol.replace(":", "");

        if (disallowedProtocols.includes(protocol)) {
          return false;
        }

        return true;
      } catch {
        return false;
      }
    },
  }),
];

const content = "<p>Hello World!</p>";

function TiptapEditor() {
  return (
    <div className="tiptap-editor-container">
      <EditorProvider
        // onUpdate={(props) => {
        //   console.log(props.editor.getHTML());
        // }}
        slotBefore={<EditorToolbar />}
        extensions={extensions}
        content={content}
        injectCSS={true}
      ></EditorProvider>
    </div>
  );
}

export default TiptapEditor;
