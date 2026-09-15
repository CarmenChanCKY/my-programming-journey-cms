import CodeBlock, { CodeBlockOptions } from "@tiptap/extension-code-block";

import { PrismPlugin } from "./prism-plugin";
import { ReactNodeViewRenderer, mergeAttributes } from "@tiptap/react";
import CodeBlockPrismView from "./CodeBlockPrismView";

export interface CodeBlockPrismOptions extends CodeBlockOptions {
  defaultLanguage: string | null | undefined;
  languageList: Array<string>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    codeBlockPrism: {
      /**
       * Set the caption of the active code block
       */
      setCodeBlockCaption: (caption: string) => ReturnType;
      /**
       * Remove the caption of the active code block
       */
      unsetCodeBlockCaption: () => ReturnType;
    };
  }
}

export const CodeBlockPrism = CodeBlock.extend<CodeBlockPrismOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      defaultLanguage: "plain",
      languageList: [],
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    const languageClass = node.attrs.language
      ? this.options.languageClassPrefix + node.attrs.language
      : null;
    const caption: string = node.attrs.caption ?? "";

    // No caption -> keep legacy bare <pre> output for backward compat
    if (!caption) {
      return [
        "pre",
        mergeAttributes(
          {
            ...this.options.HTMLAttributes,
            class: languageClass,
          },
          HTMLAttributes,
        ),
        [
          "code",
          {
            class: languageClass,
          },
          0,
        ],
      ];
    }

    return [
      "figure",
      mergeAttributes(
        {
          ...this.options.HTMLAttributes,
          class: "codeblock-figure",
          "data-codeblock-figure": "",
        },
        HTMLAttributes,
      ),
      [
        "pre",
        {
          class: languageClass,
        },
        [
          "code",
          {
            class: languageClass,
          },
          0,
        ],
      ],
      ["figcaption", { class: "codeblock-caption" }, caption],
    ];
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: "",
        rendered: false,
        parseHTML: (element) => {
          // New format: <figure><figcaption>...</figcaption></figure>
          // Legacy format: bare <pre> -> no caption
          if (element.tagName === "FIGURE") {
            return element.querySelector("figcaption")?.textContent ?? "";
          }
          return "";
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        // Only parse code text from inside <pre><code>, ignore <figcaption>
        // (caption is extracted via addAttributes). Without contentElement,
        // the inner <pre> re-matches the rule below and splits into two nodes.
        tag: "figure[data-codeblock-figure]",
        contentElement: "pre code",
        preserveWhitespace: "full",
      },
      {
        tag: "pre",
        preserveWhitespace: "full",
      },
    ];
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setCodeBlockCaption:
        (caption: string) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { caption });
        },
      unsetCodeBlockCaption:
        () =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { caption: "" });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockPrismView);
  },

  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() || []),
      PrismPlugin({
        name: this.name,
        defaultLanguage: this.options.defaultLanguage,
        languageList: this.options.languageList,
      }),
    ];
  },
});
