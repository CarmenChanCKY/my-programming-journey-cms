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
import { ImageExtension, ImageAligner } from "@harshtalks/image-tiptap";
import { TableKit } from "@tiptap/extension-table";
import CodeBlockPrism from "./prism-plugin";
import prismLanguageList from "@/components/tiptap-editor/prism-plugin/language-list";
import Callout from "./callout-plugin";
import { Controller, useFormContext } from "react-hook-form";
import "@/styles/tiptap-editor.scss";
import "@/styles/prism.css";

interface EditorInterface {
  name: string;
  // validate params
  required?: boolean;
}

const extensions = [
  StarterKit.configure({ codeBlock: false }),
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
  CodeBlockPrism.configure({
    defaultLanguage: "html",
    languageList: prismLanguageList.map((obj) => {
      return obj.value;
    }),
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
  Callout,
  ImageExtension,
  ImageAligner,
  TableKit.configure({
    table: { HTMLAttributes: { class: "post-table" }, resizable: false },
  }),
];

function TiptapEditor(props: EditorInterface) {
  const { control, setValue, formState, getFieldState, getValues } =
    useFormContext();
  const { invalid, error } = getFieldState(props.name, formState);

  return (
    <Controller
      control={control}
      name={props.name}
      rules={{
        required: { value: props.required ?? false, message: "Required." },
      }}
      render={({ field }) => {
        // remove ref from the spread to avoid passing a ref to a function component
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ref, ...fieldWithoutRef } = field;

        return (
          <>
            <div className="tiptap-editor-container">
              <EditorProvider
                {...fieldWithoutRef}
                onUpdate={({ editor }) => {
                  const html = editor.getHTML();
                  field.onChange(html);
                  setValue(props.name, html);
                }}
                slotBefore={<EditorToolbar />}
                extensions={extensions as any}
                content={field.value || getValues(props.name)}
                injectCSS={true}
              ></EditorProvider>
            </div>

            {/* error message */}
            {invalid ? <div className="error-msg">{error?.message}</div> : null}
          </>
        );
      }}
    ></Controller>
  );
}

export default TiptapEditor;
