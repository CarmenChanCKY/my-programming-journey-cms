import CodeBlock, { CodeBlockOptions } from "@tiptap/extension-code-block";

import { PrismPlugin } from "./prism-plugin";
import { mergeAttributes } from "@tiptap/react";

export interface CodeBlockPrismOptions extends CodeBlockOptions {
  defaultLanguage: string | null | undefined;
  languageList: Array<string>;
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
    return [
      "pre",
      mergeAttributes(
        {
          ...this.options.HTMLAttributes,
          class: node.attrs.language
            ? this.options.languageClassPrefix + node.attrs.language
            : null,
        },
        HTMLAttributes
      ),
      [
        "code",
        {
          class: node.attrs.language
            ? this.options.languageClassPrefix + node.attrs.language
            : null,
        },
        0,
      ],
    ];
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
